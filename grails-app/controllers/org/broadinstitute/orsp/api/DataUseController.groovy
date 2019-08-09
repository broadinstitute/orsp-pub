import grails.converters.JSON
import grails.rest.Resource;
import groovy.util.logging.Slf4j;
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.webservice.PaginationParams;

@Slf4j
@Resource
class DataUseController extends AuthenticatedController {

    def list() {
        render(view: "/mainContainer/index")
    }

    def findDataUseRestrictions() {
        PaginationParams pagination = new PaginationParams(
                draw: params.getInt("draw") ?: 1,
                start: params.getInt("start") ?: 0,
                length: params.getInt("length") ?: 50,
                orderColumn: params.getInt("orderColumn") ?: 0,
                sortDirection: params.get("sortDirection")?.toString() ?: "asc",
                searchValue: params.get("searchValue")?.toString() ?: null)
        render queryService.findDataUseRestrictions(pagination) as JSON
    }

}
