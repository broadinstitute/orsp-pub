package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j

/**
 * This class handles transitions from state to state and the maintenance of Flags.
 *
 * The state transitions should be heavily refactored. The current approach is a direct transfer of the original
 * jira-based transition strategy that used a combination of temporary flags and status to determine "Status" and who
 * the current assignee(s) should be. This should be much simpler to maintain - look into alternate state transition
 * approaches.
 *
 * General Notes:
 *
 * Deleted flags will evaluate to "FALSE" which is why in many cases, flags are deleted but not re-created with a "No"
 * value.
 *
 * Transactional is applied only to certain methods which means that default != true for methods not marked as such.
 *

 Initial State:
 IRB Preparing Application:
     Supporting Documents submitted
     Supporting Documents reviewed
     Mod. Requested in Supporting Docs
     Supporting Documents Deemed Satisfactory
     Application submitted to ORSP
     Application reviewed
     Mod. Requested in Application
     ORSP considers Application ready for submission
     Application Signed
     IRB Requested Modification

 IRB Getting Signatures: (Can sign or abandon)
     Application accepted by ORSP
     Application Signed
     IRB Requested Modification

 IRB considering (IRB can Approve, request mod, or reject)
     Application accepted by ORSP
     Application Signed
     IRB Requested Modification

 IRB Approved
     N/A


 Notes: NE/NHSR are the same. Each one shows the same buttons and same flags in all states

 Initial State:
 NE/NHSR Submitting to ORSP
     Project has been submitted
     Project has been reviewed
     Modification requested
     Project accepted by ORSP
     The Broad Institute is not engaged in human subjects research.
     Project approved by Compliance Officer

 NE/NHSR Reviewing Form
     Project has been submitted
     Project has been reviewed
     Modification requested
     Project accepted by ORSP
     The Broad Institute is not engaged in human subjects research.
     Project approved by Compliance Officer

 NE/NHSR Getting CCO approval
     Project has been submitted
     Project has been reviewed
     Modification requested
     Project accepted by ORSP
     The Broad Institute is not engaged in human subjects research.
     Project approved by Compliance Officer

 NE/NHSR Completed
     N/A


 Globally Applicable States
    Closed
    Abandoned

 */
@SuppressWarnings("GrMethodMayBeStatic")
@Slf4j
class TransitionService {

    PersistenceService persistenceService

    /**
     * IRB and NE/NHSR.
     *
     * Handle the initial status setup for the project.
     * IRB projects go into the Preparing Application.
     * NE/NHSR projects go into Submitting to ORSP
     */
    @Transactional
    handleIntake(Issue issue, Collection<String> actors) throws DomainException {
        if (issue.type != IssueType.CONSENT_GROUP) {
            def deletableProperties = [IssueExtraProperty.ACTOR]
            deleteProps(issue, deletableProperties)
            // if pending documents or edits exists ORSP actor should be present
            if (!issue.attachmentsApproved() || IssueReview.findByProjectKey(issue.projectKey) != null) {
                if (!actors.contains(SupplementalRole.ORSP)) actors.add(SupplementalRole.ORSP)
            } else {
                actors.remove(SupplementalRole.ORSP)
            }
            actors.each {
                saveProp(issue, IssueExtraProperty.ACTOR, it)
            }
            issue.save(flush: true)
            if (issue.hasErrors()) { throw new DomainException(issue.getErrors().allErrors) }
        }
    }


    /**
     *
     * Handle the initial status setup for the project.
     *
     */
    @Transactional
    handleIntake(Issue issue, Collection<String> actors, String status) throws DomainException {
        if (issue.type != IssueType.CONSENT_GROUP) {
            actors.each {
                saveProp(issue, IssueExtraProperty.ACTOR, it)
            }
            issue.setStatus(status)
            issue.save(flush: true)
            if (issue.hasErrors()) { throw new DomainException(issue.getErrors().allErrors) }
        }
    }

