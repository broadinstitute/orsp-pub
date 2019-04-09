import { Component, React, Fragment } from 'react';
import { hh, div, h, button, h1, ul, li, span, p, small } from 'react-hyperscript-helpers';
import { WizardStep } from '../components/WizardStep';
import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { InputFieldTextArea } from '../components/InputFieldTextArea';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { InputFieldCheckbox } from '../components/InputFieldCheckbox';
import { Fundings } from '../components/Fundings';
import { MultiSelect } from '../components/MultiSelect';

import { Search } from '../util/ajax';
import { InputFieldSelect } from "../components/InputFieldSelect";
import { PREFERRED_IRB } from "../util/TypeDescription";

const fundingTooltip =
  ul({}, [
    li({}, [span({ className: "bold" }, ["Federal Prime: "]), "Direct federal (ex: NIH) award to Broad."]),
    li({}, [span({ className: "bold" }, ["Federal Sub - Award: "]), "Federal award received by Broad via a subcontract with another institution.For example, MGH is the prime reciepient of a federal award and Broad receives a portion of the award via a subcontract from MGH."]),
    li({}, [span({ className: "bold" }, ["Internal Broad: "]), "Internal Broad Institute funding such as SPARC funding"]),
    li({}, [span({ className: "bold" }, ["Purchase Order: "]), "Typically used for Fee-for-Service work."]),
    li({}, [span({ className: "bold" }, ["Corporate Funding: "]), "Industry (ex: Johnson & Johnson) funding"]),
    li({}, [span({ className: "bold" }, ["Foundation: "]), "Foundation funding (ex: American Cancer Society)"]),
    li({}, [span({ className: "bold" }, ["Philanthropy: "]), "Private Donors"]),
    li({}, [span({ className: "bold" }, ["Other: "]), "Anything not covered in one of the other categories"]),
  ]);

