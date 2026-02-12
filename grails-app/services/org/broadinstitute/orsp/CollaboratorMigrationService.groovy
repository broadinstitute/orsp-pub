package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional

@Transactional
class CollaboratorMigrationService {

    void migrateIfRequired(Issue issue) {

        if (!issue?.id) {
            return
        }

        // Check migration log table
        boolean alreadyMigrated =
                IssueExtraPropertyMigrationLog.findByIssueAndMigrationType(
                        issue,
                        'COLLABORATOR'
                ) != null

        if (alreadyMigrated) {
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

        //  Migrate to KeyPerson
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

        //  Insert migration log entry
        new IssueExtraPropertyMigrationLog(
                issue        : issue,
                projectKey   : issue.projectKey,
                migrationType: 'COLLABORATOR',
                updatedAt    : new Date()
        ).save(failOnError: true)
    }
}
