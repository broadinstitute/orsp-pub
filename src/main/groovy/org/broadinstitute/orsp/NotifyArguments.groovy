package org.broadinstitute.orsp

import groovy.json.JsonBuilder
import groovy.json.JsonOutput

class NotifyArguments {
    String comment
    String subject
    String view
    List<String> toAddresses
    List<String> ccAddresses
    String fromAddress
    String details
    Map<String, String> values

    User user
    Issue issue

    @Override
    String toString() {
        def builder = new JsonBuilder()
        builder.records {
            argument {
                comment this.comment
                subject this.subject
                view this.view
                toAddresses this.toAddresses?.join(", ")
                ccAddresses this.ccAddresses?.join(", ")
                fromAddress this.fromAddress
                details this.details
                userEmail this.user?.emailAddress
                issue this.issue?.projectKey
                values new JsonBuilder(this.values).toString()
            }
        }
        JsonOutput.prettyPrint(builder.toString())
    }

}
