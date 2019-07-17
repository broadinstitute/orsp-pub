import { Component } from 'react';
import { input, hh, h, h3, div, p, hr, small, button, ul, li, br, span } from 'react-hyperscript-helpers';
import { DUL, ConsentGroup } from '../util/ajax';
import { AlertMessage } from './AlertMessage';
import { InputFieldText } from './InputFieldText';
import { validateEmail } from "../util/Utils";
import { spinnerService } from "../util/spinner-service";
import { Spinner } from './Spinner';
import './Documents.css';

export const DataUseLetter = hh(class DataUseLetter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      alertMessage: '',
      showAlert: false,
      error: false,
      alertType: 'success',
      invalidEmail: false,
      collaboratorEmail: ''
    };
  }

  validEmail = (email) => {
    if (validateEmail(email)) {
      return true;
    } else {
      this.setState({ invalidEmail: true });
    }
  };

  send = () => {
    spinnerService.showAll();
    const collaboratorEmail = this.state.collaboratorEmail;
    if (this.validEmail(collaboratorEmail)) {
      this.setState({ alertMessage: '', collaboratorEmail: '', showAlert: false });
      console.log(this.props.userName);
      ConsentGroup.sendEmailDul(this.props.projectKey, this.props.userName, this.state.collaboratorEmail).then(resp => {
        setTimeout(this.removeAlertMessage, 5000, null);
        this.setState(prev => {
          prev.alertType = 'success';
          prev.alertMessage = 'Email sent to: ' + collaboratorEmail;
          prev.showAlert = true;
          prev.collaboratorEmail = '';
          return prev;
        }, () => spinnerService.hideAll());
      }).catch(error => {
        spinnerService.hideAll();
        this.setState(prev => {
          prev.alertType = 'danger';
          prev.alertMessage = 'Error sending email to: ' + collaboratorEmail + '. Please try again later.';
          prev.showAlert = true;
          prev.collaboratorEmail = '';
          return prev;
        });
      });
    } else spinnerService.hideAll();
  };

  getShareableLink = () => {
    let data = {
      consentGroupKey: this.props.projectKey,
      creator: this.props.userName
    };
    DUL.generateRedirectLink(data).then(resp => {
      navigator.clipboard.writeText(component.serverURL + "/dataUseLetter/show?id=" + resp.data.dulToken);
      this.successTimeAlert();
    }).catch(error => {
      this.setState(prev => {
        prev.disableBtn = false;
        prev.alertType = "danger";
        prev.alertMessage = 'Something went wrong. Please try again.';
        prev.showAlert = true;
        return prev;
      });
    });
  };

  successTimeAlert = () => {
    setTimeout(this.removeAlertMessage, 3000, null);
    this.setState(prev => {
      prev.alertType = "success";
      prev.alertMessage = "Link copied to clipboard!";
      prev.showAlert = true;
      return prev;
    });
  };

  removeAlertMessage = () => {
    this.setState(prev => {
      prev.alertType = "success";
      prev.alertMessage = "";
      prev.showAlert = false;
      return prev;
    });
  };

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.fileError = false;
      prev[field] = value;
      if (field === 'collaboratorEmail') {
        prev.invalidEmail = false;
      }
      return prev;
    })
  };

  render(){

    return(

      div({ style: { 'marginTop': '10px' } }, [
        p({ className: "bold" }, [
          "Do you want to send a Data Use Letter form directly to your Collaborator for their IRB's completion?",
          span({ className: "data-use-clarification" }, ["You can either insert the email below and a link will be sent to them directly or click to get a shareable link."])
        ]),
        div({ className: "collaborator-email-container row" }, [
          div({ className: "col-xs-12 col-sm-6 col-md-8" }, [
            InputFieldText({
              id: "inputCollaboratorEmail",
              name: "collaboratorEmail",
              label: "Collaborator Email",
              value: this.state.collaboratorEmail,
              disabled: false,
              required: false,
              placeholder: "Enter email address...",
              onChange: this.handleInputChange,
              error: this.state.invalidEmail,
              errorMessage: 'Invalid email address'
            }),
            button({ className: "btn buttonPrimary", disabled: this.state.collaboratorEmail === '', onClick: this.send }, ["Send"])
          ]),
          div({ className: "col-xs-12 col-sm-6 col-md-4 shareable-link" }, [
            button({
              className: "btn buttonPrimary",
              onClick: this.getShareableLink,
              name: "getLink",
              disabled: false,
              id: 'shareable-link'
            }, [
                span({ className: "glyphicon glyphicon-link", style: { 'marginRight': '5px' } }, []),
                "Get shareable link"
              ]),
          ])
        ]),

        div({ className: "row" }, [
          div({ className: "col-xs-12" }, [
            div({ style: { 'marginTop': '30px' } }, [
              AlertMessage({
                type: this.state.alertType,
                msg: this.state.alertMessage,
                show: this.state.showAlert
              }),
            ])
          ])
        ])
      ])
    );
  }
});

