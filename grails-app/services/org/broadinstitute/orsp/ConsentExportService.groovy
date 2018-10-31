package org.broadinstitute.orsp

import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.config.ConsentConfiguration
import org.broadinstitute.orsp.consent.AssociationType
import org.broadinstitute.orsp.consent.ConsentAssociation
import org.broadinstitute.orsp.consent.ConsentResource

import java.sql.Timestamp

/**
 * Specialized service class that handles the create/update of a consent in DUOS.
 */
@Slf4j
class ConsentExportService {

    ConsentConfiguration consentConfiguration
    ConsentService consentService
    PersistenceService persistenceService

    /**
     * Main handler for create/update consent. All logic is encapsulated here.
     *
     * Create/Update Logic:
     *   If the consent does not exist,
     *      create consent,
     *      upload sample associations,
     *      upload dul
     *   If the consent does exist:
     *      get full consent object from DUOS
     *      update consent resource with new values from ORSP's data use restriction
     *          if dul is new, then post with no value so current version is archived/deleted
     *      update sample associations      (fewer operations if we always update instead of querying, then updating if newer)
     *      update dul only if newer        (we don't want to always put new ones so we don't end up with duplicate GCS files)
     *
     * @param restriction
     * @param sampleCollectionIds
     * @param dataUseLetter
     * @param consentGroupName
     * @return Updated/Created Consent in the form of a ConsentResource
     */
    ConsentResource exportConsent(
            User user,
            DataUseRestriction restriction,
            Collection<String> sampleCollectionIds,
            StorageDocument dataUseLetter,
            String consentGroupName) {
        ConsentResource newConsent
        if (restriction.vaultConsentId) {
            // double check that we really do have a consent in DUOS since ORSP might have inaccurate data, especially in dev.
            ConsentResource resource = consentService.getConsent(getConsentLocation(restriction))
            if (resource) {
                newConsent = update(user, restriction, sampleCollectionIds, dataUseLetter, resource, consentGroupName)
            } else {
                newConsent = create(user, restriction, sampleCollectionIds, dataUseLetter, consentGroupName)
            }
        } else {
            newConsent = create(user, restriction, sampleCollectionIds, dataUseLetter, consentGroupName)
        }
        newConsent.setGroupName(consentGroupName)
        newConsent
    }

    private String getConsentLocation(DataUseRestriction restriction) {
        consentConfiguration.url + "/" + restriction.getVaultConsentId()
    }

    /**
     * Workflow for updating an existing consent in DUOS
     */
    private ConsentResource update(
            User user,
            DataUseRestriction restriction,
            Collection<String> sampleCollectionIds,
            StorageDocument dataUseLetter,
            ConsentResource resource,
            String consentGroupName) {
        updateDuosConsent(user, restriction, resource, consentGroupName)
        uploadConsentAssociations(user, sampleCollectionIds, restriction)
        if (dataUseLetter) {
            // Erring on the side of safety. In the absence of good data, assume that ORSP's Data Use Letter
            // is more recent than the version of the consent in DUOS
            Date now = new Date()
            Timestamp dulTimestamp = (dataUseLetter?.createDate ?: now).toTimestamp()
            Timestamp consentTimestamp = (resource?.lastUpdate ?: now - 1).toTimestamp()
            Boolean filesChanged = !dataUseLetter.fileName.equalsIgnoreCase(resource.dulName)
            if (filesChanged || dulTimestamp.after(consentTimestamp)) {
                uploadDataUseLetter(user, dataUseLetter, restriction)
            }
        }
        consentService.getConsent(getConsentLocation(restriction))
    }

    /**
     * Workflow for creating a new consent in DUOS
     */
    private ConsentResource create(
            User user,
            DataUseRestriction restriction,
            Collection<String> sampleCollectionIds,
            StorageDocument dataUseLetter,
            String consentGroupName) {
        createDuosConsent(user, restriction, consentGroupName)
        uploadConsentAssociations(user, sampleCollectionIds, restriction)
        uploadDataUseLetter(user, dataUseLetter, restriction)
        consentService.getConsent(getConsentLocation(restriction))
    }

    /**
     * Handler for creating a new Consent in DUOS
     */
    private def createDuosConsent(User user, DataUseRestriction restriction, String consentGroupName) {
        ConsentResource resource = consentService.buildConsentResource(restriction, consentGroupName)
        // Error condition here is if there is a duplicate-named consent in DUOS, but ORSP doesn't
        // know about it. This requires manual intervention by an administrator to resolve.
        // Exception message should contain enough information to handle appropriately
        String location = consentService.postConsent(resource)
        if (location) {
            persistenceService.saveEvent(restriction.getConsentGroupKey(), user.displayName, "Consent Restriction Exported to DUOS", EventType.DUOS_CONSENT_CREATE)
            restriction.vaultExportDate = new Date()
            restriction.vaultConsentLocation = location.toString()
            restriction.vaultConsentId = location.toString().tokenize('/').last()
            restriction.save(flush: true)
        } else {
            consentService.throwConsentException("Unable to create DUOS consent for Consent Group: ${restriction.getConsentGroupKey()}")
        }
    }

    /**
     * Handler for updating a Consent in DUOS
     */
    private def updateDuosConsent(User user, DataUseRestriction restriction, ConsentResource currentResource, String consentGroupName) {
        ConsentResource resource = consentService.buildConsentResource(restriction, consentGroupName)
        resource.setDataUseLetter(currentResource.getDataUseLetter())
        resource.setDulName(currentResource.getDulName())
        if (consentService.updateConsent(resource, getConsentLocation(restriction))) {
            persistenceService.saveEvent(restriction.consentGroupKey, user.displayName, "Consent Restriction DUOS Export Updated", EventType.DUOS_CONSENT_UPDATE)
            restriction.vaultExportDate = new Date()
            restriction.save(flush: true)
        } else {
            consentService.throwConsentException("Unable to update DUOS consent for Consent Group: ${restriction.getConsentGroupKey()}")
        }
    }

    /**
     * Handler for uploading Consent Associations to DUOS
     */
    def uploadConsentAssociations(User user, Collection<String> sampleCollectionIds, DataUseRestriction restriction) {
        if (sampleCollectionIds && !sampleCollectionIds.isEmpty() && !sampleCollectionIds.any {it.isEmpty()}) {
            ConsentAssociation association = new ConsentAssociation(
                    associationType: AssociationType.SAMPLE_SET.type,
                    elements: sampleCollectionIds)
            if (consentService.postConsentAssociations(getConsentLocation(restriction), association)) {
                persistenceService.saveEvent(restriction.consentGroupKey, user.displayName, "Consent Sample Association Exported to DUOS", EventType.DUOS_CONSENT_SAMPLES_EXPORT)
            } else {
                consentService.throwConsentException("Unable to upload sample collections [${sampleCollectionIds.join(", ")}] for Consent Group: ${restriction.getConsentGroupKey()}")
            }
        }
    }

    /**
     * Handler for uploading a DUL to the DUOS
     */
    def uploadDataUseLetter(User user, StorageDocument dataUseLetter, DataUseRestriction restriction) {
        if (dataUseLetter) {
            if (consentService.postDataUseLetter(
                    getConsentLocation(restriction),
                    dataUseLetter.inputStream,
                    dataUseLetter.fileName)) {
                persistenceService.saveEvent(restriction.consentGroupKey, user.displayName, "Consent Data Use Letter Exported to DUOS", EventType.DUOS_CONSENT_DUL_EXPORT)
            } else {
                consentService.throwConsentException("Unable to post data use letter to DUOS for Consent Group: ${restriction.getConsentGroupKey()}")
            }
        }
    }

}