    /**
     * NE/NHSR Only
     *
     * transition to "Reviewing form", setting "submitted" to true
     */
    @Transactional
    submit(Issue issue, String comment, String author) throws DomainException {
        def deletableProperties = [
                IssueExtraProperty.ACTOR,
                IssueExtraProperty.LOCKED,
                IssueExtraProperty.PROJ_SUBMITTED,
                IssueExtraProperty.PROJ_REVIEWED,
                IssueExtraProperty.PROJ_MOD_REQUESTED
        ]
        deleteProps(issue, deletableProperties)

        saveProp(issue, IssueExtraProperty.ACTOR, "ORSP")
        saveProp(issue, IssueExtraProperty.PROJ_SUBMITTED, "Yes")
        saveProp(issue, IssueExtraProperty.LOCKED, "Yes")
        persistenceService.saveComment(issue.projectKey, author, comment)

        issue.setStatus(IssueStatus.ReviewingForm.name)
        persistenceService.saveEvent(issue.projectKey, author, "Reviewing Form", EventType.REVIEWING_FORM)
        issue.save(flush: true)
        if (issue.hasErrors()) { throw new DomainException(issue.getErrors().allErrors) }

    }

    /**
     * NE/NHSR Only
     *
     * transition to "Submitting to ORSP" AND setting "modRequested",
     * and clearing "submitted"
     */
    @Transactional
    modify(Issue issue, Collection<String> actors, String comment, String author) throws DomainException {
        def deletableProperties = [
                IssueExtraProperty.ACTOR,
                IssueExtraProperty.LOCKED,
                IssueExtraProperty.PROJ_MOD_REQUESTED,
                IssueExtraProperty.PROJ_REVIEWED,
                IssueExtraProperty.PROJ_SUBMITTED
        ]
        deleteProps(issue, deletableProperties)

        actors.each {
            saveProp(issue, IssueExtraProperty.ACTOR, it)
        }
        saveProp(issue, IssueExtraProperty.PROJ_MOD_REQUESTED, "Yes")
        saveProp(issue, IssueExtraProperty.PROJ_REVIEWED, "Yes")
        persistenceService.saveComment(issue.projectKey, author, comment)

        issue.setStatus(IssueStatus.SubmittingToORSP.name)
        persistenceService.saveEvent(issue.projectKey, author, "Modification Requested", EventType.INITIAL_STATE)
        issue.save(flush: true)
        if (issue.hasErrors()) { throw new DomainException(issue.getErrors().allErrors) }
    }

    /**
     * NE/NHSR Only
     *
     * transition to "Getting CCO Approval"
     */
    @Transactional
    accept(Issue issue, String comment, String author) throws DomainException {
        def deletableProperties = [
                IssueExtraProperty.ACTOR,
                IssueExtraProperty.LOCKED,
                IssueExtraProperty.PROJ_ORSP_ACCEPTED,
                IssueExtraProperty.PROJ_REVIEWED,
                IssueExtraProperty.PROJ_MOD_REQUESTED
        ]
        deleteProps(issue, deletableProperties)

        SupplementalRole.ORSP_ROLES.each {
            saveProp(issue, IssueExtraProperty.ACTOR, it)
        }
        saveProp(issue, IssueExtraProperty.LOCKED, "Yes")
        saveProp(issue, IssueExtraProperty.PROJ_ORSP_ACCEPTED, "Yes")
        saveProp(issue, IssueExtraProperty.PROJ_REVIEWED, "Yes")
        persistenceService.saveComment(issue.projectKey, author, comment)

        issue.setStatus(IssueStatus.GettingCCOApproval.name)
        persistenceService.saveEvent(issue.projectKey, author, "Getting CCO Approval", EventType.GETTING_CCO_APPROVAL)
        issue.save(flush: true)
        if (issue.hasErrors()) { throw new DomainException(issue.getErrors().allErrors) }
    }

    /**
     * NE/NHSR Only
     *
     * transition to "Complete"
     */
    @Transactional
    neComplete(Issue issue, String comment, String author) throws DomainException {
        def deletableProperties = [IssueExtraProperty.ACTOR]
        deleteProps(issue, deletableProperties)

        saveProp(issue, IssueExtraProperty.PROJ_CO_ACCEPTED, "Yes")
        persistenceService.saveComment(issue.projectKey, author, comment)

        issue.setStatus(IssueStatus.Completed.name)
        persistenceService.saveEvent(issue.projectKey, author, "Project Completed", EventType.COMPLETED)
        issue.save(flush: true)
        if (issue.hasErrors()) { throw new DomainException(issue.getErrors().allErrors) }
    }

