import { Component, Fragment} from 'react';
import { h, p, div, h1, h2, h4, small, br, input, label, span, a, ul, li, button } from 'react-hyperscript-helpers';

import { Panel } from '../components/Panel';
import { ProjectInfoLink } from "../util/ajax";

class InfoLink extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentStepIndex: 0,
      sampleCollections: ["ALGO"],
      readOnly: false,
      submit: false,
      formData: {
      },
      errors: {
      }
    };
  }

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    let sampleCollectionsIds = [];
    ProjectInfoLink.getProjectSampleCollections(this.props.projectKey, this.props.consentKey, this.props.serverURL).then( data => {
      data.data.sampleCollections.map(val => sampleCollectionsIds.push(val.sampleCollectionId));
      this.setState(prev => {
        prev.sampleCollections = sampleCollectionsIds;
        return prev;
      })
    });
  };

  goStep = (n) => (e) => {
    e.preventDefault();
    this.setState(prev => {
      prev.currentStepIndex = n;
      return prev;
    }, () => {
      this.props.stepChanged(this.state.currentStepIndex);
    })
  };

  render() {

    const { currentStepIndex, sampleCollections } = this.state;
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
              Panel({ title: child }, [
                div({
                  className: "tabStep " + (idx === currentStepIndex ? "active" : ""),
                  // onClick: this.goStep(idx)
                }, [
                  div({ className: "linkTab" }, [
                    div({ className: "linkTabHeader" }, [
                      div({ className: "tab active", onClick: this.goStep(0)}, ["International Cohorts"]),
                      div({ className: "tab ", onClick: this.goStep(1)}, ["Security"]),
                      div({ className: "tab ", onClick: this.goStep(2)}, ["MTA"]),
                      div({ className: "tab ", onClick: this.goStep(3)}, ["Documents"])
                    ]),
                    div({ className: "linkTabContent" }, [
                    ])
                  ])
                ])
              ]),
            ])
          })
        ]),
      ])
    )
  }
}

export default InfoLink;