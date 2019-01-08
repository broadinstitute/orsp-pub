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
      projectExtraProps: [],
      piList: { key: '', label: '', value: '' },
      pmList: { key: '', label: '', value: '' },
      fundings: [{ source: '', sponsor: '', identifier: '' }],
      requestor: {
        displayName: '',
        emailAddress: ''
      },
      storageDocuments: []
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

          //        prev.fundings = element.data.fundings;

          let elementFundings = [];
          element.data.fundings.map(funding => {
            elementFundings.push({ source: funding.source, sponsor: funding.name, identifier: funding.awardNumber });
          });
          prev.fundings = elementFundings;

          prev.storageDocuments = element.data.storageDocuments;
          prev.requestor = element.data.requestor;
          return prev;
        }, () => console.log("Project Review State ", this.state))
    );
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
            onChange: () => console.log("input")
          }),
          InputFieldText({
            id: "inputRequestorEmail",
            name: "requestorEmail",
            label: "Requestor Email Address",
            value: this.state.requestor.emailAddress,
            disabled: true,
            readOnly: true,
            required: true,
            onChange: () => console.log("input")
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
            fundings: this.state.fundings,
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
            value: this.state.projectForm.summary,
            disabled: true,
            readOnly: true,
            required: false,
            onChange: () => console.log("input"),
            error: false,
            errorMessage: "Required field"
          }),
          MultiSelect({
            id: "collaborator_select",
            label: "Individuals who require access to this project record",
            isDisabled: true,
            readOnly: true,
            loadOptions: [],
            handleChange: () => console.log("input"),
            //value: this.state.formData.collaborators,
            value: "collaborators here",
            placeholder: "Start typing collaborator names",
            isMulti: true
          }),
          InputFieldText({
            id: "inputPTitle",
            name: "pTitle",
            label: "Title of project/protocol",
            value: "Project title",
            //value: this.state.,
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
            value: "protocol id",
            disabled: true,
            readOnly: true,
            required: false,
            onChange: () => console.log("input")
          }),
          InputYesNo({
            id: "radioSubjectProtection",
            name: "subjectProtection",
            label: "Is the Broad Institute's Office of Research Subject Protection administratively managing this project, ",
            moreInfo: "i.e. responsible for oversight and submissions?",
            value: true,
            onChange: () => console.log("input"),
            required: false,
            readOnly: true,
            error: false,
            errorMessage: "Required field"
          })
        ]),

        Panel({ title: "Determination Questions" }, [
          InputFieldRadio({
            id: "radioPII",
            name: "pii",
            label: 'Is this a "fee-for-service" project? ',
            moreInfo: span({}, ["For a list of what constitutes PII and PHI, ", a({ href: "https://intranet.broadinstitute.org/faq/storing-and-managing-phi", target: "_blank" }, ["visit this link"]), "."]),
            value: true,
            //optionValues: ["true", "false"],
            optionLabels: [
              "Yes",
              "No"
            ],
            onChange: () => console.log("radio"),
            required: false,
            readOnly: true,
            error: false,
            errorMessage: "Required field"
          }),
          InputFieldRadio({
            id: "radioPII",
            name: "pii",
            label: 'Is this a "fee-for-service" project? ',
            moreInfo: span({}, ["For a list of what constitutes PII and PHI, ", a({ href: "https://intranet.broadinstitute.org/faq/storing-and-managing-phi", target: "_blank" }, ["visit this link"]), "."]),
            value: true,
            readOnly: true,
            //optionValues: ["true", "false"],
            optionLabels: [
              "Yes",
              "No"
            ],
            onChange: () => console.log("radio"),
            required: false,
            readOnly: true,
            error: false,
            errorMessage: "Required field"
          })
        ]),

        div({ className: "buttonContainer", style: { 'marginRight': '0' } }, [
          button({ className: "btn buttonPrimary floatRight", onClick: () => console.log("edit"), isRendered: true }, ["Approve"]),
        ])
      ])
    )
  }
}

export default ProjectReview;