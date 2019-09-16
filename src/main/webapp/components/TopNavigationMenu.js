import { Component } from "react";
import { a, hh, div, button, span, ul, li, b, form, input, h } from 'react-hyperscript-helpers';
import GoogleLoginButton from "./GoogleLoginButton";
import { Storage } from '../util/Storage'
import { User, Reports, Search } from "../util/ajax";
import { Link, withRouter } from 'react-router-dom';
import { UrlConstants } from "../util/UrlConstants";
import { nonBroadUser, isAdmin, broadUser } from "../util/UserUtils";
import { MultiSelect } from '../components/MultiSelect';
import './TopNavigationMenu.css';

export const TopNavigationMenu = hh(class TopNavigationMenu extends Component {

  constructor(props) {

    super(props);
    this.state = {
      isLogged: Storage.userIsLogged(),
      searchValue: ''
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
    this.props.history.push(Storage.getCurrentUser().isBroad ? "/index" : "/about");
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
    if(!data.disabled) {
      window.location.href = data.url;
    }    
    this.setState(prev => {
      prev.search = data.data;
      return prev;
    })
  };

  render() {
    let isBroadUser = this.state.isLogged && broadUser();
    let currentUser = { displayName: '' }
    if (this.state.isLogged) {
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
              li({ isRendered: isBroadUser }, [
                h(Link, { to: { pathname: UrlConstants.viewSearchUrl } },
                  ['Search']
                )
              ]),
              li({ isRendered: isBroadUser, className: "dropdown" }, [
                a({href:"#", className: "dropdown-toggle", "data-toggle": "dropdown" }, [
                  "New ", b({ className: "caret" }, [])
                ]),
                ul({ className: "dropdown-menu" }, [
                  li({}, [h(Link, { to: { pathname: UrlConstants.projectUrl } }, ["New Project"])])
                ])
              ]),
              li({ isRendered: isAdmin(), className: "dropdown" }, [
                a({href:"#", className: "dropdown-toggle", "data-toggle": "dropdown" }, [
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
