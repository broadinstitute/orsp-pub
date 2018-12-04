package org.broadinstitute.orsp

enum PreferredIrb {

    PARTNERS("10012", "Partners Health Care"),
    MIT("10013", "MIT"),
    DANA_FARBER("10014", "Dana-Farber Cancer Institute"),
    BID("10015", "Beth Israel Deaconess"),
    BCH("10016", "Boston Children's Hospital"),
    FORSYTH("10017", "Forsyth Institute"),
    HMS("10018", "Harvard Medical School (and Dental Medicine)"),
    HSPH("10019", "Harvard School of Public Health"),
    HFAS("10020", "Harvard Faculty of Arts & Sciences"),
    JOSLIN("10021", "Joslin Diabetes Center"),
    MASS_EYE_EAR("10022", "Mass. Eye and Ear"),
    MCLEAN("10023", "McLean Hospital"),
    SPAULDING("10024", "Spaulding Rehabilitation Hospital"),
    OTHER("10210", "Other")

    String key
    String label

    PreferredIrb(String key, String label) {
        this.key = key
        this.label = label
    }

    static String getLabelForKey(String key) {
        PreferredIrb found = values().find { it.key.equalsIgnoreCase(key) }
        found?.label ?: ""
    }

}
