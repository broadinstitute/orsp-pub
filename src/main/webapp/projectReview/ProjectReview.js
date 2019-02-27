import { Component } from 'react';
import { hh, p, div, h2, span, a, button } from 'react-hyperscript-helpers';
import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { MultiSelect } from '../components/MultiSelect';
import { Fundings } from '../components/Fundings';
import { AlertMessage } from '../components/AlertMessage'
import { InputYesNo } from '../components/InputYesNo';
import { InputFieldTextArea } from '../components/InputFieldTextArea';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { AlertMessage } from "../components/AlertMessage";
import { spinnerService } from "../util/spinner-service";
import { Project, Search, User, Review } from "../util/ajax";
import get from 'lodash/get';

class ProjectReview extends Component {

  constructor(props) {
    super(props);

    this.state = {
      generalError: false,
      descriptionError: false,
      projectTitleError: false,
      editTypeError: false,
      editDescriptionError: false,
      subjectProtection: false,
      fundingError: false,
      fundingErrorIndex: [],
      showDialog: false,
      showDiscardEditsDialog: false,
      showApproveDialog: false,
      showRejectProjectDialog: false,
      readOnly: true,
      editedForm: {},
      formData: {
        description: '',
        projectType: '',
        piList: [{ key: '', label: '', value: '' }],
        pmList: [{ key: '', label: '', value: '' }],
        collaborators: [{ key: '', label: '', value: '' }],
        projectExtraProps: {
          projectTitle: '',
          protocol: '',
          subjectProtection: null,
          projectAvailability: null,
          describeEditType: null,
          editDescription: null,
          projectReviewApproved: 'false'
        },
        fundings: [{
          current: { source: { label: '', value: '' }, sponsor: '', identifier: '' },
          future: { source: { label: '', value: '' }, sponsor: '', identifier: '' }
        }],
        requestor: {
          displayName: '',
          emailAddress: ''
        }
      },
      disableApproveButton: false,
      reviewSuggestion: false,
      futureCopy: {},
      current: {
        requestor: {
          displayName: '',
          emailAddress: ''
        },
        requestorName: this.props.user !== undefined ? this.props.user.displayName : '',
        reporter: this.props.user !== undefined ? this.props.user.userName : '',
        requestorEmail: this.props.user !== undefined ? this.props.user.email.replace("&#64;", "@") : '',
        projectManager: '',
        piName: '',
        studyDescription: '',
        piList: [{ key: '', label: '', value: '' }],
        pmList: [{ key: '', label: '', value: '' }],
        fundings: [{
          current: { source: { label: '', value: '' }, sponsor: '', identifier: '' },
          future: { source: { label: '', value: '' }, sponsor: '', identifier: '' }
        }],
        collaborators: [{ key: '', label: '', value: '' }],
        projectExtraProps: {
          irbProtocolId: '',
          projectTitle: '',
          protocol: '',
          subjectProtection: null,
          projectAvailability: null,
          describeEditType: null,
          editDescription: null,
          projectReviewApproved: 'false'
        }
      }
    }
    this.rejectProject = this.rejectProject.bind(this);
    this.approveEdits = this.approveEdits.bind(this);
    this.removeEdits = this.removeEdits.bind(this);
    this.discardEdits = this.discardEdits.bind(this);
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  componentDidMount() {
    this.init();
  }

  init() {
    let current = {};
    let currentStr = {};
    let future = {};
    let futureCopy = {};
    let futureStr = {};
    let formData = {};
    let formDataStr = {};
    Project.getProject(this.props.projectUrl, this.props.projectKey).then(
      issue => {
        // store current issue info here ....
        current.description = issue.data.issue.description.replace(/<\/?[^>]+(>|$)/g, "");
        current.projectExtraProps = issue.data.extraProperties;
        current.piList = this.getUsersArray(issue.data.pis);
        current.pmList = this.getUsersArray(issue.data.pms);
        current.collaborators = this.getUsersArray(issue.data.collaborators);
        current.fundings = this.getFundingsArray(issue.data.fundings);
        current.requestor = issue.data.requestor !== null ? issue.data.requestor : this.state.requestor;
        currentStr = JSON.stringify(current);

        this.getReviewSuggestions();
        this.projectType = issue.data.issue.type;
        formData = JSON.parse(currentStr);
        current = JSON.parse(currentStr);
        future = JSON.parse((currentStr));
        futureCopy = JSON.parse(currentStr);
        // store current issue info here ....
        this.setState(prev => {
          // prepare form data here, initially same as current ....
          prev.formData = formData;
          prev.current = current;
          prev.future = future;
          prev.futureCopy = futureCopy;
          return prev;
        });
      });
  }

  getReviewSuggestions() {
    Review.getSuggestions(this.props.serverURL, this.props.projectKey).then(
      data => {
        if (data.data !== '') {
          this.setState(prev => {
            prev.formData = JSON.parse(data.data.suggestions);
            prev.editedForm = JSON.parse(data.data.suggestions);
            prev.reviewSuggestion = true;
            return prev;
          });
        } else {
          this.setState(prev => {
            prev.reviewSuggestion = false;
            return prev;
          });
        }
      });
  }

  isAdmin() {
    return this.props.isAdmin === "true";
  }

  getUsersArray(array) {
    let usersArray = [];
    if (array !== undefined && array !== null && array.length > 0) {
      array.map(element => {
        usersArray.push({
          key: element.userName,
          label: element.displayName + " (" + element.emailAddress + ") ",
          value: element.displayName
        });
      });
    }
    return usersArray
  }

  // Todo: handle data structure in Fundings component
  getFundingsArray(fundings) {
    let fundingsArray = [];
    if (fundings !== undefined && fundings !== null && fundings.length > 0) {
      fundings.map(funding => {
        fundingsArray.push({
          current: {
            source: {
              label: funding.source,
              value: funding.source.split(" ").join("_").toLowerCase()
            },
            sponsor: funding.name,
            identifier: funding.awardNumber !== null ? funding.awardNumber : ''
          },
          future: {
            source: {
              label: funding.source,
              value: funding.source.split(" ").join("_").toLowerCase()
            },
            sponsor: funding.name,
            identifier: funding.awardNumber !== null ? funding.awardNumber : ''
          }
        });
      });
    }
    return fundingsArray;
  }

  isEmpty(value) {
    if (typeof value === 'object') {
      return !Object.keys(value).length
    } else {
      return value === '' || value === null || value === undefined;
    }
  }

  approveRevision = () => {
    this.setState({ disableApproveButton: true })
    const data = { projectReviewApproved: 'true' }
    Project.addExtraProperties(this.props.addExtraPropUrl, this.props.projectKey, data).then(
      () => this.setState(prev => {
        prev.formData.projectExtraProps.projectReviewApproved = 'true';
        prev.showApproveInfoDialog = !this.state.showApproveInfoDialog;
        return prev;
      })
    );
    if (this.state.reviewSuggestion) {
      let project = this.getProject();
      Project.updateProject(this.props.updateProjectUrl, project, this.props.projectKey).then(
        resp => {
          this.removeEdits();
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  rejectProject() {
    spinnerService.showAll();
    Project.rejectProject(this.props.rejectProjectUrl, this.props.projectKey).then(resp => {
      this.setState(prev => {
        prev.showRejectProjectDialog = !this.state.showRejectProjectDialog;
        return prev;
      });
      window.location.href = [this.props.serverURL, "index"].join("/");
      spinnerService.hideAll();
    })
      .catch(error => {
        spinnerService.hideAll();
        console.error(error);
      });
  }

  discardEdits() {
    spinnerService.showAll();
    this.removeEdits();
    this.setState(prev => {
      prev.showDiscardEditsDialog = !this.state.showDiscardEditsDialog;
      return prev;
    });
  }

  approveEdits = () => {
    spinnerService.showAll();
    let project = this.getProject();
    Project.updateProject(this.props.updateProjectUrl, project, this.props.projectKey).then(
      resp => {
        this.removeEdits();
        this.setState(prev => {
          prev.showApproveDialog = !this.state.showApproveDialog;
          return prev;
        });
      })
      .catch(error => {
        spinnerService.hideAll();
        console.error(error);
      });
  }

  removeEdits() {
    Review.deleteSuggestions(this.props.discardReviewUrl, this.props.projectKey).then(
      resp => {
        this.init();
        spinnerService.hideAll();
      })
      .catch(error => {
        spinnerService.hideAll();
        console.error(error);
      });
  }

  getProject() {
    let project = {};
    project.description = this.state.formData.description;
    project.summary = this.state.formData.projectExtraProps.projectTitle;
    project.fundings = this.getFundings(this.state.formData.fundings);
    project.subjectProtection = this.state.formData.projectExtraProps.subjectProtection;
    project.projectReviewApproved = this.state.formData.projectExtraProps.projectReviewApproved;
    project.protocol = this.state.formData.projectExtraProps.protocol;
    project.feeForService = this.state.formData.projectExtraProps.feeForService;
    project.projectTitle = this.state.formData.projectExtraProps.projectTitle;
    project.projectAvailability = this.state.formData.projectExtraProps.projectAvailability;
    project.editDescription = this.state.formData.projectExtraProps.editDescription;
    project.describeEditType = this.state.formData.projectExtraProps.describeEditType;

    let collaborators = this.state.formData.collaborators;
    let pmList = [];
    if (this.state.formData.pmList !== null && this.state.formData.pmList.length > 0) {
      this.state.formData.pmList.map((pm, idx) => {
        pmList.push(pm.key);
      });
      project.pm = pmList;
    } 

    if (this.state.formData.piList !== null && this.state.formData.piList.length > 0) {
      let piList = [];
      this.state.formData.piList.map((pi, idx) => {
        piList.push(pi.key);
      });
      project.pi = piList;
    }

    if (collaborators !== null && collaborators.length > 0) {
      let collaboratorList = [];
      collaborators.map((collaborator, idx) => {
        collaboratorList.push(collaborator.key);
      });
      project.collaborator = collaboratorList;
    }
    return project;
  }

  getFundings(fundings) {
    let fundingList = [];
    if (fundings !== null && fundings.length > 0) {
      fundings.map((f, idx) => {
        let funding = {};
        if (!this.isEmpty(f.future.source.label)) {
          funding.source = f.future.source.label;
          funding.award = f.future.identifier;
          funding.name = f.future.sponsor;
          fundingList.push(funding);
        }
      });
    }
    return fundingList;
  }

  compareObj(obj1, obj2) {
    let form1 = JSON.parse(JSON.stringify(this.state[obj1]));
    let form2 = JSON.parse(JSON.stringify(this.state[obj2]));
    form1.fundings = this.sortFundingsBySource(get(form1, 'fundings', ''));
    form2.fundings = this.sortFundingsBySource(get(form2, 'fundings', ''));
    return JSON.stringify(form1) === JSON.stringify(form2);
  }

  sortFundingsBySource = (fundings) => {
    if (!this.isEmpty(fundings)) {
      return fundings.sort(function (a, b) {
        let x = a.future.source.label;
        let y = b.future.source.label;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    }
    return fundings;
  };

  enableEdit = (e) => () => {
    this.getReviewSuggestions();
    this.setState({
      readOnly: false
    });
  }

  cancelEdit = (e) => () => {
    this.init();
    this.setState({
      formData: this.state.futureCopy,
      current: this.state.futureCopy,
      readOnly: true
    });
  };

  submitEdit = (e) => () => {
    if (this.isValid()) {
      this.setState({
        readOnly: true,
        errorSubmit: false
      });
      const data = {
        projectKey: this.props.projectKey,
        suggestions: JSON.stringify(this.state.formData)
      };
      if (this.state.reviewSuggestion) {
        Review.updateReview(this.props.serverURL, this.props.projectKey, data).then(() =>
          this.getReviewSuggestions()
        );
      } else {
        Review.submitReview(this.props.serverURL, data).then(() =>
          this.getReviewSuggestions()
        );
      }
    } else {
      this.setState({
        errorSubmit: true
      });
    }
  };

  loadUsersOptions = (query, callback) => {
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

  handleUpdateFundings = (updated) => {
    this.setState(prev => {
      prev.formData.fundings = updated;
      prev.fundingError = false;
      return prev;
    });
  };

  handleProjectCollaboratorChange = (data, action) => {
    this.setState(prev => {
      prev.formData.collaborators = data;
      return prev;
    });
  };

  handlePIChange = (data, action) => {
    this.setState(prev => {
      if(data !== null) {
        prev.formData.piList = [data];
        prev.formData.projectExtraProps.pi = data.key;
      } else {
        prev.formData.piList = [];
      }  
      return prev;
    });
  };

  handleProjectManagerChange = (data, action) => {
    this.setState(prev => {
      if(data !== null) {
        prev.formData.pmList = [data];
        prev.formData.projectExtraProps.pm = data.key;
      } else {
        prev.formData.pmList = [];
      }
      return prev;
    });
  };

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    },
      () => {
        if (this.state.errorSubmit == true) this.isValid()
      });
  };

  handleProjectExtraPropsChangeRadio = (e, field, value) => {
    if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    }

    this.setState(prev => {
      prev.formData.projectExtraProps[field] = value;
      return prev;
    },
      () => {
        if (this.state.errorSubmit == true) this.isValid()
      });
  };

  handleProjectExtraPropsChange = (e) => {
    const field = e.currentTarget.name;
    const value = e.currentTarget.value;
    this.setState(prev => {
      prev.formData.projectExtraProps[field] = value;
      return prev;
    },
      () => {
        if (this.state.errorSubmit == true) this.isValid()
      });
  };

  closeModal = () => {
    this.setState({
      showRejectProjectDialog: !this.state.showRejectProjectDialog
    });
  };

  closeEditsModal = () => {
    this.setState({
      showDiscardEditsDialog: !this.state.showDiscardEditsDialog
    });
  };

  handleApproveDialog = () => {
      this.setState({
        showApproveDialog: !this.state.showApproveDialog,
        editedForm: {},
        errorSubmit: false
      });
    }
  };

  handleApproveInfoDialog = () => {
    if (this.isValid()) {
      this.setState({
        showApproveInfoDialog: !this.state.showApproveInfoDialog,
        errorSubmit: false
      });
    }
    else {
      this.setState({
        errorSubmit: true
      });
    }
  };

  handleDiscardEditsDialog = () => {
    this.setState({
      showDiscardEditsDialog: !this.state.showDiscardEditsDialog
    });
  };

  handleRejectProjectDialog = () => {
    this.setState({
      showRejectProjectDialog: !this.state.showRejectProjectDialog
    });
  };

  isValid() {
    let descriptionError = false;
    let projectTitleError = false;
    let subjectProtectionError = false;
    let editTypeError = false;
    let editDescriptionError = false;
    let fundingErrorIndex = [];
    let generalError = false;

    // Todo: Fundings error will be handled inside its component
    let fundingError = this.state.formData.fundings.filter((obj, idx) => {
      if (this.isEmpty(obj.future.source.label) && ( !this.isEmpty(obj.future.sponsor) || !this.isEmpty(obj.future.identifier) )
        || ( idx === 0 && this.isEmpty(obj.future.source.label) && this.isEmpty(obj.current.source.label) )) {
        fundingErrorIndex.push(idx);
        return true
      } else {
        return false;
      }
    }).length > 0;
    if(fundingError) generalError = true;
    if (this.state.projectType === "IRB Project" && this.isEmpty(this.state.formData.projectExtraProps.editDescription)) {
      editDescriptionError = true;
      generalError = true;
    }
    if (this.state.projectType === "IRB Project" && this.isEmpty(this.state.formData.projectExtraProps.describeEditType)) {
      editTypeError = true;
      generalError = true;
    }
    if (this.isEmpty(this.state.formData.description)) {
      descriptionError = true;
      generalError = true;
    }
    if (this.isEmpty(this.state.formData.projectExtraProps.projectTitle)) {
      projectTitleError = true;
      generalError = true;
    }
    if (this.isEmpty(this.state.formData.projectExtraProps.subjectProtection)) {
      subjectProtectionError = false;
      generalError = true;
    }
    this.setState(prev => {
      prev.descriptionError = descriptionError;
      prev.projectTitleError = projectTitleError;
      prev.subjectProtectionError = subjectProtectionError;
      prev.editDescriptionError = editDescriptionError;
      prev.editTypeError = editTypeError;
      prev.fundingError = fundingError;
      prev.fundingErrorIndex = fundingErrorIndex;
      prev.generalError = generalError;
      return prev;
    });
    return !subjectProtectionError && !projectTitleError && !descriptionError && !editTypeError && !editDescriptionError && !fundingError;
  }

  changeFundingError = () => {
    this.setState(prev => {
      prev.fundingError = !prev.fundingError;
      return prev;
    })
  };

  render() {
    const { projectReviewApproved = 'false' } = this.state.formData.projectExtraProps;
    return (
      div({}, [
        h2({ className: "stepTitle" }, ["Project Information"]),
        ConfirmationDialog({
          closeModal: this.closeModal,
          show: this.state.showRejectProjectDialog,
          handleOkAction: this.rejectProject,
          title: 'Remove Project Confirmation',
          bodyText: 'Are you sure you want to remove this project?',
          actionLabel: 'Yes'
        }, []),
        ConfirmationDialog({
          closeModal: this.closeEditsModal,
          show: this.state.showDiscardEditsDialog,
          handleOkAction: this.discardEdits,
          title: 'Discard Edits Confirmation',
          bodyText: 'Are you sure you want to remove these edits?',
          actionLabel: 'Yes'
        }, []),
        ConfirmationDialog({
          closeModal: this.handleApproveDialog,
          show: this.state.showApproveDialog,
          handleOkAction: this.approveEdits,
          title: 'Approve Edits Confirmation',
          bodyText: 'Are you sure you want to approve these edits?',
          actionLabel: 'Yes'
        }, []),
        ConfirmationDialog({
          closeModal: this.handleApproveInfoDialog,
          show: this.state.showApproveInfoDialog,
          handleOkAction: this.approveRevision,
          title: 'Approve Project Information',
          bodyText: 'Are you sure you want to approve Project Information?',
          actionLabel: 'Yes'
        }, []),
        button({
          className: "btn buttonPrimary floatRight",
          style: { 'marginTop': '15px' },
          onClick: this.enableEdit(),
          isRendered: this.state.readOnly === true
        }, ["Edit Information"]),

        button({
          className: "btn buttonSecondary floatRight",
          style: { 'marginTop': '15px' },
          onClick: this.cancelEdit(),
          isRendered: this.state.readOnly === false
        }, ["Cancel"]),

        Panel({ title: "Requestor" }, [
          InputFieldText({
            id: "inputRequestorName",
            name: "requestorName",
            label: "Requestor Name",
            value: this.state.formData.requestor.displayName,
            currentValue: this.state.current.requestor.displayName,
            readOnly: true,
            required: true,
            onChange: () => { }
          }),
          InputFieldText({
            id: "inputRequestorEmail",
            name: "requestorEmail",
            label: "Requestor Email Address",
            value: this.state.formData.requestor.emailAddress,
            currentValue: this.state.current.requestor.emailAddress,
            readOnly: true,
            required: true,
            onChange: () => { }
          })
        ]),

        Panel({ title: "Principal Investigator" }, [
          MultiSelect({
            id: "pi_select",
            label: "Broad PI",
            name: 'piList',
            readOnly: this.state.readOnly,
            loadOptions: this.loadUsersOptions,
            handleChange: this.handlePIChange,
            value: this.state.formData.piList,
            currentValue: this.state.current.piList,
            isMulti: false
          }),

          MultiSelect({
            id: "inputProjectManager",
            label: "Broad Project Manager",
            name: 'pmList',
            readOnly: this.state.readOnly,
            loadOptions: this.loadUsersOptions,
            handleChange: this.handleProjectManagerChange,
            value: this.state.formData.pmList,
            currentValue: this.state.current.pmList,
            isMulti: false
          })
        ]),
        Panel({ title: "Funding" }, [
          Fundings({
            fundings: this.state.formData.fundings,
            current: this.state.formData.fundings,
            updateFundings: this.handleUpdateFundings,
            readOnly: this.state.readOnly,
            error: this.state.fundingError,
            errorIndex: this.state.fundingErrorIndex,
            setError: this.changeFundingError,
            errorMessage: "Required field",
            edit: true
          })
        ]),

        Panel({ title: "Project Summary" }, [
          InputFieldTextArea({
            id: "inputStudyActivitiesDescription",
            name: "description",
            label: "Broad study activities",
            value: this.state.formData.description,
            currentValue: this.state.current.description,
            readOnly: this.state.readOnly,
            readonly: true,
            required: true,
            onChange: this.handleInputChange,
            error: this.state.descriptionError,
            errorMessage: "Required field"
          }),

          MultiSelect({
            id: "collaborator_select",
            label: "Individuals who require access to this project record",
            isDisabled: false,
            readOnly: this.state.readOnly,
            loadOptions: this.loadUsersOptions,
            handleChange: this.handleProjectCollaboratorChange,
            value: this.state.formData.collaborators,
            currentValue: this.state.current.collaborators,
            placeholder: "Start typing collaborator names",
            isMulti: true
          }),

          InputFieldText({
            id: "inputPTitle",
            name: "projectTitle",
            label: "Title of project/protocol",
            value: this.state.formData.projectExtraProps.projectTitle,
            currentValue: this.state.current.projectExtraProps.projectTitle,
            readOnly: this.state.readOnly,
            required: false,
            onChange: this.handleProjectExtraPropsChange,
            error: this.state.projectTitleError,
            errorMessage: "Required field",
            edit: true
          }),
          InputFieldText({
            id: "inputIrbProtocolId",
            name: "protocol",
            label: "Protocol # at Broad IRB-of-record ",
            value: this.state.formData.projectExtraProps.protocol,
            currentValue: this.state.current.projectExtraProps.protocol,
            readOnly: this.state.readOnly,
            required: false,
            onChange: this.handleProjectExtraPropsChange,
            valueEdited: this.isEmpty(this.state.current.projectExtraProps.protocol) === !this.isEmpty(this.state.formData.projectExtraProps.protocol),
            edit: true
          }),
          InputYesNo({
            id: "radioSubjectProtection",
            name: "subjectProtection",
            label: "Is the Broad Institute's Office of Research Subject Protection administratively managing this project, ",
            moreInfo: "i.e. responsible for oversight and submissions?",
            value: this.state.formData.projectExtraProps.subjectProtection,
            currentValue: this.state.current.projectExtraProps.subjectProtection,
            onChange: this.handleProjectExtraPropsChangeRadio,
            required: false,
            readOnly: this.state.readOnly,
            error: false,
            errorMessage: "Required field"
          }),

          /*IMPORTANT: These questions will appear on Edit mode, once project has been approved*/

          InputFieldRadio({
            isRendered: false,
            id: "radioProjectAvailability",
            name: "projectAvailability",
            label: "Project Availability",
            value: this.state.formData.projectExtraProps.projectAvailability,
            currentValue: this.state.current.projectExtraProps.projectAvailability,
            optionValues: ["available", "onHold"],
            optionLabels: [
              "Available",
              "On Hold"
            ],
            onChange: this.handleProjectExtraPropsChangeRadio,
            readOnly: this.state.readOnly
          })
        ]),

        Panel({ title: "Notes to ORSP", isRendered: this.state.readOnly === false ||  (this.state.formData.projectExtraProps.editDescription !== null && this.state.formData.projectExtraProps.editDescription !== undefined)}, [
          div({ isRendered: this.projectType === "IRB Project" }, [
            InputFieldRadio({
              id: "radioDescribeEdits",
              name: "describeEditType",
              currentValue: this.state.current.projectExtraProps.describeEditType,
              label: "Please choose one of the following to describe the proposed edits: ",
              value: this.state.formData.projectExtraProps.describeEditType,
              optionValues: ["newAmendment", "requestingAssistance"],
              optionLabels: [
                "I am informing Broad's ORSP of a new amendment I already submitted to my IRB of record",
                "I am requesting assistance in updating and existing project"
              ],
              onChange: this.handleProjectExtraPropsChangeRadio,
              readOnly: this.state.readOnly,
              required: true,
              error: this.state.editTypeError,
              errorMessage: "Required field"
            })
          ]),
          InputFieldTextArea({
            id: "inputDescribeEdits",
            name: "editDescription",
            label: "Please use the space below to describe any additional edits or clarifications to the edits above",
            currentValue: this.state.current.projectExtraProps.editDescription,
            value: this.state.formData.projectExtraProps.editDescription,
            readOnly: this.state.readOnly,
            required: true,
            onChange: this.handleProjectExtraPropsChange,
            error: this.state.editDescriptionError,
            errorMessage: "Required field"
          })
        ]),
        /*UNTIL HERE*/

        Panel({ title: "Determination Questions" }, [
          div({ isRendered: this.state.readOnly === false }, [
            AlertMessage({
              type: 'info',
              msg: "If changes need to be made to any of these questions, please submit a new project request",
              show: true
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.projectExtraProps.feeForService), className: "firstRadioGroup" }, [
            InputYesNo({
              id: "radioPII",
              name: "radioPII",
              label: 'Is this a "fee-for-service" project? ',
              moreInfo: '(commercial service only, no Broad publication privileges)',
              value: this.state.formData.projectExtraProps.feeForService,
              currentValue: this.state.current.projectExtraProps.feeForService,
              readOnly: true,
              onChange: () => { }
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.projectExtraProps.broadInvestigator) }, [
            InputYesNo({
              id: "broadInvestigator",
              name: "broadInvestigator",
              value: this.state.formData.projectExtraProps.broadInvestigator,
              currentValue: this.state.current.projectExtraProps.broadInvestigator,
              moreInfo: '(generating, contributing to generalizable knowledge)? Examples include case studies, internal technology development projects.',
              label: 'Is a Broad investigator conducting research ',
              readOnly: true,
              onChange: () => { }
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.projectExtraProps.subjectsDeceased) }, [
            InputYesNo({
              id: "subjectsDeceased",
              name: "subjectsDeceased",
              value: this.state.formData.projectExtraProps.subjectsDeceased,
              currentValue: this.state.current.projectExtraProps.subjectsDeceased,
              label: 'Are all subjects who provided samples and/or data now deceased?',
              readOnly: true,
              onChange: () => { }
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.projectExtraProps.sensitiveInformationSource) }, [
            InputYesNo({
              id: "sensitiveInformationSource",
              name: "sensitiveInformationSource",
              value: this.state.formData.projectExtraProps.sensitiveInformationSource,
              currentValue: this.state.current.projectExtraProps.sensitiveInformationSource,
              moreInfo: '(Coded data are considered identifiable if researcher has access to key)',
              label: 'Is Broad investigator/staff a) obtaining information or biospecimens through an interaction with living human subjects or, b) obtaining/analyzing/generating identifiable private information or identifiable biospecimens ',
              readOnly: true,
              onChange: () => { }
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.projectExtraProps.interactionSource) }, [
            InputYesNo({
              id: "interactionSource",
              name: "interactionSource",
              value: this.state.formData.projectExtraProps.interactionSource,
              currentValue: this.state.current.projectExtraProps.interactionSource,
              moreInfo: '(i.e. is conductin HSR)?',
              label: 'Are samples/data being provied by an investigator who has identifiers or obtains samples through and interaction ',
              readOnly: true,
              onChange: () => { }
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.projectExtraProps.isIdReceive) }, [
            InputYesNo({
              id: "isIdReceive",
              name: "isIdReceive",
              value: this.state.formData.projectExtraProps.isIdReceive,
              currentValue: this.state.current.projectExtraProps.isIdReceive,
              label: 'Is the Broad receiving subject identifiers?',
              readOnly: true,
              onChange: () => { }
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.projectExtraProps.isCoPublishing) }, [
            InputYesNo({
              id: "isCoPublishing",
              name: 'isCoPublishing',
              value: this.state.formData.projectExtraProps.isCoPublishing,
              currentValue: this.state.current.projectExtraProps.isCoPublishing,
              label: 'Is the Broad researcher co-publishing or doing joint analysis with investigator who has access to identifiers?',
              readOnly: true,
              onChange: () => { }
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.projectExtraProps.federalFunding) }, [
            InputYesNo({
              id: "federalFunding",
              name: 'federalFunding',
              value: this.state.formData.projectExtraProps.federalFunding,
              currentValue: this.state.current.projectExtraProps.federalFunding,
              label: 'Is Broad receiving direct federal funding?',
              readOnly: true,
              onChange: () => { }
            })
          ])
        ]),
        AlertMessage({
          msg: 'Please complete all required fields',
          show: this.state.generalError
        }),
        div({ className: "buttonContainer", style: { 'margin': '20px 0 40px 0' } }, [
          button({
            className: "btn buttonPrimary floatLeft",
            onClick: this.enableEdit(),
            isRendered: this.state.readOnly === true
          }, ["Edit Information"]),

          button({
            className: "btn buttonSecondary",
            onClick: this.cancelEdit(),
            isRendered: this.state.readOnly === false
          }, ["Cancel"]),

          /*visible for every user in edit mode and disabled until some edit has been made*/
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.submitEdit(),
            disabled: this.isEmpty(this.state.editedForm) ?
                      !this.compareObj("formData", "editedForm") && this.compareObj("formData", "current")
                      : this.compareObj("formData", "editedForm"),
            isRendered: this.state.readOnly === false
          }, ["Submit Edits"]),

          /*visible for Admin in readOnly mode and if the project is in "pending" status*/
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.handleApproveInfoDialog,
            disabled: this.state.disableApproveButton,
            isRendered: this.isAdmin() && projectReviewApproved === 'false' && this.state.readOnly === true
          }, ["Approve"]),

          /*visible for Admin in readOnly mode and if there are changes to review*/
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.handleApproveDialog,
            isRendered: this.isAdmin() && this.state.reviewSuggestion && this.state.readOnly === true && projectReviewApproved === 'true'
          }, ["Approve Edits"]),

          /*visible for Admin in readOnly mode and if the project is in "pending" status*/
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.handleRejectProjectDialog,
            isRendered: this.isAdmin() && projectReviewApproved === 'false' && this.state.readOnly === true
          }, ["Reject"]),

          /*visible for every user in readOnly mode and if there are changes to review*/
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.handleDiscardEditsDialog,
            isRendered: this.isAdmin() && this.state.reviewSuggestion && this.state.readOnly === true
          }, ["Discard Edits"])
        ])
      ])
    )
  }
}

export default ProjectReview;