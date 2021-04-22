package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j
import java.sql.SQLException

@Slf4j
class OrganizationService {
    QueryService queryService
    PersistenceService persistenceService

    /**
     * Find all organizations.
     *
     * @return Collection of all organizations
     */
    @Transactional(readOnly = true)
    Collection<Organization> findAllOrganizations() {
        queryService.getOrganizations()
    }

    /**
     * Edits an organization
     *
     * @param userId        The user's id
     * @param rolesToAssign Roles String array to be assigned
     */
    void editOrganization (Integer id, String name, Boolean active) throws SQLException {
        if (id != null) {
            Organization organization = Organization.findById(id)
            if (organization != null) {
                persistenceService.saveOrganization(organization.id, name, active)
            } else {
                log.error("Error while trying to update organization id: ${id}")
                throw new IllegalArgumentException("Error while trying to update organization id: ${id}")
            }
        } else {
            log.error("Error while trying to  update organization id null")
            throw new IllegalArgumentException("Cannot update organization of null id")
        }
    }
}
