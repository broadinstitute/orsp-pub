<%@ page import="org.broadinstitute.orsp.Fields" %>
%{--
This view requires the following arguments:
[
    fundings
]
--}%
<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">Funding&nbsp;&nbsp;<span class="badge" onclick='$("#funding-help").toggleClass("hidden");'>&nbsp;?&nbsp;</span></h3>
        <div id="funding-help" style="margin: 1rem;" class="alert alert-info hidden">
            <ul>
                <li><strong>Federal Prime:</strong> Direct federal (ex: NIH) award to Broad.</li>
                <li><strong>Federal Sub-Award:</strong> Federal award received by Broad via a subcontract with another institution.  For example, MGH is the prime reciepient of a federal award and Broad receives a portion of the award via a subcontract from MGH.</li>
                <li><strong>Internal Broad:</strong> Internal Broad Institute funding such as SPARC funding</li>
                <li><strong>Purchase Order:</strong> Typically used for Fee-for-Service work.</li>
                <li><strong>Corporate Funding:</strong> Industry (ex: Johnson & Johnson) funding</li>
                <li><strong>Foundation:</strong> Foundation funding  (ex: American Cancer Society)</li>
                <li><strong>Philanthropy:</strong> Private Donors</li>
                <li><strong>Other:</strong> Anything not covered in one of the other categories</li>
            </ul>
        </div>
    </div>

    <div id="root"></div>
    <div class="panel-body">
        <div class="form-group">
            <table id="funding-table" class="table table-striped">
                <thead>
                <tr>
                    <th>Source</th>
                    <th>Name</th>
                    <th>Sponsor Award Number</th>
                    <th class="addFunding" style="cursor: pointer;"><span class="badge"> <span class="glyphicon glyphicon-plus" title="Add New Funding"></span></span> Add</th>
                </tr>
                </thead>
                <tbody>
                <g:if test="${!fundings?.empty}">
                    <g:each in="${fundings.sort{it.created}}" var="funding" status="i">
                        <tr>
                            <td><g:select value="${funding.source}"  id="funding-source-${i}" name="funding.source" from="${Fields.FUNDING_SOURCES}" class="form-control"/></td>
                            <td>
                                <input type="hidden" value="${funding.id}" id="funding-id-${i}" name="funding.id"/>
                                <input type="text" value="${funding.name}" id="funding-name-${i}" name="funding.name" class="form-control" />
                            </td>
                            <td>
                                <input type="text" value="${funding.awardNumber}" id="funding-award-${i}" name="funding.award" class="form-control" />
                                <div id="funding-error-${i}" class="invalid hidden">Sponsor Award Number is required for all Federal funding sources.</div>
                            </td>
                            <td class="removeFunding"><span class="badge"><span class="glyphicon glyphicon-remove"></span></span></td>
                        </tr>
                    </g:each>
                </g:if>
                </tbody>
            </table>
        </div>
    </div>
</div>

<asset:script type="text/javascript">
    $(document).ready(function() {
        $(".alert").alert();

        <g:each var="i" in="${(0 .. fundings.size())}">
            $("#funding-award-${i}").focusout(function() {validateAwardNumber("#funding-source-${i}", "#funding-award-${i}", "#funding-error-${i}")} );
        </g:each>

        $(".addFunding").on('click', function() {
            let table = $("#funding-table");
            let tableBody = table.find("tbody");
            let tableRows = tableBody.find("tr");
            let rowNum = tableRows.length;

            let row = $('<tr></tr>');
            let dataCell = $('<td></td>');
            let select = $('<select id="funding-source-' + rowNum + '" name="funding.source" class="form-control"></select>');
            <g:each in="${Fields.FUNDING_SOURCES}" var="source">select.append($('<option value="${source}">${source}</option>'));</g:each>
            dataCell.append(select);
            row.append(dataCell);

            let dataCell2 = $('<td></td>');
            let input2 = $('<input type="hidden" value="0" id="funding-id-' + rowNum + '"   name="funding.id"/>' +
                           '<input type="text"   value=""  id="funding-name-' + rowNum + '" name="funding.name" class="form-control" />');
            dataCell2.append(input2);
            row.append(dataCell2);

            let dataCell3 = $('<td></td>');
            let input3 = $('<input type="text" value="" id="funding-award-' + rowNum + '" name="funding.award" class="form-control" />');
            input3.focusout(function() { validateAwardNumber("#funding-source-" + rowNum, "#funding-award-" + rowNum, "#funding-error-" + rowNum) });
            let errorDiv = $('<div id="funding-error-' + rowNum +'" class="invalid hidden">Sponsor Award Number is required for all Federal funding sources.</div>')
            dataCell3.append(input3).append(errorDiv);
            row.append(dataCell3);

            let dataCell4 = $('<td></td>');
            let removeIcon = $('<span class="badge"><span class="glyphicon glyphicon-remove" title="Remove"></span></span>');
            dataCell4.append(removeIcon);
            dataCell4.on('click', function(){ $(this).parent().remove(); });
            row.append(dataCell4);

            tableBody.append(row);

        });
        $(".badge").css("cursor", "pointer");
        $(".removeFunding").on('click', function(){ $(this).parent().remove(); });
    });

    function validateAwardNumber(sourceSelector, awardSelector, errorSelector) {
        if (awardIsValid(sourceSelector, awardSelector)) {
            $(awardSelector).removeClass("invalid");
            $(errorSelector).addClass("hidden");
        } else {
            $(awardSelector).addClass("invalid");
            $(errorSelector).removeClass("hidden");
        }
    }

    function awardIsValid(sourceSelector, awardSelector) {
        let federalSource = $(sourceSelector).val();
        let isFederal = federalSource === "${Fields.FUNDING_SOURCES.get(0)}" || federalSource === "${Fields.FUNDING_SOURCES.get(1)}";
        let hasAwardVal = $(awardSelector).val();
        if (isFederal) {
            if (!hasAwardVal) {
                return false;
            }
        }
        return true;
    }

    function validateFunding() {
        var valid = true;
        $.each($("input[id*='funding-award-']"), function() {
            let idValue = $(this).attr("id");
            let endPos = idValue.lastIndexOf("-") + 1;
            let index = idValue.substring(endPos, idValue.length);
            valid = awardIsValid("#funding-source-" + index, "#funding-award-" + index);
            if (!valid) {
                validateAwardNumber("#funding-source-" + index, "#funding-award-" + index, "#funding-error-" + index);
                $("#funding-table").parent().get(0).scrollIntoView();
            }
            return(valid);
        });
        return valid;
    }

</asset:script>
