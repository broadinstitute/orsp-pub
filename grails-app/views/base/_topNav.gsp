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

                    <auth:isNotViewer>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">New <b class="caret"></b></a>
                        <ul class="dropdown-menu">
                            <li><a href="${createLink(controller: 'project', action: 'pages')}">New Project</a></li>
                        </ul>
                    </li>
                    </auth:isNotViewer>
                    
                    <auth:isAdmin>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Admin <b class="caret"></b></a>
                            <ul class="dropdown-menu">
                                <li><a href="${createLink(controller: 'admin', action: 'collectionLinks')}">Consent Collection Links</a></li>
                                <li><a href="${createLink(controller: 'dataUseRestriction', action: 'list')}">Data Use Restrictions</a></li>
                                <li><a href="${createLink(controller: 'report', action: 'reviewCategories')}">Review Category Report</a></li>
                                <li><a href="${createLink(controller: 'statusEvent', action: 'index')}">QA Event Report</a></li>
                                <li><a href="${createLink(controller: 'admin', action: 'fundingReport')}">Funding Source Report</a></li>
                                <li><a href="${createLink(controller: 'report', action: 'aahrppMetrics')}">AAHRPP Metrics Report (CSV)</a></li>
                                <li><a href="${createLink(controller: 'user', action: 'rolesManagement')}">Roles Management</a></li>
                            </ul>
                        </li>
                    </auth:isAdmin>
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
                    if (ui.item.linkDisabled === true){
                        event.preventDefault();
                    } else {
                        window.location = ui.item.url;
                    }
                }
            }).data("ui-autocomplete")._renderItem = function(ul, item) {
                var listItem = $("<li></li>")

                if (item.linkDisabled === true && item.pm.length > 0) {
                    listItem
                    .addClass("disabled")
                    .append("<p> Please contact "+ item.pm + " for access</p>")
                } else if (item.linkDisabled === true){
                    listItem
                    .addClass("disabled")
                    .append("<p> Please contact "+ item.reporter + " for access</p>")
                }

                listItem
                .data("item.autocomplete", item)
                .append("<a>" + item.label + "</a>")
                .appendTo(ul);

                return listItem;
            };
        });
    </asset:script>
</auth:isAuthenticated>
