package org.broadinstitute.orsp.webservice

/**
 * This represents the names of Ontologies that we make use of.
 *
 * Created: 8/12/14
 *
 * @author <a href="mailto:grushton@broadinstitute.org">grushton</a>
 */
public enum Ontology {
    DISEASE("DOID"),
    POPULATION("SNOMEDCT")

    def String abbreviation
    private Ontology(String abbreviation) {
        this.abbreviation = abbreviation
    }

}

