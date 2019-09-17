import { Component } from "react";
import { a, hh, div, button, span, ul, li, b, h } from 'react-hyperscript-helpers';
import { Storage } from '../util/Storage'
import { User, Reports, Search } from "../util/ajax";
import { Link, withRouter } from 'react-router-dom';
import { UrlConstants } from "../util/UrlConstants";
import { MultiSelect } from '../components/MultiSelect';
import GoogleLoginButton from '../components/GoogleLoginButton';
import './TopNavigationMenu.css';
import { INITIAL_REVIEW } from "../util/TypeDescription";

export const TopNavigationMenu = hh(class TopNavigationMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLogged: false,
      searchValue: '',
      googleButton: null,
      userSession: { displayName: '' }
    };
    this.signOut = this.signOut.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  async init() {
    User.getUserSession().then(resp => {
      this.setState({
        isLogged: true,
        userSession: resp.data
      }, () => {
        Storage.setUserIsLogged(true);
        Storage.setCurrentUser(resp.data);
      });
    }).catch(error => {
      this.setState({
        isLogged: false
      });
      this.props.history.push(this.props.history.location);
      Storage.clearStorage()
    });
  }

  async onSuccess(token) {
    await User.signIn(token);
    this.init().then(resp => {
      this.props.history.push("/index" );
    });
  }

  async signOut() {
    if (window.gapi.auth2 != undefined) {
      let auth2 = window.gapi.auth2.getAuthInstance();
      auth2.signOut();
    }
    Storage.clearStorage();
    await User.signOut();
    this.setState({
      isLogged: false
    });
    this.props.history.push("/");
  }

  openMetricsReport() {
    Reports.getMetricsReport();
  }

  loadOptions(query, callback) {
    let options = []
    if (query.length > 2) {
      Search.getMatchingIssues(query).then(response => {
        let options = response.data.map(function (item) {
          let label = item.label;
          if (item.linkDisabled === true && item.pm.length > 0) {
            label = item.label + ' Please contact ' + item.pm + ' for access';
          } else if (item.linkDisabled === true) {
            label = item.label + ' Please contact ' + item.reporter + ' for access';
          }
          return {
            key: item.id,
            value: item.value,
            label: label,
            linkDisabled: item.linkDisabled,
            url: item.url
          };
        });
        callback(options);
      }).catch(e => {
        callback(options)
      });
    } else {
      callback(options)
    }
  };

  handlePIChange = (data, action) => {
    if (!data.linkDisabled) {
      window.location.href = data.url;
    }
    this.setState(prev => {
      prev.search = data.data;
      return prev;
    })
  };

  render() {
    let isBroadUser = this.state.isLogged && this.state.userSession != null && this.state.userSession.isBroad;
    let isAdmin = this.state.isLogged && this.state.userSession != null && (this.state.userSession.isAdmin || this.state.userSession.isOrsp);
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
              li({ isRendered: isBroadUser }, [
                h(Link, { to: { pathname: UrlConstants.viewSearchUrl } },
                  ['Search']
                )
              ]),
              li({ isRendered: isBroadUser, className: "dropdown" }, [
                a({ href: "#", className: "dropdown-toggle", "data-toggle": "dropdown" }, [
                  "New ", b({ className: "caret" }, [])
                ]),
                ul({ className: "dropdown-menu" }, [
                  li({}, [h(Link, { to: { pathname: UrlConstants.projectUrl } }, ["New Project"])])
                ])
              ]),
              li({ isRendered: isAdmin, className: "dropdown" }, [
                a({ href: "#", className: "dropdown-toggle", "data-toggle": "dropdown" }, [
                  "Admin ", b({ className: "caret" }, [])
                ]),
                ul({ className: "dropdown-menu" }, [
                  li({}, [h(Link, { to: { pathname: UrlConstants.dataUseListUrl } }, ["Data Use Restrictions"])]),
                  li({}, [h(Link, { to: { pathname: UrlConstants.reviewCategoryReportUrl } }, ["Review Category Report"])]),
                  li({}, [h(Link, { to: { pathname: UrlConstants.qaEventReportViewUrl } }, ["Event Report"])]),
                  li({}, [h(Link, { to: { pathname: UrlConstants.fundingReportUrl } }, ["Funding Source Report"])]),
                  li({}, [a({ onClick: this.openMetricsReport }, ["AAHRPP Metrics Report (CSV)"])]),
                  li({}, [h(Link, { to: { pathname: UrlConstants.rolesManagementUrl } }, ["Roles Management"])])
                ])
              ])
            ]),
            div({ isRendered: isBroadUser, className: "navbar-form navbar-left" }, [
              MultiSelect({
                id: "pk_select",
                label: "",
                isDisabled: false,
                loadOptions: this.loadOptions,
                handleChange: this.handlePIChange,
                value: this.state.searchValue,
                placeholder: "ORSP ID #",
                isMulti: false,
                edit: false
              })
            ]),
            div({ isRendered: this.state.isLogged, className: "floatRight" }, [
              ul({ className: "nav navbar-nav" }, [
                li({}, [
                  h(Link, { to: { pathname: UrlConstants.profileUrl } },
                    [this.state.userSession.displayName]
                  )
                ]),
                li({}, [
                  h(Link, { to: { pathname: UrlConstants.aboutUrl }, onClick: () => this.signOut() },
                    ["Sign out"]
                  )
                ]),
              ]),
            ]),
            div({ isRendered: !this.state.isLogged, className: "googleButton" }, [
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
