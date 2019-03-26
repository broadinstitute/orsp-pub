<html>
<head>
    <meta name="layout" content="main">
    <title>${issue.typeLabel} ${issue?.projectKey}</title>
    <style>
    .ui-dialog-titlebar {
        display:none;
    }
    </style>
</head>
<body>
%{-- Modal window to add a new consent group --}%
<div class="modal fade add-new-consent-modal" tabindex="-1" role="dialog" aria-labelledby="addConsentGroupModalDialog" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <g:render template="/consentGroup/createAndLink" model="${[issue: issue]}"/>
        </div>
    </div>
</div>

%{-- Modal window to add an existing consent group --}%
<div class="modal fade use-existing-consent-modal" tabindex="-1" role="dialog" aria-labelledby="useExistingConsentGroupModalDialog" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <g:render template="/consentGroup/link" model="${[issue: issue]}" />
        </div>
    </div>
</div>

%{-- Modal container to upload a consent group attachment type from within a project --}%
<div class="modal" id="add-consent-document-modal" tabindex="-1" role="dialog" aria-labelledby="addConsentDocumentModalDialog" aria-hidden="true"></div>

<div class="project-header">
    <div class="issue-type">${issue?.typeLabel}</div>
    <span class="project-key">${issue?.projectKey}:</span>
    <span class="project-title">${issue?.summary}</span>
    <br/>
    <span class="status-label">Status:</span>
    <span class="status">"${issue?.status}"</span>;
    <g:if test="${issue?.actors}">
        Awaiting action from: <span class="project-assignee">
        <g:render template="/base/value" model="[value: issue.actors]"/>
    </span>
    </g:if>
    <div class="issue-type">
    <span>New Status:</span>
    <span>${issue?.approvalStatus}</span>
    </div>
</div>

<div class="orsp-tabs" style="display: none;">
    <ul>
        <li><a href="#workspace">Workspace</a></li>
        <li><b><a href="#review" style="color: blue">Project Details</a></b></li>
        <li><a href="#details">Broad Project Info</a></li>
        <li><b><a href="#documentsNew" style="color: blue">Documents New</a></b></li>
        <li><a href="#documents">Documents</a></li>
        <li><a href="#consent-groups">Consent Groups</a></li>
        <li><a href="#submissions">Submissions</a></li>
        <li><a href="#comments">Messages</a></li>
        <li><a href="#history">History</a></li>
    </ul>

    <div id="review">
        <g:render template="/projectReview/index" model="[issue: issue]"/>
    </div>

    <div id="workspace">
        <g:if test="${!workspaceTemplate.isEmpty()}">
            <g:render template="/irb/steps/${workspaceTemplate}"/>
        </g:if>
    </div>

   <div id="documents">
        <g:render template="/common/documentsPanel" model="${[
          controller        : issue.controller,
          issue             : issue,
          attachmentTypes   : attachmentTypes,
          storageDocuments  : storageDocuments
        ]}"/>
    </div>

    <div id="documentsNew">
        <g:render template="/projectDocument/index" model="[
                controller        : issue.controller,
                issue             : issue,
                attachmentTypes   : attachmentTypes
                ]"/>
    </div>

    <div id="submissions">
        <g:render template="/common/submissionsPanel" model="${[
                issue             : issue,
                groupedSubmissions: groupedSubmissions
        ]}"/>
    </div>

    <div id="consent-groups">
        <div class="load-msg">
            Loading ... <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
        </div>
    </div>

    <div id="details">

        <g:render template="/irb/details" model="[issue: issue,
                                                  pms: pms,
                                                  pis: pis,
                                                  extraProperties: extraProperties]"/>

        <g:form>
            <a href="${createLink(action: 'edit', id: issue.projectKey)}">
                <button class="btn btn-default link-btn" type="button">Edit</button>
            </a>
        </g:form>
    </div>

    <div id="comments"><div class="load-msg">Loading ...</div></div>

    <div id="history"><div class="load-msg">Loading ...</div></div>

</div>

<asset:script type="text/javascript">

    // Used to populate the sample collection selection lists in the consent group modals.
    let unConsentedSamples = [];

    $(document).ready(function () {

        loadComments("${createLink(controller: 'comments', action: 'list', params: [id: issue.projectKey])}");
        loadHistory("${createLink(controller: 'history', action: 'list', params: [id: issue.projectKey])}");

        $.getJSON(
            "${createLink(controller: 'authenticated', action: 'collectionLinks', params: [id: issue.projectKey])}",
            function(data) {
                $('#bsp-collections').DataTable({
                    language: {
                        info: "",
                        infoEmpty: ""
                    },
                    paging: false,
                    searching: false,
                    ordering: false,
                    data: data,
                    columns: [
                        { data: 'id' },
                        { data: 'name' },
                        { data: 'category' },
                        { data: 'groupName' },
                        { data: 'consent', render:
                            function(data, type, row, meta) {
                                return "<a href = \"${createLink(controller: 'consentGroup', action: 'show')}?id=" + data + "\">" + data + "</a>";
                            }
                        }
                    ]
                });
            }
        );

        $("#consent-groups").load(
            "${createLink(controller: 'consentGroup', action: 'projectConsentGroups', params: [id: issue.projectKey])}",
            function () {
                $('.consent-group-panel-body').hide();
                $('.consent-accordion-toggle').on('click', function() {
                    let icon = $(this).children().first();
                    let body = $(this).parent().parent().next();
                    if (icon.hasClass("glyphicon-chevron-up")) {
                        icon.removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
                        body.slideUp();
                    } else {
                        icon.removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
                        body.show("slow");
                    }
                });
                $(".modal-add-button").on('click', function() {
                    $("#add-consent-document-modal").load(
                            "${createLink(controller: 'consentGroup', action: 'loadModalWindow')}",
                                {
                                    issueKey: $(this).data("issue"),
                                    consentKey: $(this).data("consent"),
                                    type: $(this).data("type"),
                                    controller: "${issue.controller}"
                                },
                                function() {
                                    $(".chosen-select").chosen({width: "100%"}).trigger("chosen:updated");
                                    $("button[data-dismiss='modal']").on("click", function(){ $("#add-consent-document-modal").dialog("close"); } );
                                }
                        ).dialog({
                            modal: true,
                            minWidth: 1000,
                            minHeight: 500,
                            closeOnEscape: true,
                            hide: { effect: "fadeOut", duration: 300 },
                            show: { effect: "fadeIn", duration: 300 }
                        }).parent().removeClass("ui-widget-content");
                    });
                });

    });
</asset:script>

</body>
</html>