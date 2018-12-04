package org.broadinstitute.orsp.webservice

import groovy.json.JsonBuilder

/**
 * DTO object to represent an ontology term from an ontology service.
 */
class OntologyTerm {

    String id
    String label
    String[] synonyms
    String[] definition
    Boolean obsolete
    String type

    String toString() {
        new JsonBuilder(this).toString()
    }

}
