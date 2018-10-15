package org.broadinstitute.orsp.consent

/**
 *
 * Created: 10/2/14
 *
 * @author <a href="mailto:grushton@broadinstitute.org">grushton</a>
 */
enum AssociationType {
    SAMPLE("sample"),
    SAMPLE_SET("sampleSet"),
    RESEARCH_PURPOSE("researchPurpose")

    String type

    AssociationType(String type) {
        this.type = type
    }

}