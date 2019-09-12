import { Component } from "react";
import { a, hh, div, button, span, ul, li, b, form, input, h } from 'react-hyperscript-helpers';
import GoogleLoginButton from "./GoogleLoginButton";
import { Storage } from '../util/storage'
import { User, Reports } from "../util/ajax";
import { Link, withRouter } from 'react-router-dom';
import { UrlConstants } from "../util/UrlConstants";

export const TopNavigationMenu = hh(class TopNavigationMenu extends Component {

  constructor(props) {

    super(props);
    this.state = {
      isLogged: Storage.userIsLogged()
    };
    this.signOut = this.signOut.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
  }

  async onSuccess(token) {
    await User.signIn(token);
    let resp = await User.getUserSession();
    Storage.setCurrentUser(resp.data);
    Storage.setUserIsLogged(true);
    this.setState({
      isLogged: true
    });
    this.props.history.push("/");
  }

  signOut() {
    Storage.setUserIsLogged(false);
    Storage.clearStorage();
    User.signOut();
    this.setState({
      isLogged: false
    });
  }

  openMetricsReport() {
    Reports.getMetricsReport();
  }

  render() {
    let isLogged = this.state.isLogged;
    let isViewer = Storage.getCurrentUser() != null ? Storage.getCurrentUser().isViewer : false;
    let isAdmin = Storage.getCurrentUser() != null ? Storage.getCurrentUser().isAdmin || Storage.getCurrentUser().isORSP || Storage.getCurrentUser().isComplianceOffice : false;
    let currentUser = { displayName: '' }
    if (isLogged) {
      currentUser = Storage.getCurrentUser();
    }
    return (
      div({ className: "navbar navbar-default navbar-fixed-top", role: "navigation" }, [
        div({ className: "container" }, [
          div({ className: "navbar-header" }, [
            button({ className: "navbar-toggle", type: "button" }, [
              span({ className: "sr-only" }, ["Toggle navigation"]),
              span({ className: "icon-bar" }, []),
              span({ className: "icon-bar" }, []),
              span({ className: "icon-bar" }, [])
            ]),
            h(Link, { className: "navbar-brand", to: { pathname: UrlConstants.index } },
              [
                span({}, [
                  "ORSP Portal ",
                  span({ className: "label label-danger" }, ["Dev"])
                ])
              ])
          ]),
          div({ className: "navbar-collapse collapse" }, [
            ul({ className: "nav navbar-nav" }, [
              li({}, [
                h(Link, { to: { pathname: UrlConstants.aboutUrl } },
                  ['About']
                )
              ]),
              // if authenticated
              li({ isRendered: isLogged }, [
                h(Link, { to: { pathname: UrlConstants.viewSearchUrl } },
                  ['Search']
                )
              ]),
              li({ isRendered: isLogged, className: "dropdown" }, [
                a({ className: "dropdown-toggle", "data-toggle": "dropdown" }, [
                  "New ", b({ className: "caret" }, [])
                ]),
                ul({ className: "dropdown-menu" }, [
                  li({}, [h(Link, { to: { pathname: UrlConstants.projectUrl } }, ["New Project"])])
                ])
              ]),
              li({ isRendered: isLogged && isAdmin, className: "dropdown" }, [
                a({ className: "dropdown-toggle", "data-toggle": "dropdown" }, [
                  "Admin ", b({ className: "caret" }, [])
                ]),
                ul({ className: "dropdown-menu" }, [
                  li({}, [h(Link, { to: { pathname: UrlConstants.dataUseListUrl } }, ["Data Use Restrictions"])]),
                  li({}, [h(Link, { to: { pathname: UrlConstants.reviewCategoryReportUrl } }, ["Review Category Report"])]),
                  li({}, [h(Link, { to: { pathname: UrlConstants.qaEventReportUrl } }, ["Event Report"])]),
                  li({}, [h(Link, { to: { pathname: UrlConstants.fundingReportUrl } }, ["Funding Source Report"])]),
                  li({}, [a({ onClick: this.openMetricsReport }, ["AAHRPP Metrics Report (CSV)"])]),
                  li({}, [h(Link, { to: { pathname: UrlConstants.rolesManagementUrl } }, ["Roles Management"])])
                ])
              ])
            ]),
            form({ isRendered: isLogged, className: "navbar-form navbar-left" }, [
              div({ className: "form-group" }, [
                input({
                  className: "form-control",
                  id: this.props.id,
                  type: 'text',
                  disabled: false,
                  onChange: this.props.onChange,
                  placeholder: "ORSP ID #"
                })
              ])
            ]),
            div({ isRendered: isLogged }, [
              ul({ className: "nav navbar-nav" }, [
                li({}, [
                  h(Link, { to: { pathname: UrlConstants.profileUrl } },
                    [currentUser.displayName]
                  )
                ]),
                li({}, [
                  h(Link, { to: { pathname: UrlConstants.aboutUrl }, onClick: () => this.signOut() },
                    ["Sign out"]
                  )
                ]),
              ]),
            ]),
            div({ isRendered: !isLogged, className: "floatRight" }, [
              GoogleLoginButton({
                clientId: component.clientId,
                onSuccess: this.onSuccess
              })
            ])
          ])
        ])
      ])
    )
  }
});
export default TopNavigationMenu;
