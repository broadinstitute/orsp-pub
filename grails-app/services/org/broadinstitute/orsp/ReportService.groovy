package org.broadinstitute.orsp

import groovy.util.logging.Slf4j

@Slf4j
class ReportService {

    // Headers
    private final static String IRB_OF_RECORD = "IRB of Record"
    private final static String FIRST_NAME_INVESTIGATOR = "Primary Investigator"
    private final static String DEGREE_INVESTIGATOR = "Degree(s) of Investigator"
    private final static String PROTOCOL_NUMBER = "Protocol Number"
    private final static String ORSP_NUMBER = "ORSP Number"
    private final static String TITLE = "Title"
    private final static String INITIAL_APPROVAL_DATE = "Initial Approval Date"
    private final static String SPONSOR_FUNDING_ENTITY = "Sponsor or Funding Entity"
    private final static String TYPE_INITIAL_REVIEW = "Type of Initial Review"
    private final static String BIOMEDICAL = "Biomedical or Non-Biomedical"
    private final static String FUNDING_SOURCE = "Funding Source"
    private final static String END_OF_LINE = System.lineSeparator()
    public final static String CSV_DELIMITER = ","
    public final static String DASH = "-"
    public static final String JOIN = "; "

    String createReport(List<AAHRPPMetrics> metrics) {
        StringBuilder content = new StringBuilder()
        content.append(getHeaders())
        metrics.each { metric ->
            content.append(metric.getFormattedIrb()).append(CSV_DELIMITER).
                    append(metric.getFormattedDisplayNames()).append(CSV_DELIMITER).
                    append(DASH).append(CSV_DELIMITER).
                    append(metric.getFormattedProtocol()).append(CSV_DELIMITER).
                    append(metric.getFormattedProjectKey()).append(CSV_DELIMITER).
                    append(metric.getFormattedSummary()).append(CSV_DELIMITER).
                    append(DASH).append(CSV_DELIMITER).
                    append(metric.getFormattedNames()).append(CSV_DELIMITER).
                    append(metric.getFormattedReviewCategory()).append(CSV_DELIMITER).
                    append(DASH).append(CSV_DELIMITER).
                    append(metric.getFormattedSources()).
                    append(END_OF_LINE)
        }
        content.toString()
    }

    private static String getHeaders() {
        new StringBuilder().
                append(IRB_OF_RECORD).append(CSV_DELIMITER).
                append(FIRST_NAME_INVESTIGATOR).append(CSV_DELIMITER).
                append(DEGREE_INVESTIGATOR).append(CSV_DELIMITER).
                append(PROTOCOL_NUMBER).append(CSV_DELIMITER).
                append(ORSP_NUMBER).append(CSV_DELIMITER).
                append(TITLE).append(CSV_DELIMITER).
                append(INITIAL_APPROVAL_DATE).append(CSV_DELIMITER).
                append(SPONSOR_FUNDING_ENTITY).append(CSV_DELIMITER).
                append(TYPE_INITIAL_REVIEW).append(CSV_DELIMITER).
                append(BIOMEDICAL).append(CSV_DELIMITER).
                append(FUNDING_SOURCE).append(END_OF_LINE).
                toString()
    }

}
