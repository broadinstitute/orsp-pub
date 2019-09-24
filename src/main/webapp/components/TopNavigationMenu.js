import { Component } from "react";
import { a, hh, div, button, span, ul, li, b, h } from 'react-hyperscript-helpers';
import { Storage } from '../util/Storage'
import { User, Reports, Search } from "../util/ajax";
import { Link } from 'react-router-dom';
import { UrlConstants } from "../util/UrlConstants";
import { MultiSelect } from '../components/MultiSelect';
import GoogleLoginButton from '../components/GoogleLoginButton';
import LoadingWrapper from '../components/LoadingWrapper';
import './TopNavigationMenu.css';

const styles = {
  badgeContactAccess: {
    display: 'inlineBlock',
    padding: '5px 10px',
    color: '#EEEEEE',
    backgroundColor: '#999999',
    borderRadius: '4px',
    fontSize: '12px'
  },
  customStyles: {
    option: (provided, state) => ({
      ...provided,
      color: state.isFocused ? '#337ab7' : '#000000',
      backgroundColor: state.isDisabled ? 'red' : '#FFFFFF',
      cursor: state.isDisabled ? 'default' : 'pointer',
      padding: '15px 10px'
    }),
    input: () => ({
      backgroundColor: '#FFFFFF',
      paddingLeft: '15px',
      width: '220px',
      height: '30px',
      lineHeight: '30px',
      display: 'inline-block',
      margin: '0',
      position:'relative',
      borderRadius: '3px !important'
    }),
    placeholder: () => ({
      margin: '0 0 0 15px',
      position: 'absolute',
      zIndex: '99',
      height: '30px',
      top: '2px',
      lineHeight: '30px',
    }),
    control: () => ({
      // none of react-select's styles are passed to <Control />
      // width: 200,
    }),
    menuList: () => ({
      width: '500px',
      zIndex: '3000',
      maxHeight: '400px',
      backgroundColor: '#FFFFFF',
      overflowY: 'auto',
      position: 'fixed',
      top: '52px',
      border: '1px solid #CCCCCC',
      borderRadius: '4px'
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
  
      return { ...provided, opacity, transition };
    }
  }
}

const TopNavigationMenu = hh(class TopNavigationMenu extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      isLogged: false,
      searchValue: '',
      userSession: { displayName: '' }
    };
  }

  componentDidMount = async () => {
    this._isMounted = true;
    this.init();
  };

  handleUnauthorized() {
    Storage.clearStorage();
    if (window.gapi.auth2 != undefined) {
      let auth2 = window.gapi.auth2.getAuthInstance();
      auth2.signOut();
    }
    this.props.history.push(this.props.location);
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  async init() {
    let user = await User.isAuthenticated();
    if (user != null && user.data.session) {
      let resp = await User.getUserSession();
      Storage.setCurrentUser(resp.data);
      if (this._isMounted) {
        this.setState({
          isLogged: true,
          userSession: resp.data
        });
      }
    }
  }

  onSuccess = async (token) => {
    await User.signIn(token);
    Storage.setUserIsLogged(true);
    window.location.reload();
    this.init().then(resp => {
      if (Storage.getLocationFrom() != null) {
        this.props.history.push(Storage.getLocationFrom());
        Storage.removeLocationFrom();
      } else {
        this.props.history.push("/index");
      }
    });
  };

  signOut = async () => {
    this.props.showSpinner();
    Storage.clearStorage();
    if (window.gapi.auth2 != undefined) {
      let auth2 = window.gapi.auth2.getAuthInstance();
      await auth2.signOut();
      await User.signOut();
    }
    this.setState({
      isLogged: false
    }, () => {
      window.location.reload();
    });
  };

  openMetricsReport() {
    Reports.getMetricsReport();
  }

  loadOptions = (query, callback) => {
    let options = [];
    if (query.length > 2) {
      Search.getMatchingIssues(query).then(response => {
        let options = response.data.map((item) => {
          return {
            key: item.id,
            value: item.value,
            label: this.generateLabel(item),
            linkDisabled: item.linkDisabled,
            url: item.url,
            isDisabled: item.linkDisabled
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

  generateLabel = (item) => {
    let label = item.label;
    if (item.linkDisabled === true && item.pm.length > 0) {
      label = this.createLabel(item.pm);
    } else if (item.linkDisabled === true) {
      label = this.createLabel(item.reporter);
    }
    console.log('test', label);
    return label;
  }

  createLabel(contact) {
    return span({ style: styles.listResultContainer }, [
      span({ style: styles.badgeContactAccess }, [
        ' Please contact ' + contact + ' for access'
      ]),
      div({ style: { 'marginTop': '10px' } }, [
        item.label
      ])
    ])
  }

  handleSearchChange = (data, action) => {
    if (data != null && !data.linkDisabled) {
      window.location.href = data.url;
    }
  };

  render() {
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
            h(Link, { className: "navbar-brand", to: { pathname: Storage.userIsLogged() ? UrlConstants.index : '/' } },
              [
                span({}, [
                  "ORSP Portal ",
                  span({ isRendered: process.env.NODE_ENV === 'development', className: "label label-danger" }, ["Dev"])
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
              li({ isRendered: component.isBroad }, [
                h(Link, { to: { pathname: UrlConstants.viewSearchUrl } },
                  ['Search']
                )
              ]),
              li({ isRendered: component.isBroad && !component.isViewer, className: "dropdown" }, [
                a({ href: "#", className: "dropdown-toggle", "data-toggle": "dropdown" }, [
                  "New ", b({ className: "caret" }, [])
                ]),
                ul({ className: "dropdown-menu" }, [
                  li({}, [h(Link, { to: { pathname: UrlConstants.projectUrl } }, ["New Project"])])
                ])
              ]),
              li({ isRendered: component.isAdmin, className: "dropdown" }, [
                a({ href: "#", className: "dropdown-toggle", "data-toggle": "dropdown" }, [
                  "Admin ", b({ className: "caret" }, [])
                ]),
                ul({ className: "dropdown-menu" }, [
                  li({}, [h(Link, { to: { pathname: UrlConstants.dataUseListUrl } }, ["Data Use Restrictions"])]),
                  li({}, [h(Link, { to: { pathname: UrlConstants.reviewCategoryReportUrl } }, ["Review Category Report"])]),
                  li({}, [h(Link, { to: { pathname: UrlConstants.qaEventReportViewUrl } }, ["QA Event Report"])]),
                  li({}, [h(Link, { to: { pathname: UrlConstants.fundingReportUrl } }, ["Funding Source Report"])]),
                  li({}, [a({ href: "#", onClick: this.openMetricsReport }, ["AAHRPP Metrics Report (CSV)"])]),
                  li({}, [h(Link, { to: { pathname: UrlConstants.rolesManagementUrl } }, ["Roles Management"])])
                ])
              ])
            ]),
            div({ isRendered: component.isBroad, className: "navbar-form navbar-left" }, [
              MultiSelect({
                id: "pk_select",
                label: "",
                styles: styles.customStyles,
                isDisabled: false,
                loadOptions: this.loadOptions,
                handleChange: this.handleSearchChange,
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
                  h(Link, { to: { pathname: '/' }, onClick: this.signOut },
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
export default LoadingWrapper(TopNavigationMenu, true);
