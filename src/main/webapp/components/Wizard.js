import { Component, Fragment } from 'react';
import { div, hh, h3, h, button, h1, p, ul, li, a } from 'react-hyperscript-helpers';
import './Wizard.css';
import { scrollToTop } from "../util/Utils";

const styles = {
  titleSize: '24px',
  fontFamily : '"Helvetica Neue",Helvetica,Arial,sans-serif',
  textFontSize: '14px'
};

export const Wizard = hh(class Wizard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentStepIndex: 0,
      showError: false,
      readyToSubmit: false,
    };

    this.submitHandler = this.submitHandler.bind(this);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  prevStep = (e) => {
    e.preventDefault();
    this.setState(prev => {
      prev.currentStepIndex = prev.currentStepIndex === 0 ? this.props.children.length - 1 : prev.currentStepIndex - 1;
      prev.readyToSubmit = false;
      return prev;
    }, () => {
      scrollToTop();
      this.props.stepChanged(this.state.currentStepIndex);
    })
  };

  nextStep = async (e) => {
    e.preventDefault();
    if (await this.props.isValid(this.state.currentStepIndex, null)) {
      this.setState(prev => {
        prev.showError = true;
        prev.currentStepIndex = prev.currentStepIndex === this.props.children.length - 1 ? 0 : prev.currentStepIndex + 1;
        prev.readyToSubmit = this.props.showSubmit(prev.currentStepIndex);
        return prev;
      }, () => {
        scrollToTop();
        this.props.stepChanged(this.state.currentStepIndex);
      })
    }
  };

  goStep = (n) => async (e) => {
    e.preventDefault();
    this.setState(prev => {
      prev.currentStepIndex = n;
      prev.readyToSubmit = this.props.showSubmit(n);
      return prev;
    }, () => {
      scrollToTop();
      this.props.stepChanged(this.state.currentStepIndex);
    })
  };

  submitHandler = () => {
    this.props.submitHandler();
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    const { currentStepIndex } = this.state;

    return (
      div({ className: "wizardWrapper" }, [
        h1({ className: "wizardTitle" }, [this.props.title]),
        div({ isRendered: this.props.title === "New Project"}, [
          p({ style: { fontFamily : styles.fontFamily, fontSize: styles.textFontSize }}, [
            "In accordance with Institutional policies, ORSP must review (via an ORSP Portal submission) " +
            "any Broad project that involves either biospecimens or data originating from human sources, with the following exceptions: "]),
            ul([
              li([
                "Projects that are exclusively fee-for-service work for external entities (e.g. pharmaceutical companies, researchers with no " +
                "Broad affiliation or Broad email address), and that do not involve research collaborations (e.g. substantial contributions to " +
                "research design, joint data analysis, etc) with Broad-affiliated researchers.  Such projects are, however, subject to review by " +
                "Broad’s Office of Strategic Alliances and Partnerships (OSAP).  For additional information about OSAP review, " +
                "contact ", a({href:"mailto: agreements@broadinstitute.org"}, ["agreements@broadinstitute.org"]), " agreements@broadinstitute.org. " +
                "Fee-for-service projects that have been reviewed by OSAP may use ORSP-ID NE-8596 " +
                "when placing orders to the Genomics Platform/Broad Clinical Labs (including Walk-Up Sequencing)."
              ]),
              li([
                "Projects that involve only commercially/publicly available biospecimens (e.g. cell lines sourced from ATCC) or publicly available data " +
                "(e.g. open source data such as GEO, or controlled access data available via a data access committee such as dbGaP, provided that " +
                "IRB approval is not a condition for access).  Please note that projects involving the use of human embryonic stem cells DO require ORSP review."
              ])
            ]),
          p({ style: { fontFamily : styles.fontFamily, fontSize: styles.textFontSize }}, [
            "ORSP remains available to review projects that do not, per policy, require submission to the ORSP Portal, " +
            "particularly in cases where there are questions about Broad's engagement in research, or whether data generated " +
            "from a project can be shared widely in the future (e.g. datasets generated from commercially available " +
            "biospecimens that may require dbGaP deposition in the future). Email ", 
            a({href:"mailto: orsp@broadinstitute.org"}, ["orsp@broadinstitute.org"]), " for assistance."
          ]),
        ]),
        h3({ isRendered: this.props.note !== undefined, className: "italic" }, [this.props.note]),
        div({ className: "wizardContainer" }, [
          div({ className: "tabContainer" }, [
            this.props.children.map((child, idx) => {
              return h(Fragment, { key: idx }, [
                div({ className: "tabStep " + (idx === currentStepIndex ? "active" : ""), onClick: this.goStep(idx)}, [child.props.title])
              ])
            })
          ]),
          this.props.children,
          div({ className: "buttonContainer wizardButtonContainer" }, [
            button({ className: "btn buttonSecondary floatLeft", onClick: this.prevStep, isRendered: (this.state.currentStepIndex > 0)}, ["Previous Step"]),
            button({ className: "btn buttonPrimary floatRight", onClick: this.nextStep, isRendered: !this.state.readyToSubmit }, ["Next Step"]),
            button({ className: "btn buttonPrimary floatRight", onClick: this.submitHandler, isRendered: this.state.readyToSubmit, disabled: this.props.disabledSubmit}, ["Submit to ORSP"]),
          ])
        ])
      ])
    );
  }
});
