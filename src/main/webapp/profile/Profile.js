import React, { Component } from 'react';
import { div, hh, p, span } from 'react-hyperscript-helpers';
import { User } from '../util/ajax';
import { format } from 'date-fns';
import './Profile.css';
import LoadingWrapper from '../components/LoadingWrapper';

const Profile = hh(class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    this.props.showSpinner();
    User.getUserSession(component.getUserUrl).then(resp => {
      this.setState(prev => { 
        prev.user = resp.data;
        return prev;
      },() => {
        this.props.hideSpinner();
      });
    }).catch(error => {
      this.props.hideSpinner();
      this.setState(() => { throw error; });
    });
  };

  getRole() {
    let role = 'Standard Access';
    if (this.state.user.isAdmin || this.state.user.isORSP || this.state.user.isComplianceOffice) {
      role = 'Admin';
    }
    else if (this.state.user.isViewer) {
      role =  "Read Only";
    }
    return role;
  }

  render() {
    return (
      div({ className: "headerBoxContainer" }, [
        div({ className: "headerBox" }, [
          p({ className: "issue-type" }, ["USER PROFILE"]),
          div({ className: "row rowProfile" }, [
            div({ className: "col-xs-12 col-sm-6 col-md-3" }, [
              p({ className: "inputFieldLabel" }, [
                "Name:",
                span({ className: "inputDetail" }, [
                  this.state.user.displayName
                ])
              ]),
              p({ className: "inputFieldLabel" }, [
                "Email:",
                span({ className: "inputDetail" }, [
                  this.state.user.emailAddress
                ])
              ])
            ]),
            div({ className: "col-xs-12 col-sm-6 col-md-3" }, [
              p({ className: "inputFieldLabel" }, [
                "Username:",
                span({ className: "inputDetail" }, [
                  this.state.user.userName
                ])
              ]),
              p({ className: "inputFieldLabel" }, [
                "Last Login:",
                span({ className: "inputDetail" }, [
                  format(new Date(this.state.user.lastLoginDate), 'MM/DD/YYYY HH:MM')
                ])
              ]),
            ]),
            div({ className: "col-xs-12 col-md-6" }, [
              p({ className: "inputFieldLabel" }, [
                "Roles:",
                span({ className: "inputDetail" }, [
                  this.getRole()
                ])
              ])
            ])
          ])
        ])
      ])

    );
  }
});

export default LoadingWrapper(Profile);
