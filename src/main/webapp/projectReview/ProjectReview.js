import { Component } from 'react';
import { hh, p, div, h2, span, a, button } from 'react-hyperscript-helpers';
import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { MultiSelect } from '../components/MultiSelect';
import { Fundings } from '../components/Fundings';

import { InputYesNo } from '../components/InputYesNo';
import { InputFieldTextArea } from '../components/InputFieldTextArea';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { Project } from "../util/ajax";

class ProjectReview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      projectForm: {},
      projectExtraProps: {
        projectTitle: '',
        protocol: '',
        subjectProtection: ''

      },
      piList: { key: '', label: '', value: '' },
      pmList: { key: '', label: '', value: '' },
      fundings: [{ source: '', sponsor: '', identifier: '' }],
      collaborators: [],
      requestor: {
        displayName: '',
        emailAddress: ''
      }
    }
  }

  componentDidMount() {
    Project.getProject(this.props.projectUrl, this.props.projectKey).then(
      element =>
        this.setState(prev => {
          prev.projectForm = element.data.issue;
          prev.projectExtraProps = element.data.extraProperties;

          prev.piList.key = element.data.pis.userName;
          prev.piList.label = element.data.pis.displayName + " (" + element.data.pis.emailAddress + ") ";
          prev.piList.value = element.data.pis.displayName;

          prev.pmList.key = element.data.pms.userName;
          prev.pmList.label = element.data.pms.displayName + " (" + element.data.pms.emailAddress + ") ";
          prev.pmList.value = element.data.pms.displayName;

          let elementCollaborators = [];
          element.data.collaborators.map(coll => {
            elementCollaborators.push({
              key: coll.userName,
              label:coll.displayName + " (" + coll.emailAddress + ") ",
              value: coll.displayName
            });
          });
          prev.collaborators = elementCollaborators;

          let elementFundings = [];
          element.data.fundings.map(funding => {
              elementFundings.push({ source:{ label: funding.source, value: funding.source.split(" ").join("_").toLowerCase()}, sponsor: funding.name, identifier: funding.awardNumber });
          });
          prev.fundings = elementFundings;

          prev.requestor = element.data.requestor;
          return prev;
        }, () => {})
      );
  }

  isEmpty(value) {
    return value === '' || value === null || value === undefined;
  }

  render() {
    return (
      div({}, [
        h2({ className: "stepTitle" }, ["Project Information"]),

        Panel({ title: "Requestor" }, [
          InputFieldText({
            id: "inputRequestorName",
            name: "requestorName",
            label: "Requestor Name",
            value: this.state.requestor.displayName,
            disabled: true,
            readOnly: true,
            required: true,
            onChange: null
          }),
          InputFieldText({
            id: "inputRequestorEmail",
            name: "requestorEmail",
            label: "Requestor Email Address",
            value: this.state.requestor.emailAddress,
            disabled: true,
            readOnly: true,
            required: true,
            onChange: null
          })
        ]),

        Panel({ title: "Principal Investigator" }, [
          MultiSelect({
            id: "pi_select",
            label: "Broad PI",
            isDisabled: true,
            readOnly: true,
            loadOptions: [],
            handleChange: null,
            value: this.state.piList,
            placeholder: "Start typing the PI Name",
            isMulti: false
          }),
          MultiSelect({
            id: "inputProjectManager",
            label: "Broad Project Manager",
            isDisabled: true,
            readOnly: true,
            loadOptions: [],
            handleChange: null,
            value: this.state.pmList,
            placeholder: "Start typing the Project Manager Name",
            isMulti: false
          })
        ]),

        Panel({ title: "Funding" }, [
          Fundings({
            fundings: this.state.fundings.source !== undefined ? this.state.fundings : [],
//            fundings: this.state.fundings,
            updateFundings: null,
            readOnly: true,
            error: false,
            errorMessage: ""
          })
        ]),

        Panel({ title: "Project Summary" }, [
          InputFieldTextArea({
            id: "inputStudyActivitiesDescription",
            name: "studyDescription",
            label: "Broad study activities",
            value: this.state.projectForm.description,
            disabled: true,
            readOnly: true,
            required: false,
            onChange: null,
            error: false,
            errorMessage: "Required field"
          }),
          MultiSelect({
            id: "collaborator_select",
            label: "Individuals who require access to this project record",
            isDisabled: true,
            readOnly: true,
            loadOptions: [],
            handleChange: null,
            value: this.state.collaborators,
            placeholder: "Start typing collaborator names",
            isMulti: true
          }),
          InputFieldText({
            id: "inputPTitle",
            name: "pTitle",
            label: "Title of project/protocol",
            value: this.state.projectExtraProps.projectTitle,
            disabled: true,
            readOnly: true,
            required: false,
            onChange: null,
            error: false,
            errorMessage: "Required field"
          }),
          InputFieldText({
            id: "inputIrbProtocolId",
            name: "irbProtocolId",
            label: "Protocol # at Broad IRB-of-record ",
            value: this.state.projectExtraProps.protocol,
            disabled: true,
            readOnly: true,
            required: false,
            onChange: null
          }),
          InputYesNo({
            id: "radioSubjectProtection",
            name: "subjectProtection",
            label: "Is the Broad Institute's Office of Research Subject Protection administratively managing this project, ",
            moreInfo: "i.e. responsible for oversight and submissions?",
            value: this.state.projectExtraProps.subjectProtection,
            onChange: null,
            required: false,
            readOnly: true,
            error: false,
            errorMessage: "Required field"
          })
        ]),

        Panel({ title: "Determination Questions " }, [
        div({isRendered: !this.isEmpty(this.state.projectExtraProps.feeForService)},[
          InputYesNo({
            id: "radioPII",
            label: 'Is this a "fee-for-service" project? ',
            moreInfo: '(commercial service only, no Broad publication privileges)',
            value: this.state.projectExtraProps.feeForService,
            readOnly: true,
            onChange: () => {}
          }),
        ]),
        div({isRendered: !this.isEmpty(this.state.projectExtraProps.broadInvestigator)},[
          InputYesNo({
            id: "broadInvestigator",
            value: this.state.projectExtraProps.broadInvestigator,
            moreInfo: '(generating, contributing to generalizable knowledge)? Examples include case studies, internal technology development projects.',
            label: 'Is a Broad investigator conducting research ',
            readOnly: true,
            onChange: () => {}
          })
          ]),
        div({isRendered: !this.isEmpty(this.state.projectExtraProps.subjectsDeceased)},[
          InputYesNo({
            id: "subjectsDeceased",
            value: this.state.projectExtraProps.subjectsDeceased,
            label: 'Are all subjects who provided samples and/or data now deceased?',
            readOnly: true,
            onChange: () => {}
          })
          ]),
        div({isRendered: !this.isEmpty(this.state.projectExtraProps.sensitiveInformationSource)},[
          InputYesNo({
            id: "sensitiveInformationSource",
            value: this.state.projectExtraProps.sensitiveInformationSource,
            moreInfo: '(Coded data are considered identifiable if researcher has access to key)',
            label: 'Is Broad investigator/staff a) obtaining information or biospecimens through an interaction with living human subjects or, b) obtaining/analyzing/generating identifiable private information or identifiable biospecimens ',
            readOnly: true,
            onChange: () => {}
          })
          ]),
        div({isRendered: !this.isEmpty(this.state.projectExtraProps.interactionSource)},[
          InputYesNo({
            id: "interactionSource",
            value: this.state.projectExtraProps.interactionSource,
            moreInfo: '(i.e. is conductin HSR)?',
            label: 'Are samples/data being provied by an investigator who has identifiers or obtains samples through and interaction ',
            readOnly: true,
            onChange: () => {}
          })
          ]),
        div({isRendered: !this.isEmpty(this.state.projectExtraProps.isIdReceive)},[
          InputYesNo({
            id: "isIdReceive",
            value: this.state.projectExtraProps.isIdReceive,
            label: 'Is the Broad receiving subject identifiers?',
            readOnly: true,
            onChange: () => {}
          })
          ]),
        div({isRendered: !this.isEmpty(this.state.projectExtraProps.isCoPublishing)},[
          InputYesNo({
            id: "isCoPublishing",
            value: this.state.projectExtraProps.isCoPublishing,
            label: 'Is the Broad researcher co-publishing or doing joint analysis with investigator who has access to identifiers?',
            readOnly: true,
            onChange: () => {}
          })
          ]),
        div({isRendered: !this.isEmpty(this.state.projectExtraProps.federalFunding)},[
          InputYesNo({
            id: "federalFunding",
            value: this.state.projectExtraProps.federalFunding,
            label: 'Is Broad receiving direct federal funding?',
            readOnly: true,
            onChange: () => {}
          })
          ]),

        ]),

        div({ className: "buttonContainer", style: { 'marginRight': '0' } }, [
          button({ className: "btn buttonPrimary floatRight", onClick: () => console.log("edit"), isRendered: true }, ["Approve"]),
        ])
      ])
    )
  }
}

export default ProjectReview;