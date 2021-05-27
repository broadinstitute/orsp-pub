package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j
import java.sql.SQLException
import java.util.stream.Collectors

@Slf4j
class OrganizationService {
    QueryService queryService
    PersistenceService persistenceService
    NotifyService notifyService

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
     * Creates an organization
     *
     * @param name Organization name
     */
    void createOrganization (String name) throws SQLException {
        if (name != null) {
            Organization organization = new Organization(
                    name: name,
                    active: true
            )
            persistenceService.saveOrganization(organization)
        } else {
            log.error("Error while trying to  create organization name null")
            throw new IllegalArgumentException("Cannot create organization with null name")
        }
    }

    /**
     * Edits an organization
     *
     * @param id    Organization id
     * @param name Organization name
     */
    void editOrganization (Integer id, String name) throws SQLException {
        if (id != null) {
            Organization organization = Organization.findById(id)
            if (organization != null) {
                organization.setName(name)
                persistenceService.saveOrganization(organization)
            } else {
                log.error("Error while trying to update organization id: ${id}")
                throw new IllegalArgumentException("Error while trying to update organization id: ${id}")
            }
        } else {
            log.error("Error while trying to  update organization id null")
            throw new IllegalArgumentException("Cannot update organization of null id")
        }
    }

    /**
     * Delete an organization
     *
     * @param id Organization id
     */
    void deleteOrganization (String id) throws SQLException {
        if (id != null) {
            Organization organization = Organization.findById(id)
            if (organization != null) {
                persistenceService.deleteOrganization(organization)
            } else {
                log.error("Error while trying to  delete organization id null")
                throw new IllegalArgumentException("Cannot delete organization with null id")
            }
        } else {
            log.error("Error while trying to  delete organization id null")
            throw new IllegalArgumentException("Cannot delete organization with null id")
        }
    }

    void organizationsMatch(Issue issue) {

        List<Organization> org = queryService.getOrganizations()
        org.retainAll() {o ->
            String organizationName = o.name.toLowerCase()
            issue.description.toLowerCase().contains(organizationName) ||
            issue.summary.toLowerCase().contains(organizationName) ||
            ( issue.getFundings() != null && issue.getFundings()*.name.toString().toLowerCase().contains(organizationName) )
        }

        if (!org.isEmpty()) {
            String matches = org.stream().map({ o -> o.name }).collect(Collectors.joining(", "))
            notifyService.notifyOrganizationsMatch(issue.projectKey, matches)
        }
    }
}
