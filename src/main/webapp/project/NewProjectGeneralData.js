import { Component, React } from 'react';
import { h1, hh, li, small, span, ul } from 'react-hyperscript-helpers';
import { WizardStep } from '../components/WizardStep';
import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { InputFieldTextArea } from '../components/InputFieldTextArea';
import { Fundings } from '../components/Fundings';
import { AsyncMultiSelect } from '../components/AsyncMultiSelect';
import { Search } from '../util/ajax';
import { InputFieldSelect } from '../components/InputFieldSelect';
import { PI_AFFILIATION, PREFERRED_IRB } from '../util/TypeDescription';
import { KeyPersonnel } from '../components/KeyPersonnel';

const fundingTooltip =
  ul({}, [
    li({}, [span({ className: "bold" }, ["Federal Prime: "]), "Direct federal (ex: NIH) award to Broad."]),
    li({}, [span({ className: "bold" }, ["Federal Sub - Award: "]), "Federal award received by Broad via a subcontract with another institution.For example, MGH is the prime reciepient of a federal award and Broad receives a portion of the award via a subcontract from MGH."]),
    li({}, [span({ className: "bold" }, ["Broad Institutional Award: "]), "Internal Broad Institute funding such as SPARC funding"]),
    li({}, [span({ className: "bold" }, ["Purchase Order: "]), "Typically used for Fee-for-Service work."]),
    li({}, [span({ className: "bold" }, ["Corporate Funding: "]), "Industry (ex: Johnson & Johnson) funding"]),
    li({}, [span({ className: "bold" }, ["Foundation: "]), "Foundation funding (ex: American Cancer Society)"]),
    li({}, [span({ className: "bold" }, ["Philanthropy: "]), "Private Donors"]),
    li({}, [span({ className: "bold" }, ["Other: "]), "Anything not covered in one of the other categories"]),
  ]);

