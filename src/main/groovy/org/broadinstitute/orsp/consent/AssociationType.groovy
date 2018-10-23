package org.broadinstitute.orsp.consent

enum AssociationType {
    SAMPLE("sample"),
    SAMPLE_SET("sampleSet"),
    RESEARCH_PURPOSE("researchPurpose")

    String type

    AssociationType(String type) {
        this.type = type
    }

}