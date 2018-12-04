<!-- Fixed navbar -->
<div class="navbar navbar-default navbar-fixed-top" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="${createLink(controller: 'index', action: 'index')}">
                <g:if env="development">ORSP Portal <span class="label label-danger">Dev</span></g:if>
                <g:else>ORSP Portal</g:else>
            </a>
        </div>
        <div class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <li><a href="${createLink([controller: 'index', action: 'about'])}">About</a></li>
                <auth:isAuthenticated>
                    <li>
                        <a href="${createLink(controller: 'search', action: 'index')}">Search</a>
                    </li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">New <b class="caret"></b></a>
                        <ul class="dropdown-menu">
                            <li><a href="${createLink(controller: 'irb', action: 'create')}">IRB Protocol Record</a></li>
                            <li><a href="${createLink(controller: 'ne', action: 'create')}">'Not Engaged' Project</a></li>
                            <li><a href="${createLink(controller: 'nhsr', action: 'create')}">Not Human Subjects Research Project</a></li>
                            <li><a href="${createLink(controller: 'consentGroup', action: 'create')}">Consent Group</a></li>
                        </ul>
                    </li>
                    <auth:isOrsp>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Admin <b class="caret"></b></a>
                            <ul class="dropdown-menu">
                                <li><a href="${createLink(controller: 'admin', action: 'collectionLinks')}">Consent Collection Links</a></li>
                                <li><a href="${createLink(controller: 'dataUse', action: 'list')}">Data Use Restrictions</a></li>
                                <li><a href="${createLink(controller: 'admin', action: 'reviewCategories')}">Review Category Report</a></li>
                                <li><a href="${createLink(controller: 'statusEvent', action: 'index')}">QA Event Report</a></li>
                                <li><a href="${createLink(controller: 'admin', action: 'fundingReport')}">Funding Source Report</a></li>
                                <li><a href="${createLink(controller: 'report', action: 'aahrppMetrics')}">AAHRPP Metrics Report (CSV)</a></li>
                            </ul>
                        </li>
                    </auth:isOrsp>
                </auth:isAuthenticated>
            </ul>

            <auth:isAuthenticated>

                <form class="navbar-form navbar-left" role="search">
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="ORSP ID #" id="issue-name-autocomplete">
                    </div>
                </form>

                <ul class="nav navbar-nav">
                    <g:if test="${session.user}">
                        <li><a href="${createLink([controller: 'index', action: 'profile'])}">${session.user.displayName}</a></li>
                    </g:if>
                    %{-- Sign-out doesn't work without a sign-in button on the page somewhere --}%
                    <div class="g-signin2 hidden"></div>
                    <li><a href="#" onclick="signOut();">Sign out</a></li>
                </ul>
            </auth:isAuthenticated>
            <auth:isNotAuthenticated>
                <div class="navbar-form navbar-right">
                    <div class="g-signin2 form-group" data-onsuccess="onSignIn"></div>
                </div>
            </auth:isNotAuthenticated>
        </div><!--/.nav-collapse -->
    </div>
</div>

<auth:isAuthenticated>
    <asset:script type="text/javascript">
        $(document).ready(function () {
            $("#issue-name-autocomplete").autocomplete({
                source: "${createLink(controller: 'search', action: 'getMatchingIssues')}",
                minLength: 2,
                change: function (event, ui) {
                    // This implements a "must-match" constraint on the autocomplete
                    if (!ui.item) {
                        $(this).val('');
                    }
                },
                select: function (event, ui) {
                    window.location = ui.item.url;
                }
            });
        });
    </asset:script>
</auth:isAuthenticated>
