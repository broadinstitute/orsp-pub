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
    <div class="issue-type">
      <span>Information Sub-Status:</span>
      <span>${projectReviewApproved ? 'Approved' : 'Pending'}</span>
      <br/><span>Documents Sub-Status:</span>
      <span>${attachmentsApproved ? 'Approved' : 'Pending'}</span>
    </div>
</div>

<div class="orsp-tabs" style="display: none;">
    <ul>
        <li><b><a href="#consentGroupReview" style="color: blue">Review</a></b></li>
        <li><b><a href="#consentGroupDocuments" style="color: blue">Documents New</a></b></li>
        <li><a href="#documents">Documents</a></li>
        <li><a href="#comments">Messages</a></li>
        <li><a href="#history">History</a></li>
        %{--<auth:isOrsp>--}%
            %{--<li><a href="#checklist">Reviewer Checklist</a></li>--}%
        %{--</auth:isOrsp>--}%
    </ul>

    <div id="consentGroupDocuments">
        <g:render template="/consentGroupDocuments/index" model="[issue: issue, attachedDocuments: attachedDocuments]" />
    </div>


    <div id="consentGroupReview">
        <g:render template="/consentGroupReview/index" model="[issue: issue]"/>
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

