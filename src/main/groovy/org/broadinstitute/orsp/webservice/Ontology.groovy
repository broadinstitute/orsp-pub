package org.broadinstitute.orsp.webservice

/**
 * This represents the names of Ontologies that we make use of.
 */
public enum Ontology {
    DISEASE("DOID"),
    POPULATION("SNOMEDCT")

    String abbreviation
    private Ontology(String abbreviation) {
        this.abbreviation = abbreviation
    }

}