    /**
     * IRB and NE/NHSR.
     *
     * Transition to Abandoned
     */
    @Transactional
    abandon(Issue issue, String comment, String author) throws DomainException {
        def deletableProperties = [IssueExtraProperty.ACTOR]
        deleteProps(issue, deletableProperties)

        issue.setStatus(IssueStatus.Abandoned.name)
        persistenceService.saveComment(issue.projectKey, author, comment)
        persistenceService.saveEvent(issue.projectKey, author, "Abandoning Project", EventType.ABANDON)
        issue.save(flush: true)
        if (issue.hasErrors()) { throw new DomainException(issue.getErrors().allErrors) }
    }

    /**
     * IRB and NE/NHSR.
     *
     * Transition to Closed
     */
    @Transactional
    close(Issue issue, String comment, String author) throws DomainException {
        def deletableProperties = [IssueExtraProperty.ACTOR]
        deleteProps(issue, deletableProperties)

        issue.setStatus(IssueStatus.Closed.name)
        persistenceService.saveComment(issue.projectKey, author, comment)
        persistenceService.saveEvent(issue.projectKey, author, "Closing Project", EventType.CLOSED)
        issue.save(flush: true)
        if (issue.hasErrors()) { throw new DomainException(issue.getErrors().allErrors) }
    }

    /**
     * IRB Only
     *
     * Handle the case where the application has been "Signed" by the IRB.
     */
    @Transactional
    appSigned(Issue issue, String author) throws DomainException {
        def deletableProperties = [
                IssueExtraProperty.ACTOR,
                IssueExtraProperty.LOCKED,
                IssueExtraProperty.APP_SIGNED_FLAG
        ]
        deleteProps(issue, deletableProperties)

        saveProp(issue, IssueExtraProperty.ACTOR, "ORSP")
        saveProp(issue, IssueExtraProperty.LOCKED, "Yes")
        saveProp(issue, IssueExtraProperty.APP_SIGNED_FLAG, "Yes")
        issue.setStatus(IssueStatus.IRBConsidering.name)
        persistenceService.saveEvent(issue.projectKey, author, IssueStatus.IRBConsidering.name, EventType.IRB_CONSIDERING)
        issue.save(flush: true)
        if (issue.hasErrors()) { throw new DomainException(issue.getErrors().allErrors) }
    }

    /**
     * IRB Only
     *
     * Handle the case where the application has been "Approved" by the IRB.
     */
    @Transactional
    irbApprove(Issue issue, String comment, String author) throws DomainException {
        def deletableProperties = [IssueExtraProperty.ACTOR]
        deleteProps(issue, deletableProperties)

        issue.setStatus(IssueStatus.Approved.name)
        persistenceService.saveComment(issue.projectKey, author, comment)
        persistenceService.saveEvent(issue.projectKey, author, "IRB Approves Application", EventType.APPROVED)
        issue.save(flush: true)
        if (issue.hasErrors()) { throw new DomainException(issue.getErrors().allErrors) }
    }

    /**
     * IRB Only
     *
     * Handle the case where the IRB has requested modifications.
     */
    @Transactional
    irbRequestMod(Issue issue, Collection<String> actors, String comment, String author) throws DomainException {
        def deletableProperties = [
                IssueExtraProperty.ACTOR,
                IssueExtraProperty.LOCKED,
                IssueExtraProperty.IRB_MOD_REQUESTED_FLAG,
                IssueExtraProperty.APP_ACCEPTED_FLAG,
                IssueExtraProperty.APP_SUBMITTED_FLAG
        ]
        deleteProps(issue, deletableProperties)

        actors?.each {
            saveProp(issue, IssueExtraProperty.ACTOR, it)
        }

        saveProp(issue, IssueExtraProperty.IRB_MOD_REQUESTED_FLAG, "Yes")
        saveProp(issue, IssueExtraProperty.APP_MOD_REQUESTED_FLAG, "Yes")
        persistenceService.saveComment(issue.projectKey, author, comment)
        issue.setStatus(IssueStatus.PreparingApplication.name)
        persistenceService.saveEvent(issue.projectKey, author, "IRB Requests Modification", EventType.INITIAL_STATE)
        issue.save(flush: true)
        if (issue.hasErrors()) { throw new DomainException(issue.getErrors().allErrors) }
    }

