package org.broadinstitute.orsp

/**
 * specific information pulled from various sections of IRB
 * and Consent Group records for regular AAHRPP Metrics report
 */
class AAHRPPMetrics {

    private static String replaceCommas(String value) {
        value?.replace(ReportService.CSV_DELIMITER, " ")
    }

    private static getStringValue(String value) {
        (value == null || value.isEmpty()) ? ReportService.DASH : replaceCommas(value)
    }

    String projectKey = ""
    String summary = ""
    Set<String> names = []
    Set<String> displayNames = []
    Set<String> sources = []
    String reviewCategory = ""
    String irb = ""
    String protocol = ""

    String getFormattedProjectKey() {
        return getStringValue(projectKey)
    }

    String getFormattedSummary() {
        return getStringValue(summary)
    }

    String getFormattedNames() {
        return getStringValue(names.isEmpty()? "" : names.join(ReportService.JOIN))
    }

    String getFormattedDisplayNames() {
        return getStringValue(displayNames.isEmpty() ? "" : displayNames.join(ReportService.JOIN))
    }

    String getFormattedSources() {
        return getStringValue(sources.isEmpty() ? "" : sources.join(ReportService.JOIN))
    }

    String getFormattedReviewCategory() {
        return getStringValue(reviewCategory)
    }

    String getFormattedIrb() {
        return getStringValue(irb)
    }

    String getFormattedProtocol() {
        return getStringValue(protocol)
    }

}
