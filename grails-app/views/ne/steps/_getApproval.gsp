<g:set var="baseId" value="${new Random().nextInt(100)}"/>
<div>
    <g:render template="/ne/steps/nonIrbChecks" model="[issue: issue]"/>
    <div class="pull-left btn-group-vertical">
        <auth:isOrsp>
            <g:render template="/base/actionConfirm"
                      model="${[url: createLink(controller: issue.controller, action: 'signed'),
                                label: 'Approval signed by Compliance Officer', active: true]}"/>
        </auth:isOrsp>
        <g:render template="/base/actionConfirm"
                  model="${[url: createLink(controller: issue.controller, action: 'abandon'),
                          label: 'Withdraw Project', active: true]}"/>
    </div>

    <div class="clearfix"></div>
</div>
