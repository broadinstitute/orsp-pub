<g:set var="baseId" value="${new Random().nextInt(100)}"/>
<div>
    <div class="pull-left btn-group-vertical">
      <auth:isNotViewer>
        <g:render template="/base/actionConfirm"
                  model="${[url: createLink(controller: 'irb', action: 'irbApprove', params: [id: issue.projectKey]),
                          label: 'IRB Approves', active: true]}"/>
        <g:render template="/base/actionConfirm"
                  model="${[url: createLink(controller: 'irb', action: 'irbRequestMod', params: [id: issue.projectKey]),
                          label: 'IRB Requests Modification', active: true]}"/>
        <g:render template="/base/actionConfirm"
                  model="${[url: createLink(controller: 'irb', action: 'abandon', params: [id: issue.projectKey]),
                          label: 'IRB Rejects', active: true]}"/>
      </auth:isNotViewer>
    </div>
    <g:render template="/irb/steps/applicationCheckboxes"/>
    <div class="clearfix"></div>
</div>