export const NewProjectGeneralData = hh(class NewProjectGeneralData extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    this.loadUsersOptions = this.loadUsersOptions.bind(this);
    this.state = {
      formData: {
        projectManagers: [],
        piNames: [],
        affiliations: '',
        affiliationOther: '',
        studyDescription: '',
        pTitle: '',
        irbProtocolId: '',
        irb: '',
        fundings: [{ source: '', sponsor: '', identifier: '' }],
        keyPersons: [{ name: null, role: '', otherRole: '' }],
        collaborators: []
      },
      formerData: {
        projectManager: [],
        piNames: [],
        affiliations: '',
        affiliationOther: '',
        studyDescription: '',
        pTitle: '',
        irbProtocolId: '',
        irb: '',
        fundings: [{ source: '', sponsor: '', identifier: '' }],
        keyPersons: [{ name: null, role: '', otherRole: '' }],
        collaborators: []
      },
      errors: {
        studyDescription: false,
        pTitle: false,
        fundings: false
      }
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleUpdateFundings = (updated) => {
    this.setState(prev => {
      prev.formData.fundings = updated;
      return prev;
    }, () => this.props.updateForm(this.state.formData, 'fundings'));
    this.props.removeErrorMessage();
  };

  handleUpdateKeyPersons = (updated) => {
    this.setState(prev => {
      prev.formData.keyPersons = updated;
      return prev;
    }, () => this.props.updateForm(this.state.formData, 'keyPersons'));
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

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  loadUsersOptions(query, callback) {
    if (query.length > 2) {
      Search.getMatchingQuery(query).then(response => {
        if (this._isMounted) {
          let options = response.data.map(function (item) {
            return {
              key: item.id,
              value: item.value,
              label: item.label
            };
          });
          callback(options);
        }
      }).catch(error => {
        this.setState(() => { throw error; });
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
    if (data !== null && !Array.isArray(data)) {
      data = [data];
    }
    this.setState(prev => {
      prev.formData.piNames = data;
      return prev;
    }, () => this.props.updateForm(this.state.formData, 'piNames'));
  };

  handlePMChange = (data, action) => {
    if (data !== null && !Array.isArray(data)) {
      data = [data];
    }
    this.setState(prev => {
      prev.formData.projectManagers = data;
      return prev;
    }, () => this.props.updateForm(this.state.formData, 'projectManagers')
    );
  };

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    return (
      WizardStep({
        title: this.props.title, step: 0, currentStep: this.props.currentStep,
        error: this.props.errors.fundings || this.props.errors.fundingAwardNumber ||
               this.props.errors.fundingSponsor || this.props.errors.studyDescription ||
               this.props.errors.pTitle || this.props.errors.piName ||
               this.props.errors.piAffiliations || this.props.errors.KeyStudyContact,
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

        Panel({ title: "Study Staff/Key Personnel"}, [
          AsyncMultiSelect({
            id: "pi_select",
            label: "Principal Investigator (PI) Responsible for Project Conduct and Oversight (required)",
            isDisabled: false,
            loadOptions: this.loadUsersOptions,
            handleChange: this.handlePIChange,
            value: this.state.formData.piNames,
            placeholder: "Start typing the PI Names",
            isMulti: false,
            error: this.props.errors.piName
          }),
          small({ isRendered: this.props.errors.piName, className: "errorMessage" }, ['Required field']),
          InputFieldSelect({
            label: "PI’s Primary Institutional Affiliation (required)",
            id: "affiliations",
            name: "affiliations",
            options: PI_AFFILIATION,
            value: this.state.formData.affiliations,
            onChange: this.handleSelectChange("affiliations"),
            placeholder: "Choose an affiliation...",
            readOnly: false,
            edit: false,
            error: this.props.errors.piAffiliations
          }),
          small({ isRendered: this.props.errors.piAffiliations, className: "errorMessage" }, ['Required field']),
          InputFieldText({
            isRendered: this.state.formData.affiliations.value === "other",
            id: "affiliationOther",
            name: "affiliationOther",
            label: "Primary Investigator Other Affiliation ",
            value: this.state.formData.affiliationOther,
            disabled: false,
            required: false,
            onChange: this.handleInputChange,
            edit: false
          }),
          AsyncMultiSelect({
            id: "inputProjectManager",
            label: "Key Study Contact (will receive email notifications about this project) (required)",
            isDisabled: false,
            loadOptions: this.loadUsersOptions,
            handleChange: this.handlePMChange,
            value: this.state.formData.projectManagers,
            placeholder: "Start typing the Project Manager Name",
            isMulti: false,
            error: this.props.errors.KeyStudyContact
          }),
          small({ isRendered: this.props.errors.KeyStudyContact, className: "errorMessage" }, ['Required field']),
        ]),

        Panel({ title: "Key Personnel*"}, [
          KeyPersonnel({
            readOnly: false,
            keyPersons: this.state.formData.keyPersons,
            updateKeyPersons: this.handleUpdateKeyPersons,
            error: this.props.errors.keyPersons,
            errorIndex: this.props.errors.keyPersonsErrorIndex || [],
            errorMessage: "Required field",
            edit: false
          })
        ]),

        Panel({ title: "Funding*", tooltipLabel: "?", tooltipMsg: fundingTooltip }, [
          Fundings({
            readOnly: false,
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
            label: "Briefly describe the study activities that will occur at the Broad. ",
            moreInfo: `Indicate whether protected health information or other identifiable data will be accessed, 
                        and summarize any planned data sharing. If applicable, please also note any planned use of 
                        artificial intelligence or large language models (LLMs)`,
            value: this.state.formData.studyDescription,
            disabled: false,
            required: false,
            onChange: this.handleInputChange,
            error: this.props.errors.studyDescription,
            errorMessage: "Required field",
            edit: false
          }),
          AsyncMultiSelect({
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
          InputFieldSelect({
            label: "If IRB submission is anticipated, please indicate the IRB-of-record:",
            id: "irb",
            name: "irb",
            options: PREFERRED_IRB,
            value: this.state.formData.irb,
            onChange: this.handleSelectChange("irb"),
            readOnly: false,
            edit: false,
            isClearable: true
          })
        ])
      ])
    );
  }
});
