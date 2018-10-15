<g:set var="baseId" value="${new Random().nextInt(100)}"/>
<div>
    <g:render template="/ne/steps/nonIrbChecks" model="[issue: issue]"/>
    <div class="pull-left btn-group-vertical">
        <g:render template="/base/actionConfirm"
                  model="${[url: createLink(controller: issue.controller, action: 'submit', params: [id: issue.projectKey]),
                          label: 'Submit to ORSP', active: true,
                          message: 'Please ensure that all relevant documents have been uploaded under the \"Documents\" tab. '+
                          'Press \"Submit to ORSP\"  if ready for review, or \"Cancel\" to return to your application.'
                  ]}"/>
        <g:render template="/base/actionConfirm"
                  model="${[url: createLink(controller: issue.controller, action: 'abandon', params: [id: issue.projectKey]),
                          label: 'Withdraw Project', active: true]}"/>
    </div>

    <div class="clearfix"></div>
</div>
