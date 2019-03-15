import { Component, React } from 'react';
import { hh, h1, span, a, div } from 'react-hyperscript-helpers';
import { Security } from "./Security";
import { WizardStep } from "./WizardStep";

export const SecurityStep = hh(class SecurityStep extends Component {

  state = {};

  constructor(props) {
    super(props);
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------');
    console.log(error, info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  formHasError() {
    let stateError = false;
    Object.keys(this.state.errors).forEach(key => {
      if (this.state.errors[key] === true) {
        stateError = true;
      }
    });
    return stateError;
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    if (this.props.review === false) {
      return (
        WizardStep({
          title: this.props.title,
          step: this.props.step,
          currentStep: this.props.currentStep,
          error: this.props.showErrorInfoSecurity && this.formHasError(),
          errorMessage: 'Please complete all required fields'
        }, [
          Security({
            user: this.props.user,
            searchUsersURL: this.props.searchUsersURL,
            updateForm: this.props.updateForm,
            showErrorInfoSecurity: this.props.showInfoSecurityError,
            removeErrorMessage: this.props.removeErrorMessage,
            handleSecurityValidity: this.props.handleSecurityValidity,
            readOnly: this.props.readOnly,
            current: this.props.current,
            formData: this.props.formData,
            edit: false,
            review: false,
          })
        ])
      )
    } else {
      return  (
        Security({
          user: this.props.user,
          searchUsersURL: this.props.searchUsersURL,
          updateForm: this.props.updateForm,
          showErrorInfoSecurity: this.props.showInfoSecurityError,
          removeErrorMessage: this.props.removeErrorMessage,
          handleSecurityValidity: this.props.handleSecurityValidity,
          readOnly: this.props.readOnly,
          current: this.props.current,
          formData: this.props.formData,
          edit: true,
          review: true,
        })
      )
    }
  }
});