export const NewProjectGeneralData = hh(class NewProjectGeneralData extends Component {

  constructor(props) {
    super(props);
    this.loadUsersOptions = this.loadUsersOptions.bind(this);
    this.state = {
      formData: {
        projectManager: '',
        piName: '',
        studyDescription: '',
        pTitle: '',
        irbProtocolId: '',
        uploadConsentGroup: '',
        notCGSpecify: '',
        subjectProtection: '',
        irbReferral: '',
        fundings: [{ source: '', sponsor: '', identifier: '' }],
        collaborators: [],
        attestation: false
      },
      formerData: {
        projectManager: '',
        piName: '',
        studyDescription: '',
        pTitle: '',
        irbProtocolId: '',
        uploadConsentGroup: '',
        notCGSpecify: '',
        subjectProtection: '',
        irbReferral: '',
        fundings: [{ source: '', sponsor: '', identifier: '' }],
        collaborators: [],
        attestation: false
      },
      errors: {
        studyDescription: false,
        pTitle: false,
        uploadConsentGroup: false,
        subjectProtection: false,
        fundings: false,
        attestation: false
      }
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);

  }

  handleUpdateFundings = (updated) => {
    this.setState(prev => {
      prev.formData.fundings = updated;
      return prev;
    }, () => this.props.updateForm(this.state.formData, 'fundings'));
    this.props.removeErrorMessage();
  };

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formerData[field] = prev.formData[field];
      prev.formData[field] = value;
      return prev;
    }, () => this.props.updateForm(this.state.formData, field));
    this.props.removeErrorMessage();
  };

  handleRadioChange = (e, field, value) => {
    this.setState(prev => {
      prev.formData[field] = value;
      if (field === 'uploadConsentGroup' && value !== 'notCGSpecify') {
        prev.formData.notCGSpecify = '';
      }
      return prev;
    }, () => this.props.updateForm(this.state.formData, field));
    this.props.removeErrorMessage();
  };

  handleProjectManagerChange = (data, action) => {
    this.setState(prev => {
      prev.formData.projectManager = data;
      return prev;
    }, () => this.props.updateForm(this.state.formData, 'projectManager'));
    this.props.removeErrorMessage();
  };

  handleSelectChange = (field) => () => (selectedOption) => {
    this.setState(prev => {
        prev.formData[field] = selectedOption;
        return prev;
      }, () => {
        this.props.updateForm(this.state.formData, field);
        this.props.removeErrorMessage();
      }
    )
  };

  componentDidCatch(error, info) {
    console.log(error, info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  loadUsersOptions(query, callback) {
    if (query.length > 2) {
      Search.getMatchingUsers(this.props.searchUsersURL, query)
        .then(response => {
          let options = response.data.map(function (item) {
            return {
              key: item.id,
              value: item.value,
              label: item.label
            };
          });
          callback(options);
        });
    }
  };

  handleProjectCollaboratorChange = (data, action) => {
    this.setState(prev => {
      prev.formData.collaborators = data;
      return prev;
    }, () => this.props.updateForm(this.state.formData, 'collaborators'));
  };

  handlePIChange = (data, action) => {
    this.setState(prev => {
      prev.formData.piName = data;
      return prev;
    }, () => this.props.updateForm(this.state.formData, 'piName'));
  }

  handleAttestationCheck = () => {
    this.setState(prev => {
      prev.formData.attestation = !this.state.formData.attestation;
      return prev;
    }, () => this.props.updateForm(this.state.formData, 'attestation'));
    this.props.removeErrorMessage();
  };

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    return (
      WizardStep({
        title: this.props.title, step: 0, currentStep: this.props.currentStep,
        error: this.props.errors.fundings || this.props.errors.fundingAwardNumber || this.props.errors.studyDescription || this.props.errors.pTitle || this.props.errors.uploadConsentGroup || this.props.errors.subjectProtection || this.props.errors.attestation,
        errorMessage: 'Please complete all required fields'}, [
        Panel({ title: "Requestor Information ", moreInfo: "(person filling the form)", tooltipLabel: "?", tooltipMsg: "Future correspondence regarding this project will be directed to this individual" }, [
          InputFieldText({
            id: "inputRequestorName",
            name: "requestorName",
            label: "Requestor Name",
            value: this.props.user.displayName,
            disabled: true,
            required: true,
            onChange: this.handleInputChange,
            edit: false
          }),
          InputFieldText({
            id: "inputRequestorEmail",
            name: "requestorEmail",
            label: "Requestor Email Address",
            value: this.props.user.emailAddress.replace('&#64;', '@'),
            disabled: true,
            required: true,
            onChange: this.handleInputChange,
            edit: false
          })
        ]),

          Panel({ title: "Principal Investigator ", moreInfo: "(if applicable)" }, [
            MultiSelect({
              id: "pi_select",
              label: "Broad PI",
              isDisabled: false,
              loadOptions: this.loadUsersOptions,
              handleChange: this.handlePIChange,
              value: this.state.formData.piName,
              placeholder: "Start typing the PI Name",
              isMulti: false,
              edit: false
            }),
            MultiSelect({
              id: "inputProjectManager",
              label: "Broad Project Manager",
              isDisabled: false,
              loadOptions: this.loadUsersOptions,
              handleChange: this.handleProjectManagerChange,
              value: this.state.formData.projectManager,
              placeholder: "Start typing the Project Manager Name",
              isMulti: false,
              edit: false
            }),
          ]),

        Panel({ title: "Funding*", tooltipLabel: "?", tooltipMsg: fundingTooltip }, [
          Fundings({
            fundings: this.state.formData.fundings,
            updateFundings: this.handleUpdateFundings,
            error: this.props.errors.fundings,
            fundingAwardNumberError: this.props.errors.fundingAwardNumber,
            errorMessage: "Required field",
            edit: false
          }),
        ]),

        Panel({ title: "Project Summary" }, [
          InputFieldTextArea({
            id: "inputStudyActivitiesDescription",
            name: "studyDescription",
            label: "Describe Broad study activities* ",
            moreInfo: "(briefly, in 1-2 paragraphs, with attention to whether or not protected health information will be accessed, future data sharing plans, and commercial or academic sample/data sources. For commercially purchased products, please cite product URL.)",
            value: this.state.formData.studyDescription,
            disabled: false,
            required: false,
            onChange: this.handleInputChange,
            error: this.props.errors.studyDescription,
            errorMessage: "Required field",
            edit: false
          }),
          MultiSelect({
            id: "collaborator_select",
            label: "Broad individuals who require access to this project record",
            isDisabled: false,
            loadOptions: this.loadUsersOptions,
            handleChange: this.handleProjectCollaboratorChange,
            value: this.state.formData.collaborators,
            placeholder: "Start typing names for project access",
            isMulti: true,
            currentValue: this.state.formData.collaborators
          }),
          InputFieldText({
            id: "inputPTitle",
            name: "pTitle",
            label: "Title of project/protocol*",
            value: this.state.formData.pTitle,
            disabled: false,
            required: false,
            onChange: this.handleInputChange,
            error: this.props.errors.pTitle,
            errorMessage: "Required field",
            edit: false
          }),
          InputFieldText({
            id: "inputIrbProtocolId",
            name: "irbProtocolId",
            label: "Protocol # at Broad IRB-of-record ",
            moreInfo: "(if applicable/available)",
            value: this.state.formData.irbProtocolId,
            disabled: false,
            required: false,
            onChange: this.handleInputChange,
            edit: false
          }),
          InputFieldRadio({
            id: "radioUploadConsentGroup",
            name: "uploadConsentGroup",
            label: "Will you be uploading a Consent Group?",
            value: this.state.formData.uploadConsentGroup,
            optionValues: ["uploadNow", "uploadLater", "notUpload"],
            optionLabels: [
              span({},["Yes, I will upload a Consent Group ", span({ className: "bold"}, ["now"]) ]),
              span({},["Yes, I will upload a Consent Group ", span({ className: "bold"}, ["later"]) ]),
              "No, I will not upload a Consent Group"
            ],
            onChange: this.handleRadioChange,
            required: true,
            error: this.props.errors.uploadConsentGroup,
            errorMessage: "Required field",
            edit: false
          }),
          div({ isRendered: this.state.formData.uploadConsentGroup === "notUpload" }, [
            InputFieldText({
              id: "inputNotCGSpecify",
              name: "notCGSpecify",
              label: "Please specify",
              value: this.state.formData.notCGSpecify,
              disabled: false,
              required: false,
              onChange: this.handleInputChange,
              edit: false
            })
          ]),
          InputFieldRadio({
            id: "radioSubjectProtection",
            name: "subjectProtection",
            label: "For this project, are you requesting that Broad’s ORSP assume responsibility for submitting regulatory documentation to an outside IRB ",
            moreInfo: "(as opposed to the study team independently managing the submissions)? *",
            value: this.state.formData.subjectProtection,
            optionValues: ["true", "false", "notapplicable"],
            optionLabels: [
              "Yes",
              "No",
              "N/A - No IRB submission required"
            ],
            onChange: this.handleRadioChange,
            required: true,
            error: this.props.errors.subjectProtection,
            errorMessage: "Required field",
            edit: false
          }),
          InputFieldSelect({
            label: "If IRB submission is anticipated, please indicate the IRB-of-record:",
            id: "irbReferral",
            name: "irbReferral",
            options: PREFERRED_IRB,
            value: this.state.formData.irbReferral,
            onChange: this.handleSelectChange("irbReferral"),
            readOnly: false,
            edit: false
          })
        ]),

        Panel({ title: "Broad Responsible Party (or Designee) Attestation*" }, [
          p({}, 'I confirm that the information provided above is accurate and complete. The Broad researcher associated with the project is aware of this application, and I have the authority to submit it on his/her behalf.'),
          p({}, '[If obtaining coded specimens/data] I certify that no Broad staff or researchers working on this project will have access to information that would enable the identification of individuals from whom coded samples and/or data were derived. I also certify that Broad staff and researchers will make no attempt to ascertain information about these individuals.'),
          InputFieldCheckbox({
            id: "ckb_attestation",
            name: "attestation",
            onChange: this.handleAttestationCheck,
            label: "I confirm",
            defaultChecked: this.state.formData.attestation,
            required: true
          }),
          small({ isRendered: this.props.errors.attestation, className: "errorMessage" }, 'Required Field')
        ])
      ])
    );
  }
});
