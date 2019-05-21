<g:set var="baseId" value="${new Random().nextInt(100)}"/>
<div>
    <div class="pull-left btn-group-vertical">
        <auth:isOrsp>
            <g:render template="/base/actionConfirm"
                      model="${[url: createLink(controller: 'irb', action: 'appSigned', params: [id: issue.projectKey]),
                              label: 'Application Signed',
                              active: true]}"/>
        </auth:isOrsp>
        
        <auth:isNotViewer>
        <g:render template="/base/actionConfirm"
                  model="${[url: createLink(controller: 'irb', action: 'abandon', params: [id: issue.projectKey]),
                          label: 'Withdraw Project', active: true]}"/>
        </auth:isNotViewer>
    </div>
    <g:render template="/irb/steps/applicationCheckboxes"/>
    <div class="clearfix"></div>
</div>
