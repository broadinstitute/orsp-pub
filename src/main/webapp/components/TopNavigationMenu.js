import { Component } from "react";
import { a, hh, div, button, span, ul, li, b, form, input, h } from 'react-hyperscript-helpers';
import { InputFieldText } from './InputFieldText';
import { Btn } from '../components/Btn';
import GoogleLoginButton from "./GoogleLoginButton";
import { Storage } from '../util/storage'
import { User } from "../util/ajax";
import { Link, withRouter } from 'react-router-dom';
import { UrlConstants } from "../util/UrlConstants";

export const TopNavigationMenu = hh(class TopNavigationMenu extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      pageCounter: 0,
      isLogged: Storage.userIsLogged
    };
    this.signOut = this.signOut.bind(this);
  }

  async onSuccess(token) {
    let resp = await User.authUser(token)
    Storage.setCurrentUser(resp.data);
    Storage.setUserIsLogged(true);
    this.setState({
      isLogged: true
    })
  }

  signOut() {
    Storage.setUserIsLogged(false);
    Storage.clearStorage();
    this.props.history.push(UrlConstants.index);
  }

  render() {
    let isLogged = Storage.userIsLogged();
    let currentUser = {}
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
              li({}, [
                h(Link, { to: { pathname: UrlConstants.viewSearchUrl } },
                  ['Search']
                )
              ]),
              li({ className: "dropdown" }, [
                a({ className: "dropdown-toggle", href: "/" }, [
                  "New ", b({ className: "caret" }, [])
                ]),
                ul({ className: "dropdown-menu" }, [
                  li({}, [a({}, ["New Project"])])
                ])
              ]),
              li({ isRendered: true, className: "dropdown" }, [
                a({ className: "dropdown-toggle", href: "/" }, [
                  "Admin ", b({ className: "caret" }, [])
                ]),
                ul({ className: "dropdown-menu" }, [
                  li({}, [a({ href: "/" }, ["Data Use Restrictions"])]),
                  li({}, [a({ href: "/" }, ["Review Category Report"])]),
                  li({}, [a({ href: "/" }, ["Event Report"])]),
                  li({}, [a({ href: "/" }, ["Funding Source Report"])]),
                  li({}, [a({ href: "/" }, ["AAHRPP Metrics Report (CSV)"])]),
                  li({}, [a({ href: "/" }, ["Roles Management"])])
                ])
              ])
            ]),
            form({ className: "navbar-form navbar-left" }, [
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
            div({ isRendered: this.state.isLogged }, [
              ul({ className: "nav navbar-nav" }, [
                li({}, [
                  h(Link, { to: { pathname: UrlConstants.profileUrl } },
                    [currentUser.displayName]
                  )
                ]),
                li({}, [
                  a({ onClick: this.signOut }, ["Sign out"])
                ]),
              ]),
            ]),
            div({ isRendered: !this.state.isLogged }, [
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
