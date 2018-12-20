package org.broadinstitute.orsp

enum FundingFields {

    SOURCE("source"),
    AWARD_NUMBER("awardNumber"),
    NAME("name")

    String name

    FundingFields(String name) {
        this.name = name
    }

    static FundingFields valueOfName(String name) {
        values().find {
            it.name == name
        }
    }
}