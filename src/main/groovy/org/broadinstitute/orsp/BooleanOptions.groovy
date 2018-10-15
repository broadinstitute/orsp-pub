package org.broadinstitute.orsp

enum BooleanOptions {

    // TODO: Post-release, the list of keys can be removed. This enum is backwards compatible, but once the sql is run, it doesn't have to be.
    Yes(["10009", "10028", "10045", "10057", "10059", "10069", "10102", "10106", "10124", "10126", "10128", "10130", "10135", "10203", "10207"], "Yes"),
    No(["10010", "10029", "10046", "10058", "10060", "10070", "10107", "10125", "10127", "10129", "10131", "10136", "10204", "10208"], "No"),
    NoUnknown(["10103"], "No/Unknown"),
    Unknown(["10011", "10047", "10205", "10209"], "Unknown")

    List<String> keys
    String label

    BooleanOptions(List<String> keys, String label) {
        this.keys = keys
        this.label = label
    }

    static String getLabelForKey(String key) {
        BooleanOptions found = values().find {
            it.label.equalsIgnoreCase(key) ||
                    it.keys.contains(key)
        }
        found?.label ?: ""
    }

}
