import { Component, React } from 'react';
import { h1, hh, li, small, span, ul, label, br, div } from 'react-hyperscript-helpers';
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
import { ConfirmationDialog } from '../components/ConfirmationDialog';

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
      },
      allKeyPersons: {
        pi:[],
        pm:[],
        additionalPis:[],
        additionalPms:[],
        KeyPersons:[]
      },
      showModal:false,
      modalMessage: ''

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

  handleUpdateKeyPersons = (updated, index) => {
    if(this.hasDuplicateNameKey(updated)){
      this.showDuplicateModal("User already exists. Please choose another one.")
      updated.splice(index, 1);
    }
    this.setState(prev => {
      prev.formData.keyPersons = updated;
      return prev;
    }, () => {
      this.props.updateForm(this.state.formData, 'keyPersons')
      this.checkDuplicateKeyPersons(updated,'keyPersons')}
    );
    this.props.removeErrorMessage();
  };

  hasDuplicateNameKey = (arr) => {
  const keys = arr
    .map(item => item.name && item.name.key)
    .filter(Boolean);
  return keys.length !== new Set(keys).size;
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
    }, () => {
      this.props.updateForm(this.state.formData, 'piNames'),
      // check if duplicate exist
      this.checkDuplicateKeyPersons(data, 'piNames')
    });
  };

  handlePMChange = (data, action) => {
    if (data !== null && !Array.isArray(data)) {
      data = [data];
    }
    this.setState(prev => {
      prev.formData.projectManagers = data;
      return prev;
    }, () => {
      this.props.updateForm(this.state.formData, 'projectManagers')
      // check if duplicate exist
      this.checkDuplicateKeyPersons(data,'projectManagers')
    }
    );
  };

  checkDuplicateKeyPersons = (data, field) => {
    // What happens if Data is null

    if (field === 'piNames' && !data) {
      this.setState((prev) => ({ allKeyPersons: { ...prev.allKeyPersons, pi: [] } }))
      return;
    }

    if (field === 'projectManagers' && !data) {
      this.setState((prev) => ({ allKeyPersons: { ...prev.allKeyPersons, pm: [] } }))
      return;
    }

    if (field === 'keyPersons' && data.length === 1 && !data[0].name) {
      this.setState((prev) => ({ allKeyPersons: { ...prev.allKeyPersons, KeyPersons: [] } }))
      return;
    }

    const KEYPERSONS = Object.values(this.state.allKeyPersons).flat();
    const IS_EMPTY = !!KEYPERSONS.length;

    if (field === 'piNames') {
      const DUPLICATE_EXIST = KEYPERSONS.find((kp) => kp === data[0].key)
      if (!DUPLICATE_EXIST) {
        this.setState((prev) => ({ allKeyPersons: { ...prev.allKeyPersons, pi: [data[0].key] } }))
      } else {
        this.showDuplicateModal("User already exists. Please choose another one")
        this.setState(prev => {
          prev.formData.piNames = null;
          return prev;
        }, () => {
          this.props.updateForm(this.state.formData, 'piNames')
        });
      }
    }

    if (field === 'projectManagers') {
      const DUPLICATE_EXIST = KEYPERSONS.find((kp) => kp === data[0].key)
      if (!DUPLICATE_EXIST) {
        this.setState((prev) => ({ allKeyPersons: { ...prev.allKeyPersons, pm: [data[0].key] } }))
      } else {
        this.showDuplicateModal("User already exists. Please choose another one")
        this.setState(prev => {
          prev.formData.projectManagers = null;
          return prev;
        }, () => {
          this.props.updateForm(this.state.formData, 'projectManagers')
        });
      }
    }

    if (field === 'keyPersons') {
      // Here Keyperson(Study Staff) is not spred because data in keyperson cannot have duplicate value
      // handles in handleUpdateKeyPersons function
      const KEYPERSONS = [...this.state.allKeyPersons.pi,...this.state.allKeyPersons.pm,]
      const IS_DUPLICATE_PRESENT = this.checkAndRemoveDuplicate(KEYPERSONS, data);
      if(IS_DUPLICATE_PRESENT){
        this.showDuplicateModal("User already exists. Please choose another one")
      }
      if (data.length === 0) {
        this.setState(prev => {
          prev.formData.keyPersons = [{ name: null, role: '', otherRole: '' }];
          return prev;
        }, () => this.props.updateForm(this.state.formData, 'keyPersons'));
      } else {
        this.setState((prevState) => ({
          formData: {
            ...prevState.formData,
            keyPersons: data
          }
        }), () => {
          this.props.updateForm(this.state.formData, 'keyPersons')
          this.setState((prev) => ({
            allKeyPersons: {
              ...prev.allKeyPersons, KeyPersons: this.state.formData.keyPersons
                .filter(x => x && x.name && x.name.key)
                .map(x => x.name.key)
            }
          }))
        });
      }
    }
  } 
  
  checkAndRemoveDuplicate = (keyPersons, updatedArray) => {
    for (let i = 0; i < updatedArray.length; i++) {
      for (let j = 0; j < keyPersons.length; j++) {
        if (updatedArray[i] && updatedArray[i].name && 
            updatedArray[i].name.key === keyPersons[j]) {
          updatedArray.splice(i, 1);
          return true;
        }
      }
    }
    return false;
  }

  showDuplicateModal = (message) => {
    this.setState({
      showModal:true,
      modalMessage:message
    })
  }

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    return (
      WizardStep({
        warningMessage:'Keypersons mentioned in Key Personnel and Study Staff cannot be similar.',
        title: this.props.title, step: 0, currentStep: this.props.currentStep,
        error: this.props.errors.fundings || this.props.errors.fundingAwardNumber ||
               this.props.errors.fundingSponsor || this.props.errors.studyDescription ||
               this.props.errors.pTitle || this.props.errors.piName ||
               this.props.errors.piAffiliations || this.props.errors.KeyStudyContact,
        errorMessage: 'Please complete all required fields.'}, [
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

        Panel({ title: "Key Personnel"}, [
          label({className:'inputFieldLabel'},["Principal Investigator (PI) Responsible for Project Conduct and Oversight",span({ className: 'errorMessage' }, ' *')]),
          AsyncMultiSelect({
            id: "pi_select",
            isDisabled: false,
            loadOptions: this.loadUsersOptions,
            handleChange: this.handlePIChange,
            value: this.state.formData.piNames,
            placeholder: "Start typing the PI Names",
            isMulti: false,
            error: this.props.errors.piName,
            isWarning: false
          }),
          small({ isRendered: this.props.errors.piName, className: "errorMessage" }, ['Required field']),
          br(),
          label({className:'inputFieldLabel'},["PI’s Primary Institutional Affiliation",span({ className: 'errorMessage' }, ' *')]),
          div({},[
            InputFieldSelect({
              id: "affiliations",
              name: "affiliations",
              options: PI_AFFILIATION,
              value: this.state.formData.affiliations,
              onChange: this.handleSelectChange("affiliations"),
              placeholder: "Choose an affiliation...",
              readOnly: false,
              edit: false,
              error: this.props.errors.piAffiliations,
            }),
          ]),
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
          br(),
          label({className:'inputFieldLabel'},["Key Study Contact (will receive email notifications about this project)",span({ className: 'errorMessage' }, ' *')]),
          AsyncMultiSelect({
            id: "inputProjectManager",
            isDisabled: false,
            loadOptions: this.loadUsersOptions,
            handleChange: this.handlePMChange,
            value: this.state.formData.projectManagers,
            placeholder: "Start typing the Project Manager Name",
            isMulti: false,
            error: this.props.errors.KeyStudyContact,
            isWarning: false
          }),
          small({ isRendered: this.props.errors.KeyStudyContact, className: "errorMessage" }, ['Required field']),
        ]),

        Panel({ title: "Study Staff"}, [
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
          // AsyncMultiSelect({
          //   id: "collaborator_select",
          //   label: "Broad individuals who require access to this project record",
          //   isDisabled: false,
          //   loadOptions: this.loadUsersOptions,
          //   handleChange: this.handleProjectCollaboratorChange,
          //   value: this.state.formData.collaborators,
          //   placeholder: "Start typing names for project access",
          //   isMulti: true,
          //   currentValue: this.state.formData.collaborators
          // }),
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
        ]),
        ConfirmationDialog({
          closeModal: this.state.showModal,
          show: this.state.showModal,
          handleOkAction: () => this.setState({showModal:false}),
          bodyText: this.state.modalMessage,
          actionLabel: 'close',
          title: 'Duplicate Entry',
          hideCancel:true
        }, []),
      ])
    );
  }
});
