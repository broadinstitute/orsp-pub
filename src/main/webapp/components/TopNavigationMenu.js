import { Component } from "react";
import { a, hh, div, button, span, ul, li, b, h, nav } from 'react-hyperscript-helpers';
import { Storage } from '../util/Storage'
import { User, Reports, Search } from "../util/ajax";
import { Link } from 'react-router-dom';
import { UrlConstants } from "../util/UrlConstants";
import { MultiSelect } from '../components/MultiSelect';
import GoogleLoginButton from '../components/GoogleLoginButton';
import LoadingWrapper from '../components/LoadingWrapper';
import ResponsiveMenu from 'react-responsive-navbar';
import './TopNavigationMenu.css';

function ColorValue(isDisabled, isFocused) {
  let color = '#000000';
  if (!isDisabled && isFocused) {
    color = '#337ab7';
  } else if (!isDisabled && !isFocused) {
    color = '#000000';
  } else if (isDisabled && !isFocused) {
    color = '#999999';
  }
  return color;
}

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
      color: ColorValue(state.isDisabled, state.isFocused),
      backgroundColor: state.isDisabled ? '#FAFAFA' : '#FFFFFF',
      cursor: state.isDisabled ? 'default' : 'pointer',
      padding: '15px 10px'
    }),
    input: () => ({
      backgroundColor: '#FFFFFF',
      width: '200px',
      height: '30px',
      lineHeight: '30px',
      display: 'inline-block',
      margin: '0',
      position: 'relative',
      borderRadius: '3px !important'
    }),
    placeholder: () => ({
      position: 'absolute',
      zIndex: '99',
      height: '30px',
      top: '2px',
      lineHeight: '30px',
    }),
    menuList: () => ({	
      width: '500px',	
      zIndex: '3000',	
      maxHeight: '400px',	
      backgroundColor: '#FFFFFF',	
      border: '1px solid #CCCCCC',	
      borderRadius: '4px'	
    })
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
    this.init().then(resp => {
      if (Storage.getLocationFrom() != null) {
        this.props.history.push(Storage.getLocationFrom());
        Storage.removeLocationFrom();
      } else {
        this.props.history.push("/index");
      }
      window.location.reload();
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
      label = this.createLabel(item.pm, item.label);
    } else if (item.linkDisabled === true) {
      label = this.createLabel(item.reporter, item.label);
    }
    return label;
  }

  createLabel(contact, label) {
    return h(span, { style: styles.listResultContainer }, [
      span({ style: styles.badgeContactAccess }, [
        ' Please contact ' + contact + ' for access'
      ]),
      div({ style: { 'marginTop': '10px' } }, [
        label
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

      nav({ className: "navbar navbar-default navbar-fixed-top", role: "navigation" }, [
        div({ className: "container" }, [
          h(Link, { className: "navbar-brand", to: { pathname: Storage.userIsLogged() ? UrlConstants.index : '/' } }, [
            span({}, [
              "ORSP Portal ",
              span({ isRendered: component.env === 'development', className: "label label-danger" }, ["Dev"])
            ])
          ]),
          h(ResponsiveMenu, {
            changeMenuOn: "767px",
            menuOpenButton: div({ className: "navbar-open-icon" }, []),
            menuCloseButton: div({ className: "navbar-close-icon" }, []),
            menu:
              div({ className: "navbar-container" }, [
                ul({ className: "nav navbar-nav navbar-left " + (this.state.isLogged ? 'left-container' : ''), }, [
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
                div({ className: "right-container" }, [
                  div({ isRendered: component.isBroad, className: "navbar-form" }, [
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
                  ul({ isRendered: this.state.isLogged, className: "nav navbar-nav navbar-right" }, [
                    li({}, [
                      h(Link, { to: { pathname: UrlConstants.profileUrl } },
                        [this.state.userSession.displayName]
                      )
                    ]),
                    li({}, [
                      h(Link, { to: { pathname: '/' }, onClick: this.signOut },
                        ["Sign out"]
                      )
                    ])
                  ])
                ]),
                div({ isRendered: !this.state.isLogged, className: "googleButton" }, [
                  GoogleLoginButton({
                    clientId: component.clientId,
                    onSuccess: this.onSuccess
                  })
                ])
              ])
          })
        ])
      ])
    )
  }
});
export default LoadingWrapper(TopNavigationMenu, true);