    /**
     * IRB Only
     *
     * Handle the case where ORSP is accepting the application.
     */
    @Transactional
    appAccept(Issue issue, Collection<String> actors, String comment, String author) throws DomainException {
        def deletableProperties = [
                IssueExtraProperty.ACTOR,
                IssueExtraProperty.APP_ACCEPTED_FLAG,
                IssueExtraProperty.APP_REVIEWED_FLAG,
                IssueExtraProperty.APP_MOD_REQUESTED_FLAG,
                IssueExtraProperty.IRB_MOD_REQUESTED_FLAG
        ]
        deleteProps(issue, deletableProperties)

        saveProp(issue, IssueExtraProperty.APP_ACCEPTED_FLAG, "Yes")
        saveProp(issue, IssueExtraProperty.APP_REVIEWED_FLAG, "Yes")

        actors?.each {
            saveProp(issue, IssueExtraProperty.ACTOR, it)
        }
        persistenceService.saveComment(issue.projectKey, author, comment)

        if (issue.isFlagSet(IssueExtraProperty.SUPPORT_ACCEPTED_FLAG)) {
            issue.setStatus(IssueStatus.GettingSignatures.name)
            persistenceService.saveEvent(issue.projectKey, author, "ORSP Accepts Application", EventType.GETTING_SIGNATURES)
        }
        issue = issue.save(flush: true)
        if (issue.hasErrors()) { throw new DomainException(issue.getErrors().allErrors) }
    }

    /**
     * IRB Only
     *
     * Handle the slightly more complex case where IRB project is accepted by ORSP.
     */
    @Transactional
    supportAccept(Issue issue, Collection<String> actors, String comment, String author) throws DomainException {
        def deletableProperties = [
                IssueExtraProperty.ACTOR,
                IssueExtraProperty.SUPPORT_REVIEWED_FLAG,
                IssueExtraProperty.SUPPORT_ACCEPTED_FLAG,
                IssueExtraProperty.SUP_MOD_REQUESTED_FLAG
        ]
        deleteProps(issue, deletableProperties)

        saveProp(issue, IssueExtraProperty.SUPPORT_REVIEWED_FLAG, "Yes")
        saveProp(issue, IssueExtraProperty.SUPPORT_ACCEPTED_FLAG, "Yes")

        if (issue.isFlagSet(IssueExtraProperty.APP_SUBMITTED_FLAG) && !issue.isFlagSet(IssueExtraProperty.APP_ACCEPTED_FLAG)) {
            (actors + ["ORSP"]).each {
                saveProp(issue, IssueExtraProperty.ACTOR, it)
            }
        } else {
            actors?.each {
                saveProp(issue, IssueExtraProperty.ACTOR, it)
            }
        }
        persistenceService.saveComment(issue.projectKey, author, comment)

        if (issue.isFlagSet(IssueExtraProperty.APP_ACCEPTED_FLAG)) {
            issue.setStatus(IssueStatus.GettingSignatures.name)
            persistenceService.saveEvent(issue.projectKey, author, "ORSP Accepts Application", EventType.GETTING_SIGNATURES)
        }
        issue.save(flush: true)
        if (issue.hasErrors()) { throw new DomainException(issue.getErrors().allErrors) }
    }

    /**
     * IRB Only
     *
     * Handle the case where the project manager is submitting supporting documents to ORSP.
     */
    @Transactional
    supportSubmit(Issue issue, String comment, String author) throws DomainException {
        def deletableProperties = [
                IssueExtraProperty.LOCKED,
                IssueExtraProperty.SUPPORT_SUBMITTED_FLAG,
                IssueExtraProperty.SUPPORT_REVIEWED_FLAG,
                IssueExtraProperty.SUP_MOD_REQUESTED_FLAG
        ]
        deleteProps(issue, deletableProperties)

        if (issue.isFlagSet(IssueExtraProperty.APP_SUBMITTED_FLAG)) {
            saveProp(issue, IssueExtraProperty.LOCKED, "Yes")
        }
        saveProp(issue, IssueExtraProperty.SUPPORT_SUBMITTED_FLAG, "Yes")
        persistenceService.saveComment(issue.projectKey, author, comment)
        persistenceService.saveEvent(issue.projectKey, author, "Project Manager Submits Supporting Documents", EventType.INITIAL_STATE)
        issue.save(flush: true)
        if (issue.hasErrors()) { throw new DomainException(issue.getErrors().allErrors) }
    }

