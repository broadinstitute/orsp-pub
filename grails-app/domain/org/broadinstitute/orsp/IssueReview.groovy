package org.broadinstitute.orsp

import grails.converters.JSON
import org.grails.web.json.JSONArray
import org.grails.web.json.JSONObject

class IssueReview {

    Long id
    String projectKey
    String suggestions

    static constraints = {
        projectKey nullable: false
        suggestions nullable: false
    }

    public static final String FUNDINGS = "fundings"
    public static final String DESCRIPTION = "description"
    public static final String PROJECT_EXTRA_PROPS = "projectExtraProps"
    public static final String PROJECT_TITLE = "projectTitle"

    String getEditCreatorName() {
        return JSON.parse(this.suggestions)?.getAt(IssueExtraProperty.EDIT_CREATOR)?.toString()
    }

    JSONArray getFunding() {
        return JSON.parse(this.suggestions)?.getAt(FUNDINGS)
    }

    String getProjectTitle() {
        return JSON.parse(this.suggestions)?.getAt(PROJECT_EXTRA_PROPS)?.getAt(PROJECT_TITLE)?.toString()
    }

    String getDescription() {
        return JSON.parse(this.suggestions)?.getAt(DESCRIPTION)?.toString()
    }
}
