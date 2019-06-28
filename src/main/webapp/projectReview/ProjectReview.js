import { Component } from 'react';
import { h, hh, p, div, h2, button } from 'react-hyperscript-helpers';
import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { MultiSelect } from '../components/MultiSelect';
import { Fundings } from '../components/Fundings';
import { AlertMessage } from '../components/AlertMessage';
import { RequestClarificationDialog } from "../components/RequestClarificationDialog";
import { InputYesNo } from '../components/InputYesNo';
import { InputFieldTextArea } from '../components/InputFieldTextArea';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { InputFieldCheckbox } from '../components/InputFieldCheckbox';
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { spinnerService } from "../util/spinner-service";
import { Project, Search, Review, User } from "../util/ajax";
import { Spinner } from "../components/Spinner";
import get from 'lodash/get';
import { isEmpty } from '../util/Utils';
import { InputFieldSelect } from "../components/InputFieldSelect";
import { PREFERRED_IRB } from "../util/TypeDescription";
import { PI_AFFILIATION } from "../util/TypeDescription";

const TEXT_SHARING_TYPES = ['open', 'controlled', 'both'];

export const ProjectReview = hh(class ProjectReview extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isAdmin: false,
      generalError: false,
      errorSubmit: false,
      descriptionError: false,
      projectTitleError: false,
      editTypeError: false,
      editDescriptionError: false,
      fundingError: false,
      fundingErrorIndex: [],
      internationalCohortsError: false,
      fundingAwardNumberError: false,
      showDialog: false,
      approveInfoDialog: false,
      discardEditsDialog: false,
      approveDialog: false,
      rejectProjectDialog: false,
      requestClarification: false,
      readOnly: true,
      editedForm: {},
      alertType: '',
      alertMessage: '',
      showAlert: false,
      showSubmissionAlert: false,
      showSuccessClarification: false,
      formData: {
        approvalStatus: '',
        description: '',
        projectType: '',
        piList: [{ key: '', label: '', value: '' }],
        pmList: [{ key: '', label: '', value: '' }],
        collaborators: [{ key: '', label: '', value: '' }],
        projectExtraProps: {
          irb: '',
          affiliations: '',
          affiliationOther: '',
          accurate: '',
          feeForServiceWork: '',
          projectTitle: '',
          protocol: '',
          projectAvailability: null,
          attestation: '',
          describeEditType: null,
          editDescription: null,
          sharingType: false,
          compliance: false,
          pii: false,
          textSharingType: '',
          textCompliance: '',
          isIdReceive: false,
          projectReviewApproved: false
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
        approvalStatus: '',
        requestor: {
          displayName: '',
          emailAddress: ''
        },
        requestorName: component.user !== undefined ? component.user.displayName : '',
        reporter: component.user !== undefined ? component.user.userName : '',
        requestorEmail: component.user !== undefined ? component.user.email.replace("&#64;", "@") : '',
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
          irb: '',
          affiliations: '',
          affiliationOther: '',
          accurate: '',
          feeForServiceWork: '',
          irbProtocolId: '',
          projectTitle: '',
          protocol: '',
          projectAvailability: null,
          attestation: '',
          describeEditType: null,
          editDescription: null,
          sharingType: false,
          compliance: false,
          pii: false,
          textSharingType: '',
          textCompliance: '',
          isIdReceive: false,
          projectReviewApproved: false
        },
      },
      determination: {
        projectType: null,
        questions: [],
        requiredError: false,
        currentQuestionIndex: 0,
        nextQuestionIndex: 1,
        endState: false
      }
    };
    this.rejectProject = this.rejectProject.bind(this);
    this.approveEdits = this.approveEdits.bind(this);
    this.removeEdits = this.removeEdits.bind(this);
    this.discardEdits = this.discardEdits.bind(this);
  }

  componentDidMount() {
    spinnerService.showAll();
    this.init();
  }

  init() {
    let current = {};
    let currentStr = {};
    let future = {};
    let futureCopy = {};
    let formData = {};
    Project.getProject(component.projectUrl, component.projectKey).then(
      issue => {
        // store current issue info here ....
        this.props.initStatusBoxInfo(issue.data);
        current.approvalStatus = issue.data.issue.approvalStatus;
        current.description = isEmpty(issue.data.issue.description) ? '' : issue.data.issue.description.replace(/<\/?[^>]+(>|$)/g, "");
        current.affiliationOther = issue.data.issue.affiliationOther;
        current.projectExtraProps = issue.data.extraProperties;
        current.projectExtraProps.irb = isEmpty(current.projectExtraProps.irb) ? '' : JSON.parse(current.projectExtraProps.irb),
        current.projectExtraProps.affiliations = isEmpty(current.projectExtraProps.affiliations) ? '' : JSON.parse(current.projectExtraProps.affiliations),
        current.piList = this.getUsersArray(issue.data.pis);
        current.pmList = this.getUsersArray(issue.data.pms);
        current.collaborators = this.getUsersArray(issue.data.collaborators);
        current.fundings = this.getFundingsArray(issue.data.fundings);
        current.requestor = issue.data.requestor !== null ? issue.data.requestor : this.state.requestor;
        currentStr = JSON.stringify(current);
        future = JSON.parse((currentStr));
        futureCopy = JSON.parse(currentStr);
        this.projectType = issue.data.issue.type;

        Review.getSuggestions(component.serverURL, component.projectKey).then(
          data => {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('new') && urlParams.get('tab') === 'review') {
              // next line should be temporary, its function is to remove the 'new' flag from the url
              history.pushState({}, null, window.location.href.split('&')[0]);
              this.successNotification('showSubmissionAlert', 'Your Project was successfully submitted to the Broad Institute’s Office of Research Subject Protection. It will now be reviewed by the ORSP team who will reach out to you if they have any questions.', 8000);
            }
            if (data.data !== '') {
              formData = JSON.parse(data.data.suggestions);
              spinnerService.hideAll();
              this.setState(prev => {
                prev.formData = formData;
                prev.current = current;
                prev.future = future;
                prev.futureCopy = futureCopy;
                prev.editedForm = JSON.parse(data.data.suggestions);
                prev.reviewSuggestion = true;
                prev.isAdmin = component.isAdmin;
                return prev;
              });
              this.changePendingStatus(false);
            } else {
              spinnerService.hideAll();
              formData = JSON.parse(currentStr);
              this.setState(prev => {
                prev.formData = formData;
                prev.current = current;
                prev.future = future;
                prev.futureCopy = futureCopy;
                prev.reviewSuggestion = false;
                prev.isAdmin = component.isAdmin;
                return prev;
              });
              this.changePendingStatus(issue.data.extraProperties.projectReviewApproved);
            }
          });
      }).catch(error => {
        spinnerService.hideAll();
        this.setState(() => { throw error; });
      });
  }

  changePendingStatus = (status) => {
    this.props.changeInfoStatus(status);
  };

  getReviewSuggestions() {
    Review.getSuggestions(component.serverURL, component.projectKey).then(
      data => {
        if (data.data !== '') {
          this.setState(prev => {
            prev.formData = JSON.parse(data.data.suggestions);
            prev.editedForm = JSON.parse(data.data.suggestions);
            prev.reviewSuggestion = true;
            return prev;
          });
          this.changePendingStatus(false);
        } else {
          this.setState(prev => {
            prev.editedForm = {};
            prev.reviewSuggestion = false;
            return prev;
          });
          this.changePendingStatus(true);
        }
      }).catch(error => {
        this.setState(() => { throw error; });
      });
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
    return usersArray;
  }

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

  approveRevision = () => {
    this.setState({
      disableApproveButton: true,
      approveInfoDialog: false
    });
    const data = { projectReviewApproved: true };
    Project.addExtraProperties(component.serverURL, component.projectKey, data).then(
      () => {
        this.toggleState('approveInfoDialog');
        this.setState(prev => {
          prev.formData.projectExtraProps.projectReviewApproved = true;
          return prev;
        }, () => this.props.updateDetailsStatus(this.getProject()))
      }
    ).catch(error => {
      this.setState(() => { throw error; });
    });
    if (this.state.reviewSuggestion) {
      let project = this.getProject();
      Project.updateProject(component.updateProjectUrl, project, component.projectKey).then(
        resp => {
          this.removeEdits('approve');
        })
        .catch(error => {
          this.setState(() => { throw error; });
        });
    }
  };

  rejectProject() {
    spinnerService.showAll();
    Project.rejectProject(component.rejectProjectUrl, component.projectKey).then(resp => {
      this.setState(prev => {
        prev.rejectProjectDialog = !this.state.rejectProjectDialog;
        return prev;
      });
      window.location.href = [component.serverURL, "index"].join("/");
      spinnerService.hideAll();
    }).catch(error => {
      spinnerService.hideAll();
      this.setState(() => { throw error; });
    });
  }

  discardEdits() {
    spinnerService.showAll();
    this.setState({ discardEditsDialog: false });
    this.removeEdits('reject');
  }

  approveEdits = () => {
    spinnerService.showAll();
    let project = this.getProject();
    project.editsApproved = true;
    Project.updateProject(component.updateProjectUrl, project, component.projectKey).then(
      resp => {
        this.removeEdits('approve');
        this.setState((state, props) => {
          return { approveDialog: !state.approveDialog }
        });
      }).catch(error => {
        spinnerService.hideAll();
        this.setState(() => { throw error; });
      });
  };

  removeEdits(type) {
    Review.deleteSuggestions(component.discardReviewUrl, component.projectKey, type).then(
      resp => {
        this.props.updateContent();
        this.init();
        spinnerService.hideAll();
      })
      .catch(error => {
        spinnerService.hideAll();
        this.setState(() => { throw error; });
      });
  }

  getProject() {
    let project = {};
    project.description = this.state.formData.description;
    project.summary = this.state.formData.projectExtraProps.projectTitle;
    project.fundings = this.getFundings(this.state.formData.fundings);
    project.attestation = this.state.formData.projectExtraProps.attestation;
    project.projectReviewApproved = this.state.formData.projectExtraProps.projectReviewApproved;
    project.protocol = this.state.formData.projectExtraProps.protocol;
    project.feeForService = this.state.formData.projectExtraProps.feeForService;
    project.feeForServiceWork = this.state.formData.projectExtraProps.feeForServiceWork;
    project.projectTitle = this.state.formData.projectExtraProps.projectTitle;
    project.projectAvailability = this.state.formData.projectExtraProps.projectAvailability;
    project.editDescription = this.state.formData.projectExtraProps.editDescription;
    project.describeEditType = this.state.formData.projectExtraProps.describeEditType;
    project.sharingType = this.state.formData.projectExtraProps.sharingType;
    project.compliance = this.state.formData.projectExtraProps.compliance;
    project.pii = this.state.formData.projectExtraProps.pii;
    project.affiliations = isEmpty(this.state.formData.projectExtraProps.affiliations.value) ? null : JSON.stringify(this.state.formData.projectExtraProps.affiliations);
    project.affiliationOther = this.state.formData.projectExtraProps.affiliationOther;
    project.irb = isEmpty(this.state.formData.projectExtraProps.irb.value) ? null : JSON.stringify(this.state.formData.projectExtraProps.irb);

    if (this.state.reviewSuggestion) {
      project.editsApproved = true;
    }
    if (TEXT_SHARING_TYPES.some((type) => type === project.sharingType)) {
      project.textSharingType = this.state.formData.projectExtraProps.textSharingType;
    } else {
      project.textSharingType = "";
    }
    if (project.compliance === 'true') {
      project.textCompliance = this.state.formData.projectExtraProps.textCompliance;
    } else {
      project.textCompliance = "";
    }

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
        if (!isEmpty(f.future.source.label)) {
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
    if (!isEmpty(fundings)) {
      return fundings.sort(function (a, b) {
        let x = a.source !== undefined ? a.source.label : '';
        let y = b.source !== undefined ? b.source.label : '';
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    }
    return fundings;
  };

  enableEdit = (e) => () => {
    this.getReviewSuggestions();
    this.setState(prev => {
      prev.readOnly = false;
      return prev
    });
  };

  cancelEdit = (e) => () => {
    this.init();
    this.setState(prev => {
      prev.formData = this.state.futureCopy;
      prev.current = this.state.futureCopy;
      prev.errorSubmit = false;
      prev.showAlert = false;
      prev.readOnly = true;
      return prev;
    });
  };

  submitEdit = () => () => {
    if (this.isValid()) {
      this.setState(prev => {
        prev.readOnly = true;
        prev.errorSubmit = false;
        return prev;
      });
      let suggestions = this.state.formData;
      User.getUserSession(component.getUserUrl).then(
        resp => {
          suggestions.editCreator = resp.data.userName;
          const data = {
            projectKey: component.projectKey,
            suggestions: JSON.stringify(suggestions)
          };

          if (this.state.reviewSuggestion) {
            Review.updateReview(component.serverURL, component.projectKey, data).then(() =>
              this.getReviewSuggestions()
            ).catch(error => {
              this.getReviewSuggestions();
              this.setState(prev => {
                prev.errorSubmit = true;
                prev.alertMessage = "Something went wrong. Please try again later.";
                return prev;
              });
            });
          } else {
            Review.submitReview(component.serverURL, data).then(() =>
              this.getReviewSuggestions()
            ).catch(error => {
              this.getReviewSuggestions();
              this.setState(prev => {
                prev.errorSubmit = true;
                prev.alertMessage = "Something went wrong. Please try again later.";
                return prev;
              });
            });
          }
      }).catch( error => {
        this.setState(this.setState(() => { throw error; }));
      });
    } else {
      this.setState({
        errorSubmit: true
      });
    }
  };

  loadUsersOptions = (query, callback) => {
    if (query.length > 2) {
      Search.getMatchingQuery(component.searchUsersURL, query)
        .then(response => {
          let options = response.data.map(function (item) {
            return {
              key: item.id,
              value: item.value,
              label: item.label
            };
          });
          callback(options);
        }).catch(error => {
          this.setState(() => { throw error; });
        });
    }
  };

  handleUpdateFundings = (updated) => {
    this.setState(prev => {
      prev.formData.fundings = updated;
      prev.fundingAwardNumberError = false;
      prev.generalError = false;
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
      if (data !== null) {
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
      if (data !== null) {
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
    this.setState(prev => {
      prev.formData.projectExtraProps[field] = value;
      return prev;
    },
      () => {
        if (this.state.errorSubmit === true) this.isValid()
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
        if (this.state.errorSubmit === true) this.isValid()
      });
  };

  handleApproveDialog = () => {
    this.setState((state, props) => {
      return {
        approveDialog: !state.approveDialog,
        editedForm: {},
        errorSubmit: false
      }
    });
  };

  handleApproveInfoDialog = () => {
    this.setState((state, props) => {
      return {
        approveInfoDialog: !state.approveInfoDialog,
        errorSubmit: false
      }
    });
  };

  handleSelect = (field) => () => (selectedOption) => {
    this.setState(prev => {
      prev.formData.projectExtraProps[field] = selectedOption;
      return prev;
    })
  };

  toggleState = (e) => () => {
    this.setState((state, props) => {
      return { [e]: !state[e] }
    });
  };

  isValid() {
    let descriptionError = false;
    let projectTitleError = false;
    let attestationError = false;
    let editTypeError = false;
    let editDescriptionError = false;
    let fundingErrorIndex = [];
    let generalError = false;
    let questions = false;
    let fundingAwardNumber = false;
    let fundingError = this.state.formData.fundings.filter((obj, idx) => {
      if (isEmpty(obj.future.source.label) && (!isEmpty(obj.future.sponsor) || !isEmpty(obj.future.identifier))
        || (idx === 0 && isEmpty(obj.future.source.label) && isEmpty(obj.current.source.label))) {
        fundingErrorIndex.push(idx);
        return true
      } else if (obj.future.source.value === 'federal_prime' && isEmpty(obj.future.identifier)) {
        fundingAwardNumber = obj.future.source.value === 'federal_prime' && isEmpty(obj.future.identifier);
        return true;
      } else {
        return false;
      }
    }).length > 0;
    if (fundingError) generalError = true;
    if (this.state.projectType === "IRB Project" && isEmpty(this.state.formData.projectExtraProps.editDescription)) {
      editDescriptionError = true;
      generalError = true;
    }
    if (this.state.projectType === "IRB Project" && isEmpty(this.state.formData.projectExtraProps.describeEditType)) {
      editTypeError = true;
      generalError = true;
    }
    if (isEmpty(this.state.formData.description)) {
      descriptionError = true;
      generalError = true;
    }
    if (isEmpty(this.state.formData.projectExtraProps.projectTitle)) {
      projectTitleError = true;
      generalError = true;
    }
    if (isEmpty(this.state.formData.projectExtraProps.attestation)) {
      attestationError = true;
      generalError = true;
    }
    this.setState(prev => {
      prev.descriptionError = descriptionError;
      prev.projectTitleError = projectTitleError;
      prev.attestationError = attestationError;
      prev.editDescriptionError = editDescriptionError;
      prev.editTypeError = editTypeError;
      prev.fundingError = fundingError;
      prev.fundingErrorIndex = fundingErrorIndex;
      prev.generalError = generalError;
      prev.fundingAwardNumberError = fundingAwardNumber;
      return prev;
    });

    return !attestationError &&
      !projectTitleError &&
      !descriptionError &&
      !editTypeError &&
      !editDescriptionError &&
      !fundingError &&
      !questions &&
      !fundingAwardNumber;
  }

  changeFundingError = () => {
    this.setState(prev => {
      prev.fundingError = !prev.fundingError;
      return prev;
    })
  };

  successNotification = (type, message, time) => {
    setTimeout(this.clearAlertMessage(type), time, null);
    this.props.updateContent();
    this.setState(prev => {
      prev[type] = true;
      prev.alertMessage = message;
      prev.alertType = 'success';
      return prev;
    });
  };

  clearAlertMessage = (type) => () => {
    this.setState(prev => {
      prev[type] = false;
      prev.alertMessage = '';
      prev.alertType = '';
      return prev;
    });
  };

  redirectToConsentGroupTab = async () => {
    window.location.href = [component.serverURL, "project", "main?projectKey=" + component.projectKey + "&tab=consent-groups"].join("/");
  };

  handleAttestationCheck = (e) => {
    const checked = e.target.checked;
    this.setState(prev => {
      prev.formData.projectExtraProps.attestation = checked;
      return prev;
    });
  };

  removeErrorMessage = () => {
    this.setState(prev => {
      prev.generalError = false;
      return prev;
    });
  };

  render() {
    const { projectReviewApproved } = this.state.formData.projectExtraProps;
    return (
      div({}, [
        h2({ className: "stepTitle" }, ["Project Information"]),
        ConfirmationDialog({
          closeModal: this.toggleState('rejectProjectDialog'),
          show: this.state.rejectProjectDialog,
          handleOkAction: this.rejectProject,
          title: 'Remove Project Confirmation',
          bodyText: 'Are you sure you want to remove this project?',
          actionLabel: 'Yes'
        }, []),
        ConfirmationDialog({
          closeModal: this.toggleState('discardEditsDialog'),
          show: this.state.discardEditsDialog,
          handleOkAction: this.discardEdits,
          title: 'Discard Edits Confirmation',
          bodyText: 'Are you sure you want to remove these edits?',
          actionLabel: 'Yes'
        }, []),
        ConfirmationDialog({
          closeModal: this.toggleState('approveDialog'),
          show: this.state.approveDialog,
          handleOkAction: this.approveEdits,
          title: 'Approve Edits Confirmation',
          bodyText: 'Are you sure you want to approve these edits?',
          actionLabel: 'Yes'
        }, []),
        ConfirmationDialog({
          closeModal: this.handleApproveInfoDialog,
          show: this.state.approveInfoDialog,
          handleOkAction: this.approveRevision,
          title: 'Approve Project Information',
          bodyText: 'Are you sure you want to approve Project Information?',
          actionLabel: 'Yes'
        }, []),
        RequestClarificationDialog({
          closeModal: this.toggleState('requestClarification'),
          show: this.state.requestClarification,
          issueKey: component.projectKey,
          successClarification: this.successNotification,
          clarificationUrl: component.clarificationUrl
        }),

        button({
          className: "btn buttonPrimary floatRight",
          style: { 'marginTop': '15px' },
          onClick: this.enableEdit(),
          isRendered: this.state.readOnly === true && !component.isViewer
        }, ["Edit Information"]),
        button({
          className: "btn buttonSecondary floatRight",
          style: { 'marginTop': '15px' },
          onClick: this.redirectToConsentGroupTab,
          isRendered: this.state.readOnly === true && !component.isViewer
        }, ["Add Sample/Data Cohort"]),

        button({
          className: "btn buttonSecondary floatRight",
          style: { 'marginTop': '15px' },
          onClick: this.cancelEdit(),
          isRendered: this.state.readOnly === false
        }, ["Cancel"]),

        AlertMessage({
          msg: 'Your Project was successfully submitted to the Broad Institute’s Office of Research Subject Protection. It will now be reviewed by the ORSP team who will reach out to you if they have any questions.',
          show: this.state.showSubmissionAlert,
          type: 'success'
        }),

        Panel({ title: "Notes to ORSP", isRendered: this.state.readOnly === false || !isEmpty(this.state.formData.projectExtraProps.editDescription) }, [
          div({ isRendered: this.projectType === "IRB Project" }, [
            InputFieldRadio({
              id: "radioDescribeEdits",
              name: "describeEditType",
              currentValue: this.state.current.projectExtraProps.describeEditType,
              label: "Please choose one of the following to describe the proposed edits: ",
              value: this.state.formData.projectExtraProps.describeEditType,
              optionValues: ["newAmendment", "requestingAssistance", "clarificationResponse"],
              optionLabels: [
                "I am informing Broad's ORSP of a new amendment I already submitted to my IRB of record",
                "I am requesting assistance in updating and existing project",
                "I am responding to a request for clarifications from ORSP"
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
            label: "You may use this space to add additional information or clarifications related to your edits below",
            currentValue: this.state.current.projectExtraProps.editDescription,
            value: this.state.formData.projectExtraProps.editDescription === null ? undefined : this.state.formData.projectExtraProps.editDescription,
            readOnly: this.state.readOnly,
            required: true,
            onChange: this.handleProjectExtraPropsChange,
            error: this.state.editDescriptionError,
            errorMessage: "Required field"
          })
        ]),
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

          InputFieldSelect({
            label: "Primary Investigator Affiliation",
            id: "affiliations",
            name: "affiliations",
            options: PI_AFFILIATION,
            value: this.state.formData.projectExtraProps.affiliations,
            currentValue: this.state.current.projectExtraProps.affiliations,
            onChange: this.handleSelect("affiliations"),
            readOnly: this.state.readOnly,
            placeholder: isEmpty(this.state.formData.projectExtraProps.affiliations) && this.state.readOnly ? "--" : "Choose an affiliation...",
            edit: true
          }),

          InputFieldText({
            isRendered: !isEmpty(this.state.formData.projectExtraProps.affiliations) && this.state.formData.projectExtraProps.affiliations.value === "other" ,
            id: "affiliationOther",
            name: "affiliationOther",
            label: "Primary Investigator Other Affiliation",
            value: this.state.formData.projectExtraProps.affiliationOther,
            currentValue: this.state.current.projectExtraProps.affiliationOther,
            readOnly: this.state.readOnly,
            required: false,
            onChange: this.handleProjectExtraPropsChange,
            edit: true
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
            fundingAwardNumberError: this.state.fundingAwardNumberError,
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
            label: "Broad individuals who require access to this project record",
            isDisabled: false,
            readOnly: this.state.readOnly,
            loadOptions: this.loadUsersOptions,
            handleChange: this.handleProjectCollaboratorChange,
            value: this.state.formData.collaborators,
            currentValue: this.state.current.collaborators,
            placeholder: "Start typing names for project access",
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
            valueEdited: isEmpty(this.state.current.projectExtraProps.protocol) === !isEmpty(this.state.formData.projectExtraProps.protocol),
            edit: true
          }),
          InputFieldSelect({
            label: "IRB-of-record",
            id: "irb",
            name: "irb",
            options: PREFERRED_IRB,
            value: this.state.formData.projectExtraProps.irb,
            currentValue: this.state.current.projectExtraProps.irb,
            onChange: this.handleSelect("irb"),
            readOnly: this.state.readOnly,
            placeholder: isEmpty(this.state.formData.projectExtraProps.irb) && this.state.readOnly ? "--" : "Select...",
            edit: true
          })
        ]),

        Panel({ title: "Determination Questions" }, [
          div({ isRendered: this.state.readOnly === false }, [
            AlertMessage({
              type: 'info',
              msg: "If changes need to be made to any of these questions, please submit a new project request",
              show: true
            })
          ]),
          div({ isRendered: !isEmpty(this.state.formData.projectExtraProps.feeForService), className: "firstRadioGroup" }, [
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
          div({ isRendered: !isEmpty(this.state.formData.projectExtraProps.broadInvestigator) }, [
            InputYesNo({
              id: "broadInvestigator",
              name: "broadInvestigator",
              value: this.state.formData.projectExtraProps.broadInvestigator,
              currentValue: this.state.current.projectExtraProps.broadInvestigator,
              moreInfo: '(generating, contributing to generalizable knowledge)? Examples of projects that DO NOT contribute to generalizable knowledge include case studies, internal technology development projects.',
              label: 'Is a Broad investigator conducting research ',
              readOnly: true,
              onChange: () => { }
            })
          ]),
          div({ isRendered: !isEmpty(this.state.formData.projectExtraProps.subjectsDeceased) }, [
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
          div({ isRendered: !isEmpty(this.state.formData.projectExtraProps.sensitiveInformationSource) }, [
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
          div({ isRendered: !isEmpty(this.state.formData.projectExtraProps.interactionSource) }, [
            InputYesNo({
              id: "interactionSource",
              name: "interactionSource",
              value: this.state.formData.projectExtraProps.interactionSource,
              currentValue: this.state.current.projectExtraProps.interactionSource,
              label: 'Are samples/data being provided by an investigator who has access to identifiers or obtains samples through an intervention or interaction?',
              readOnly: true,
              onChange: () => { }
            })
          ]),
          div({ isRendered: !isEmpty(this.state.formData.projectExtraProps.isIdReceive) }, [
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
          div({ isRendered: !isEmpty(this.state.formData.projectExtraProps.isCoPublishing) }, [
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
          div({ isRendered: !isEmpty(this.state.formData.projectExtraProps.federalFunding) }, [
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
        Panel({ title: "Broad Responsible Party (or Designee) Attestation*" }, [
          p({}, 'I confirm that the information provided above is accurate and complete. The Broad researcher associated with the project is aware of this application, and I have the authority to submit it on his/her behalf.'),
          p({}, '[If obtaining coded specimens/data] I certify that no Broad staff or researchers working on this project will have access to information that would enable the identification of individuals from whom coded samples and/or data were derived. I also certify that Broad staff and researchers will make no attempt to ascertain information about these individuals.'),
          InputFieldCheckbox({
            id: "ckb_attestation",
            name: "attestation",
            onChange: this.handleAttestationCheck,
            label: "I confirm",
            checked: this.state.formData.projectExtraProps.attestation === true || this.state.formData.projectExtraProps.attestation === "true",
            readOnly: true,
          }),
        ]),
        AlertMessage({
          msg: this.state.alertMessage !== '' ? this.state.alertMessage : 'Please complete all required fields',
          show: this.state.generalError || this.state.showAlert || this.state.showSuccessClarification || this.state.errorSubmit,
          type: this.state.alertType !== '' ? this.state.alertType : 'danger'
        }),
        div({ className: "buttonContainer", style: { 'margin': '20px 0 40px 0' } }, [
          button({
            className: "btn buttonPrimary floatLeft",
            onClick: this.enableEdit(),
            isRendered: this.state.readOnly === true && !component.isViewer
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
            disabled: isEmpty(this.state.editedForm) ?
              !this.compareObj("formData", "editedForm") && this.compareObj("formData", "current")
              : this.compareObj("formData", "editedForm"),
            isRendered: this.state.readOnly === false && !component.isViewer
          }, ["Submit Edits"]),

          /*visible for Admin in readOnly mode and if the project is in "pending" status*/
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.handleApproveInfoDialog,
            disabled: this.state.disableApproveButton,
            isRendered: this.state.isAdmin && projectReviewApproved === false && this.state.readOnly === true
          }, ["Approve"]),

          /*visible for Admin in readOnly mode and if there are changes to review*/
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.handleApproveDialog,
            isRendered: this.state.isAdmin && this.state.reviewSuggestion && this.state.readOnly === true && projectReviewApproved === true
          }, ["Approve Edits"]),

          /*visible for Admin in readOnly mode and if the project is in "pending" status*/
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.toggleState('rejectProjectDialog'),
            isRendered: this.state.isAdmin && projectReviewApproved === false && this.state.readOnly === true
          }, ["Reject"]),

          /*visible for every user in readOnly mode and if there are changes to review*/
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.toggleState('discardEditsDialog'),
            isRendered: this.state.isAdmin && this.state.reviewSuggestion && this.state.readOnly === true
          }, ["Discard Edits"]),
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.toggleState('requestClarification'),
            isRendered: this.state.isAdmin && this.state.readOnly === true
          }, ["Request Clarification"])
        ]),
        h(Spinner, {
          name: "mainSpinner", group: "orsp", loadingImage: component.loadingImage
        })
      ])
    )
  }
});
