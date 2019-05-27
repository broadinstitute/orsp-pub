
import React from 'react';
import Routes from "./Routes"
import { div, hh, label, span } from 'react-hyperscript-helpers';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currentStepIndex: 0
    };
  }

  goStep = (n) => (e) => {
    this.setState(prev => {
      prev.currentStepIndex = n;
      return prev;
    })
    if(n == 1) {
      window.location.href = [this.props.serverURL, "api/history"].join("/");
    }
  };
  render() {

    const { loading } = this.state;

    return (
      div({}, [
        div({ className: "linkTab" }, [
          // main box

          // project tabs 
          div({ className: "linkTabHeader" }, [
            div({ className: "tab " + (currentStepIndex === 0 ? "active" : ""), onClick: this.goStep(0) }, ["Project Details"]),
            div({ className: "tab " + (currentStepIndex === 1 ? "active" : ""), onClick: this.goStep(1) }, ["Broad Project Info"]),
            div({ className: "tab " + (currentStepIndex === 2 ? "active" : ""), onClick: this.goStep(2) }, ["Documents New"]),
            div({ className: "tab " + (currentStepIndex === 3 ? "active" : ""), onClick: this.goStep(3) }, ["Documents"]),
            div({ className: "tab " + (currentStepIndex === 4 ? "active" : ""), onClick: this.goStep(3) }, ["Sample/Data Cohort"]),
            div({ className: "tab " + (currentStepIndex === 5 ? "active" : ""), onClick: this.goStep(3) }, ["Submissions"]),
            div({ className: "tab " + (currentStepIndex === 6 ? "active" : ""), onClick: this.goStep(3) }, ["Messages"]),
            div({ className: "tab " + (currentStepIndex === 7 ? "active" : ""), onClick: this.goStep(3) }, ["History"]),
          ]),
          // main project components
          div({ className: "linkTabContent" }, [
            ProjectReview({
              issue: this.props.issue,
              searchUsersURL: this.props.searchUsersURL,
              projectKey: this.props.projectKey,
              projectUrl: this.props.projectUrl,
              addExtraPropUrl: this.props.urls.saveExtraPropUrl,
              isAdmin: this.props.isAdmin,
              isViewer: this.props.isViewer,
              serverURL: this.props.serverURL,
              rejectProjectUrl: this.props.rejectProjectUrl,
              updateProjectUrl: this.props.updateProjectUrl,
              discardReviewUrl: this.props.discardReviewUrl,
              clarificationUrl: this.props.clarificationUrl,
              loadingImage: this.props.loadingImage,
              currentStep: currentStepIndex,
              step: 1,
            })
          ])
        ])
      ])
    );
  }
}

export default App;
