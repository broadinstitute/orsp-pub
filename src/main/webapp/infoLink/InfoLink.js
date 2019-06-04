import { Component, Fragment} from 'react';
import { h, div, h2, span, a } from 'react-hyperscript-helpers';
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
    ProjectInfoLink.getProjectSampleCollections(component.cclId, component.serverURL).then(
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
    return [component.serverURL, "/consentGroup/show", component.consentKey,"?projectKey=" + component.projectKey].join("/");
  };

  render() {
    const { sampleCollections } = this.state;
    return (
      div({}, [
        a({ className: "breadcrumbLink",
            onClick: () => window.open(this.redirectToProject(),"_self"),
            target: '_blank'}, [
          span({ className: "glyphicon glyphicon-chevron-left" }, []),
          component.consentKey + " : " +this.state.consentName
        ]),
        h2({ className: "pageTitle" }, [
          div({}, ["Sample Collections associated to"]),
          div({ className: "italic normal" }, [component.projectKey + " : " +this.state.projectName])
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