    /**
     * IRB Only
     *
     * Handle the case where the project manager is submitting an application to ORSP.
     */
    @Transactional
    appSubmit(Issue issue, String comment, String author) throws DomainException {
        def deletableProperties = [
                IssueExtraProperty.ACTOR,
                IssueExtraProperty.LOCKED,
                IssueExtraProperty.APP_SUBMITTED_FLAG,
                IssueExtraProperty.APP_REVIEWED_FLAG,
                IssueExtraProperty.APP_MOD_REQUESTED_FLAG
        ]
        deleteProps(issue, deletableProperties)

        saveProp(issue, IssueExtraProperty.ACTOR, "ORSP")
        if (issue.isFlagSet(IssueExtraProperty.SUPPORT_SUBMITTED_FLAG)) {
            saveProp(issue, IssueExtraProperty.LOCKED, "Yes")
        }
        saveProp(issue, IssueExtraProperty.APP_SUBMITTED_FLAG, "Yes")
        persistenceService.saveComment(issue.projectKey, author, comment)
        persistenceService.saveEvent(issue.projectKey, author, "Project Manager Submits Application", EventType.INITIAL_STATE)
        issue.save(flush: true)
        if (issue.hasErrors()) { throw new DomainException(issue.getErrors().allErrors) }
    }

    /**
     * IRB Only
     *
     * Handles the case where ORSP requests modification to the supporting documents
     */
    @Transactional
    supportModify(Issue issue, Collection<String> actors, String comment, String author) throws DomainException {
        def deletableProperties = [
                IssueExtraProperty.ACTOR,
                IssueExtraProperty.LOCKED,
                IssueExtraProperty.SUPPORT_REVIEWED_FLAG,
                IssueExtraProperty.SUP_MOD_REQUESTED_FLAG,
                IssueExtraProperty.SUPPORT_SUBMITTED_FLAG
        ]
        deleteProps(issue, deletableProperties)

        actors.each {
            saveProp(issue, IssueExtraProperty.ACTOR, it)
        }
        saveProp(issue, IssueExtraProperty.SUPPORT_REVIEWED_FLAG, "Yes")
        saveProp(issue, IssueExtraProperty.SUP_MOD_REQUESTED_FLAG, "Yes")
        persistenceService.saveComment(issue.projectKey, author, comment)
        persistenceService.saveEvent(issue.projectKey, author, "ORSP Requests Modification to Supporting Documentation", EventType.INITIAL_STATE)
        issue.save(flush: true)
        if (issue.hasErrors()) { throw new DomainException(issue.getErrors().allErrors) }
    }

    /**
     * IRB Only
     *
     * Handles the case where ORSP requests modification to the application
     */
    @Transactional
    appModify(Issue issue, Collection<String> actors, String comment, String author) throws DomainException {
        def deletableProperties = [
                IssueExtraProperty.ACTOR,
                IssueExtraProperty.LOCKED,
                IssueExtraProperty.APP_MOD_REQUESTED_FLAG,
                IssueExtraProperty.APP_REVIEWED_FLAG,
                IssueExtraProperty.APP_ACCEPTED_FLAG,
                IssueExtraProperty.APP_SUBMITTED_FLAG
        ]
        deleteProps(issue, deletableProperties)

        actors.each {
            saveProp(issue, IssueExtraProperty.ACTOR, it)
        }
        saveProp(issue, IssueExtraProperty.APP_MOD_REQUESTED_FLAG, "Yes")
        saveProp(issue, IssueExtraProperty.APP_REVIEWED_FLAG, "Yes")
        persistenceService.saveComment(issue.projectKey, author, comment)
        persistenceService.saveEvent(issue.projectKey, author, "ORSP Requests Modification to Application", EventType.INITIAL_STATE)
        issue.save(flush: true)
        if (issue.hasErrors()) { throw new DomainException(issue.getErrors().allErrors) }
    }

    /**
     * Convenience method intended to be used only from within a transactional method and not for general client use.
     * Removes all property instances from the issue that match the list of property names
     *
     * @param issue
     * @param propNames
     * @throws DomainException
     */
    private final deleteProps(Issue issue, List<String> propNames) {
        issue.getExtraProperties().findAll {
            propNames.contains(it.name)
        }.each {
            issue.removeFromExtraProperties(it)
            it.delete(hard: true, flush: true)
        }
    }

    /**
     * Convenience method intended to be used only from within a transactional method and not for general client use.
     * Creates a property instance for the issue with the provided information.
     *
     * @param issue
     * @param name
     * @param value
     */
    private final saveProp(Issue issue, String name, String value) {
        def prop = new IssueExtraProperty(
                projectKey: issue.projectKey,
                name: name,
                value: value
        )
        issue.addToExtraProperties(prop)
    }

}
