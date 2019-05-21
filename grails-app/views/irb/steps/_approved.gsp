<g:set var="baseId" value="${new Random().nextInt(100)}"/>
<div>
    <div class="pull-left btn-group-vertical">
        <auth:isNotViewer>
          <g:render template="/base/actionConfirm"
                  model="${[url: createLink(controller: 'authenticated', action: 'close', params: [id: issue.projectKey]),
                            label: 'Close Project', active: true]}"/>
        </auth:isNotViewer>
    </div>
    <g:render template="/irb/steps/applicationCheckboxes"/>
    <div class="clearfix"></div>
</div>
