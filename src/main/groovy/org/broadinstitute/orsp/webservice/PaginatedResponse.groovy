package org.broadinstitute.orsp.webservice

/**
 * See https://datatables.net/manual/server-side
 * This class models what DataTables needs for displaying server-side processed results
 */
class PaginatedResponse {
    Integer draw
    Integer recordsTotal
    Integer recordsFiltered
    List data
    String error
}
