import { Component, Fragment} from 'react';
import { h, p, div, h1, h2, h4, small, br, input, label, span, a, ul, li, button } from 'react-hyperscript-helpers';

import { Panel } from '../components/Panel';
import { ProjectInfoLink } from "../util/ajax";
import { SampleCollectionWizard } from "../components/SampleCollectionWizard";
import _ from 'lodash';

class InfoLink extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentStepIndex: 0,
      documents: [],
      sampleCollections: [],
      currentStep: 0,
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
    ProjectInfoLink.getProjectSampleCollections(this.props.projectKey, this.props.consentKey, this.props.serverURL).then(
      data => {
        JSON.parse(data.data.sampleCollections).map(sampleCollection => {
          sampleCollectionsIds.push(sampleCollection);
        });
        this.setState(prev => {
          prev.documents = JSON.parse(data.data.documents);
          prev.sampleCollections = sampleCollectionsIds;
          return prev;
        });
    });
  };

  render() {

    const { sampleCollections } = this.state;
    return (
      div({}, [
        a({ className: "breadcrumbLink" }, [
          span({ className: "glyphicon glyphicon-chevron-left" }, []),
          //replace with actual Sample/Data Cohort name
          "DEV-CG-4355: Walter / Test"
        ]),
        h2({ className: "pageTitle" }, [
          div({}, ["Sample Collections associated to"]),
          //replace with actual Project name
          div({ className: "italic normal" }, [this.props.projectKey])
        ]),
        //replace with actual Sample Collection name
        div({ className: "tabContainer" }, [
          sampleCollections.map((child, idx) => {
            return h(Fragment, { key: idx }, [
              Panel({ title: child.sampleCollectionId }, [ //complete name, first need to bring all its values
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