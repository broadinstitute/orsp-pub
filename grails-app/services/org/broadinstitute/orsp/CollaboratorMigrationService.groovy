package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional

@Transactional
class CollaboratorMigrationService {

    void migrateIfRequired(Issue issue) {

        if (!issue?.projectKey) {
            return
        }

        // Guard: migration already happened
        boolean legacyExists = KeyPerson.findByProjectKeyAndRoleAndDeleted(
                issue.projectKey,
                'Legacy',
                false
        ) != null

        if (legacyExists) {
            return
        }

        // Read collaborators from IssueExtraProperty
        List<IssueExtraProperty> collaboratorProps =
                IssueExtraProperty.findAllByProjectKeyAndName(
                        issue.projectKey,
                        IssueExtraProperty.COLLABORATOR
                )

        if (!collaboratorProps) {
            return
        }

        collaboratorProps.each { IssueExtraProperty prop ->

            String collaboratorName = prop.value?.trim()
            if (!collaboratorName) {
                return
            }

            boolean alreadyExists = KeyPerson.findByProjectKeyAndNameAndDeleted(
                    issue.projectKey,
                    collaboratorName,
                    false
            ) != null

            if (!alreadyExists) {
                new KeyPerson(
                        issue          : issue,
                        projectKey     : issue.projectKey,
                        name           : collaboratorName,
                        role           : 'Legacy',
                        sequenceNumber : 0,
                        updateDate     : new Date()
                ).save(failOnError: true)
            }
        }
    }
}
