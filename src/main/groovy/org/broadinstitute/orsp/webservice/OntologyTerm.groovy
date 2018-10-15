package org.broadinstitute.orsp.webservice

import groovy.json.JsonBuilder

/**
 * DTO object to represent an ontology term from an ontology service.
 *
 * Created: 8/11/14
 *
 * @author <a href="mailto:grushton@broadinstitute.org">grushton</a>
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
