%{--
This template requires the following arguments:
[
    fundings
]
--}%
<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">Funding Sources</h3>
    </div>
    <div class="panel-body">

        <table class="table table-bordered table-hover table-striped">
            <thead>
            <tr>
                <th style="width: 25%;">Source</th>
                <th style="width: 50%;">Name</th>
                <th style="width: 25%;">Award Sponsor Number</th>
            </tr>
            </thead>
            <tbody>
            <g:each in="${fundings.sort{it.created}}" var="funding" status="index">
                <tr>
                    <td>${funding.source}</td>
                    <td>${funding.name}</td>
                    <td>${funding.awardNumber}</td>
                </tr>
            </g:each>
            </tbody>
        </table>

    </div>
</div>
