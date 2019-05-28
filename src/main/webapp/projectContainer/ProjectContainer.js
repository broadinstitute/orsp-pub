
import { Component } from 'react';
import { div, span, className, h1, p } from 'react-hyperscript-helpers';
import { loadConsentGroups, loadHistory, loadSubmissions, loadComments } from '../util/renderUtils';
import { ProjectMigration } from '../util/ajax';
import '../components/Wizard.css';
import './index.css';

class ProjectContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currentStepIndex: 0,
      content: ''
    };
  }

  goStep = (n) => (e) => {
    this.setState(prev => {
      prev.currentStepIndex = n;
      return prev;
    });
    if (n == 2) {
      this.buildConsentGroups();
    }
    if (n == 3) {
      this.buildSubmissions();
    }
    if (n == 4) {
      this.buildComments();
    }
    if (n == 5) {
      this.buildHistory();
    }
  };

  buildConsentGroups = () => {
    ProjectMigration.getConsentGroups(component.serverUrl, "DEV-NE-5418").then(resp => {
      this.setState(prev => {
        prev.content = resp.data;
        return prev;
      }, () => {
        loadConsentGroups();
      });
    });
  };

  buildHistory = () => {
    ProjectMigration.getHistory(component.serverUrl, "DEV-NE-5418").then(resp => {
      this.setState(prev => {
        prev.content = resp.data;
        return prev;
      }, () => {
        loadHistory();
      });
    })
  };

  buildComments = () => {
    ProjectMigration.getComments(component.serverUrl, "DEV-NE-5418").then(resp => {
      this.setState(prev => {
        prev.content = resp.data;
        return prev;
      }, () => {
        loadComments();
      });
    });
  };

  buildSubmissions = () => {
    ProjectMigration.getSubmissions(component.serverUrl, "DEV-NE-5418").then(resp => {
      this.setState(prev => {
        prev.content = resp.data;
        return prev;
      }, () => {
        loadSubmissions();
      })
    });
  };

  render() {

    const { currentStepIndex } = this.state;

    return (
      // will be moved to a new component 
      div({ className: "headerBoxContainer" }, [
        div({ className: "headerBox" }, [
          p({ className: "headerBoxStatus top" }, ["Project Type"]),
          h1({ className: "projectTitle" }, [
            span({ className: "projectKey" }, ["ProjectKey: "]),
            span({ className: "italic" }, ["ProjectTitle"])
          ]),


          p({ className: "headerLabel" }, [
            "Status: ",
            span({ className: "block" }, ["ActualStatus"])
          ]),

          p({ className: "headerLabel" }, [
            "Awaiting action from: ",
            span({ className: "block" }, ["ActualPerson"])
          ]),
          p({ className: "headerBoxStatus" }, [
            span({ className: "bold" }, ["New Status: "]),
            span({ className: "italic" }, ["SomeStatus"])
          ]),
          p({ className: "headerBoxStatus" }, [
            span({ className: "bold" }, ["Information Sub-Status: "]),
            span({ className: "italic" }, ["SomeStatus"])
          ]),
          p({ className: "headerBoxStatus" }, [
            span({ className: "bold" }, ["Documents Sub-Status: "]),
            span({ className: "italic" }, ["SomeStatus"])
          ])
        ]),
      
        div({ className: "containerBox" }, [
          div({ className: "tabContainer" }, [


            //   this.props.children.map((child, idx) => {
            //     return h(Fragment, { key: idx }, [
            //       div({ className: "tabStep " + (idx === currentStepIndex ? "active" : ""), onClick: this.goStep(idx)}, [child.props.title])
            //     ])
            //   })


            div({ className: "tabStep " + (currentStepIndex === 0 ? "active" : ""), onClick: this.goStep(0) }, ["Project Details"]),
            div({ className: "tabStep " + (currentStepIndex === 1 ? "active" : ""), onClick: this.goStep(1) }, ["Documents New"]),
            div({ className: "tabStep " + (currentStepIndex === 2 ? "active" : ""), onClick: this.goStep(2) }, ["Sample/Data Cohort"]),
            div({ className: "tabStep " + (currentStepIndex === 3 ? "active" : ""), onClick: this.goStep(3) }, ["Submissions"]),
            div({ className: "tabStep " + (currentStepIndex === 4 ? "active" : ""), onClick: this.goStep(4) }, ["Messages"]),
            div({ className: "tabStep " + (currentStepIndex === 5 ? "active" : ""), onClick: this.goStep(5) }, ["History"]),
          ]),
          div({ className: "tabContent", dangerouslySetInnerHTML: { __html: this.state.content } }, [

          ])
        ])
      ])
    );
  }
}

export default ProjectContainer;
