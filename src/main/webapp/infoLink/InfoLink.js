import { Component, Fragment} from 'react';
import { h, div, h2, span, a, p, b } from 'react-hyperscript-helpers';
import { Panel } from '../components/Panel';
import { ProjectInfoLink } from "../util/ajax";
import { SampleCollectionWizard } from "../components/SampleCollectionWizard";
import { InputFieldCheckbox } from '../components/InputFieldCheckbox';
import { isEmpty } from "../util/Utils";
import { format } from 'date-fns';

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
      startDate: "",
      endDate: "",
      onGoingProcess: false,
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
    ProjectInfoLink.getProjectSampleCollections(infoLinkConstant.cclId, component.serverURL).then(
      data => {
        JSON.parse(data.data.sampleCollections).map(sampleCollection => {
          sampleCollectionsIds.push(sampleCollection);
        });
        this.setState(prev => {
          prev.documents = JSON.parse(data.data.documents);
          prev.sampleCollections = sampleCollectionsIds;
          prev.consentName = sampleCollectionsIds[0].consentName;
          prev.projectName = sampleCollectionsIds[0].projectName;
          prev.startDate =  sampleCollectionsIds[0].startDate !== undefined ? format(new Date(sampleCollectionsIds[0].startDate), 'MM/DD/YYYY') : null;
          prev.endDate =  sampleCollectionsIds[0].endDate !== undefined ? format(new Date(sampleCollectionsIds[0].endDate), 'MM/DD/YYYY') : '--';
          prev.onGoingProcess =  sampleCollectionsIds[0].onGoingProcess;
          return prev;
        });
    }).catch(error => {
      this.setState(() => { throw error; });
    });
  };

  redirectToProject = () => {
    return [component.serverURL, "newConsentGroup/main?consentKey=" + component.consentKey + "&projectKey=" + component.projectKey].join("/");
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
                div({isRendered: this.state.startDate !== null, className:"row", style: { 'margin': '5px 0 20px 0' }}, [
                  div({className: "col-xs-12 col-sm-4"}, [
                    p({}, [
                      b({}, ["Start Date: "]), this.state.startDate
                    ])
                  ]),
                  div({className: "col-xs-12 col-sm-4"}, [
                    p({}, [
                      b({}, ["End Date: "]), this.state.endDate
                    ])
                  ]),                  
                  div({className: "col-xs-12 col-sm-4"}, [
                    InputFieldCheckbox({
                      id: "onGoingProcess",
                      name: "onGoingProcess",
                      label: "Ongoing Process",
                      checked: this.state.onGoingProcess,
                      readOnly: true
                    })
                  ])
                ]),
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
