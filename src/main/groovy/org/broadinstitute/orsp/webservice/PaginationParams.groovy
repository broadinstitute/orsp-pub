package org.broadinstitute.orsp.webservice

/**
 * See https://datatables.net/manual/server-side
 * This class models what DataTables sends for server-side processed results
 */
class PaginationParams {
    Integer draw
    Integer start
    Integer length
    Integer orderColumn
    String sortDirection
    String searchValue

    def getLikeTerm() { "%" + this.searchValue.toLowerCase().trim() + "%"}
}
