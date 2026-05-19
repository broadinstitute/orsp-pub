package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional

@Transactional
class CollaboratorMigrationService {

    void migrateCollaborator(Issue issue) {

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
                IssueExtraProperty.findAllByIssueAndName(
                        issue,
                        IssueExtraProperty.COLLABORATOR
                )

        if (!collaboratorProps) {
            return
        }

        // Migrate to KeyPerson
        collaboratorProps.each { IssueExtraProperty prop ->

            String collaboratorName = prop.value?.trim()
            if (!collaboratorName) {
                return
            }

            boolean alreadyExists = KeyPerson.findByIssueAndNameAndDeleted(
                    issue,
                    collaboratorName,
                    false
            ) != null

            if (!alreadyExists) {
                new KeyPerson(
                        issue          : issue,
                        projectKey     : issue.projectKey,
                        name           : collaboratorName,
                        role           : 'Legacy',
                        sequenceNumber : prop.sequenceNumber ?: 0,
                        createdDate    : Date.parse("yyyy-MM-dd HH:mm:ss", "2026-04-18 00:00:00"),
                        updatedTimestamp: new Date()
                ).save(failOnError: true)
            }
        }

        // Insert migration log entry
        new IssueExtraPropertyMigrationLog(
                issue        : issue,
                projectKey   : issue.projectKey,
                migrationType: 'COLLABORATOR',
                updatedAt    : new Date()
        ).save(failOnError: true)
    }
}
