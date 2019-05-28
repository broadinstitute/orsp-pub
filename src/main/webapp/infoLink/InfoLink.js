import { Component, Fragment} from 'react';
import { h, div, h2, label, span, a } from 'react-hyperscript-helpers';

import { Panel } from '../components/Panel';
import { ProjectInfoLink } from "../util/ajax";
import { SampleCollectionWizard } from "../components/SampleCollectionWizard";
import { isEmpty } from "../util/Utils";

class InfoLink extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentStepIndex: 0,
      documents: [],
      sampleCollections: [],
      currentStep: 0,
      consentName: "",
      projectName: "",
      determination: {
        projectType: null,
        questions: [],
        requiredError: false,
        currentQuestionIndex: 0,
        nextQuestionIndex: 1,
        endState: false
      },
    };
  }

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    let sampleCollectionsIds = [];
    ProjectInfoLink.getProjectSampleCollections(this.props.projectKey, this.props.consentKey, this.props.sampleCollectionId, this.props.serverURL).then(
      data => {
        JSON.parse(data.data.sampleCollections).map(sampleCollection => {
          sampleCollectionsIds.push(sampleCollection);
        });
        this.setState(prev => {
          prev.documents = JSON.parse(data.data.documents);
          prev.sampleCollections = sampleCollectionsIds;
          prev.consentName = sampleCollectionsIds[0].consentName;
          prev.projectName = sampleCollectionsIds[0].projectName;
          return prev;
        });
    }).catch(error => {
      this.setState(() => { throw error; });
    });
  };

  redirectToProject = () => {
    return [this.props.serverURL, "/consentGroup/show", this.props.consentKey,"?projectKey=" + this.props.projectKey].join("/");
  };

  render() {
    const { sampleCollections } = this.state;
    return (
      div({}, [
        a({ className: "breadcrumbLink",
            onClick: () => window.open(this.redirectToProject(),"_self"),
            target: '_blank'}, [
          span({ className: "glyphicon glyphicon-chevron-left" }, []),
          this.props.consentKey + " : " +this.state.consentName
        ]),
        h2({ className: "pageTitle" }, [
          div({}, ["Sample Collections associated to"]),
          div({ className: "italic normal" }, [this.props.projectKey + " : " +this.state.projectName])
        ]),
        div({ className: "tabContainer" }, [
          sampleCollections.map((child, idx) => {
            return h(Fragment, { key: idx }, [
              Panel({ title: isEmpty(child.sampleCollectionId) ? "N/A" : child.sampleCollectionId + " : " + child.collectionName }, [
                SampleCollectionWizard({
                  sample: child,
                  documents: this.state.documents
                })
              ])
            ])
          })
        ])
      ])
    )
  }
}

export default InfoLink;
