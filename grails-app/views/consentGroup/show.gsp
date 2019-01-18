<html>
<head>
    <meta name="layout" content="main">
    <title>${issue.type}: ${issue.projectKey}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-bootstrap-table/4.3.1/react-bootstrap-table-all.min.css"/>
    <style type="text/css">
        .clear-well {
            background-color: transparent;
            border-width: 1px;
        }
        ul.ui-autocomplete {
            z-index: 1100;
        }
    </style>
</head>

<body>

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
</div>

<div class="orsp-tabs" style="display: none;">
    <ul>
        <li><a href="#documents">Documents</a></li>
        <li><a href="#details">Details</a></li>
        <li><a href="#consentGroupReview">Review</a></li>
        <li><a href="#comments">Comments</a></li>
        <li><a href="#history">History</a></li>
        %{--<auth:isOrsp>--}%
            %{--<li><a href="#checklist">Reviewer Checklist</a></li>--}%
        %{--</auth:isOrsp>--}%
        <li><a href="#consentGroupDocuments">Documents New</a></li>
    </ul>

    <div id="consentGroupDocuments">
        <g:render template="/consentGroupDocuments/index" model="[issue: issue, attachedDocuments: attachedDocuments]" />
    </div>


    <div id="documents">

        <g:render template="/common/attachmentsPanel" model="${[
                attachments: attachments,
                issue: issue,
                controller: "consentGroup",
                attachmentTypes: attachmentTypes
        ]}"/>

        <auth:isOrsp>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">
                    Data Use Restrictions
                </h3>
            </div>
            <div class="panel-body">
                <g:if test="${restriction}">
                    <h4>Summary</h4>
                    <div>
                        ${raw(duSummary.join("<br/>"))}
                    </div>
                    <a href="${createLink(controller: "dataUse", action: "edit", params: [id: restriction.id])}" class="btn btn-default">Edit Restrictions</a>
                    <a href="${createLink(controller: "dataUse", action: "show", params: [id: restriction.id])}" class="btn btn-default">View Restrictions</a>
                </g:if>
                <g:else>
                    <g:if test="${attachments*.fileType.contains(duLetter)}">
                        <a href="${createLink(controller: "dataUse", action: "create", params: [create: true, id: issue.projectKey, principalInvestigatorName: issue.consent])}" class="btn btn-default">Create Restrictions</a>
                    </g:if>
                </g:else>
            </div>
        </div>
        </auth:isOrsp>

        <g:if test="${collectionLinks}">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Associated Projects</h3>
            </div>
            <div class="panel-body">
                <table class="table table-striped table-bordered">
                    <thead>
                    <tr>
                        <th></th>
                        <th>Type</th>
                        <th>Summary</th>
                    </tr>
                    </thead>
                    <tbody>

                    <g:each in="${collectionLinks}" var="link">
                        <tr>
                            <td>
                                <auth:isOrsp>
                                    <a href="${createLink(controller: 'consentGroup', action: 'unLink', params: [id: issue.projectKey, target: link.projectKey])}"
                                       class="btn btn-default btn-xs">
                                        Unlink
                                    </a>
                                </auth:isOrsp>
                                <auth:isNotAdmin>
                                    <button disabled="disabled" class="btn btn-default btn-xs">Unlink</button>
                                </auth:isNotAdmin>
                            </td>
                            <td>${link.linkedProject.type}</td>
                            <td>
                                <a href="${createLink([
                                            controller: link.linkedProject.controller,
                                            action: "show",
                                            params: ["id": link.projectKey]
                                    ])}">${link.projectKey}: ${link.linkedProject.summary}</a>
                            </td>
                        </tr>
                    </g:each>
                    </tbody>
                </table>
            </div>
        </div>
        </g:if>
    </div>

    <div id="consentGroupReview">
        <g:render template="/consentGroupReview/index" model="[issue: issue]"/>
    </div>


    <div id="details">

        <h1>${issue.type}: ${issue.projectKey}</h1>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Name</h3>
            </div>
            <div class="panel-body">${issue.summary}</div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Last Name of Investigator Listed on the Consent Form</h3>
            </div>
            <div class="panel-body">${issue.consent}</div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Collaborating Institution’s Protocol Number</h3>
            </div>
            <div class="panel-body">${issue.protocol}</div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Collaborating Institution</h3>
            </div>
            <div class="panel-body">${issue.collInst}</div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Primary Contact at Collaborating Institution</h3>
            </div>
            <div class="panel-body">${issue.collContact}</div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">BSP Collections</h3>
            </div>
            <g:if test="${collectionLinks}">
                <table class="table table-bordered table-hover">
                    <thead>
                    <tr>
                        <auth:isOrsp>
                            <th>Remove</th>
                        </auth:isOrsp>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Group</th>
                        <th>Linked Project</th>
                    </tr>
                    </thead>
                    <tbody>
                    <g:each in="${collectionLinks}" var="link" status="index">
                        <tr>
                            <auth:isOrsp>
                                <td>
                                    <a href="${createLink(controller: 'consentGroup', action: 'unLinkConsentCollection', params: [consentKey: issue.projectKey, id: link.id])}"
                                        class="btn btn-default btn-sm">Remove</a>
                                </td>
                            </auth:isOrsp>
                            <td>${link.sampleCollection?.collectionId}</td>
                            <td>${link.sampleCollection?.name}</td>
                            <td>${link.sampleCollection?.category}</td>
                            <td>${link.sampleCollection?.groupName}</td>
                            <td><a href="${createLink(controller: link.linkedProject?.controller, action: 'show', params: [id: link.projectKey])}">${link.projectKey}</a></td>
                        </tr>
                    </g:each>
                    </tbody>
                </table>
            </g:if>
            <g:else>
                <ul class="list-group">
                    <li class="list-group-item">No BSP sample collections associated to this consent group.</li>
                </ul>
            </g:else>

        </div>

        <a href="${createLink(action: 'edit', id: issue.projectKey, tab: 'details')}">
            <button class="btn btn-default link-btn" type="button">Edit</button>
        </a>

        %{--<a href="${createLink(action: 'print', id: issue.projectKey)}" target='_blank'>--}%
            %{--<button class="btn btn-default link-btn" type="button">Print</button>--}%
        %{--</a>--}%

    </div>

    <div id="comments"><div class="load-msg">Loading ...</div></div>

    <div id="history"><div class="load-msg">Loading ...</div></div>

    %{--<auth:isOrsp>--}%
        %{--<div id="checklist">--}%
            %{--<g:render template="checklist" model="[issue: issue, checklistAnswers: checklistAnswers]" />--}%
        %{--</div>--}%
    %{--</auth:isOrsp>--}%

</div>

</body>
</html>

<asset:script type="text/javascript">
    $(document).ready(function () {
        loadComments("${createLink(controller: 'comments', action: 'list', params: [id: issue.projectKey])}");
        loadHistory("${createLink(controller: 'history', action: 'list', params: [id: issue.projectKey])}");
        $('.datepicker').datepicker();
    });
</asset:script>

