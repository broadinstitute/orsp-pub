import { Component } from 'react';
import { button, div, h, h2, hh } from 'react-hyperscript-helpers';
import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { InstitutionalSource } from '../components/InstitutionalSource';
import { ConsentGroup, Project, Review, SampleCollections, User } from '../util/ajax';
import RequestClarificationDialog from '../components/RequestClarificationDialog';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { AlertMessage } from '../components/AlertMessage';
import get from 'lodash/get';
import { Table } from '../components/Table';
import { isEmpty } from '../util/Utils';
import { InputFieldTextArea } from '../components/InputFieldTextArea';
import { InputFieldRadio } from '../components/InputFieldRadio';
import LoadingWrapper from '../components/LoadingWrapper';

const headers =
  [
    { name: 'ID', value: 'sampleCollectionId' },
    { name: 'Name', value: 'collectionName' },
    { name: 'Category', value: 'collectionCategory' },
    { name: 'Group', value: 'collectionGroup' },
    { name: 'Linked Project', value: 'linkedProjectKey' },
    { name: 'Info Link', value: 'infoLink' },
    { name: 'Remove', value: 'unlinkSampleCollection' }
  ];

const ConsentGroupReview = hh(class ConsentGroupReview extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      unlinkDataRow: {},
      dialog: false,
      discardEditsDialog: false,
      approveDialog: false,
      approveInfoDialog: false,
      rejectProjectDialog: false,
      unlinkDialog: false,
      requestClarification: false,
      readOnly: true,
      isAdmin: false,
      disableApproveButton: false,
      reviewSuggestion: false,
      submitted: false,
      alertType: '',
      consentForm: {
        summary: '',
        approvalStatus: 'Pending'
      },
      consentExtraProps: {
        consent: '',
        protocol: '',
        collInst: '',
        collContact: '',
        describeEditType: null,
        editDescription: null,
        individualDataSourced: null,
        isLinkMaintained: null,
        feeForService: null,
        areSamplesComingFromEEAA: null,
        isCollaboratorProvidingGoodService: null,
        textSharingType: null,
        instSources: []
      },
      errorSubmit: false,
      errors: {
        editTypeError: false,
        editDescriptionError: false,
        instError: false,
        institutionalSourceNameError: false,
        institutionalSourceCountryError: false,
        institutionalNameErrorIndex: [],
        institutionalCountryErrorIndex: [],
        consent: false,
        protocol: false,
        consentGroupName: false,
        collInst: false,
        institutionalSourcesName: false,
        institutionalSourcesCountry: false
      },
      editedForm: {},
      formData: {
        currentInstSources: [{ name: '', country: '' }],
        consentExtraProps: {},
        consentForm: {},
        sampleCollections: []
      },
      current: {
        consentExtraProps: {
          endDate: null,
        },
        consentForm: {}
      },
      futureCopy: {
        instSources: [{ name: '', country: '' }],
      },
      suggestions: {},
      suggestionsCopy: {},
      questions: [],
      questionsIds: [],

      singleErrorMessage: 'Required field',

      showError: false,
      errorMessage: 'Please complete required fields',
      detailsError: false,
      institutionalSourceError: false,
      isEdited: false,
    };
    this.rejectConsentGroup = this.rejectConsentGroup.bind(this);
  }

  componentDidMount() {
    this.props.showSpinner();
    this._isMounted = true;
    this.init();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  init = () => {
    let current = {};
    let currentStr = {};
    let future = {};
    let futureCopy = {};
    let futureStr = {};
    let formData = {};
    let sampleCollectionList = [];

    ConsentGroup.getConsentGroup(this.props.consentKey).then(
      element => {
        let sampleCollections = [];
        SampleCollections.getSampleCollections().then(
          resp => {
            if (this._isMounted) {
              sampleCollections = resp.data.map(item => {
                return {
                  key: item.id,
                  value: item.collectionId,
                  label: item.collectionId + ": " + item.name + " ( " + item.category + " )"
                };
              });
              sampleCollectionList = sampleCollections;

              current.consentExtraProps = element.data.extraProperties;
              if (element.data.collectionLinks !== undefined) {
                current.sampleCollectionLinks = element.data.collectionLinks;
              }

              if (element.data.sampleCollections !== undefined) {
                current.sampleCollections = element.data.sampleCollections.map(sample => {
                  sampleCollectionList.push({
                    key: sample.id,
                    value: sample.collectionId,
                    label: sample.collectionId + ": " + sample.name + " ( " + sample.category + " )"
                  });
                  return ({
                    key: sample.id,
                    value: sample.collectionId,
                    label: sample.collectionId + ": " + sample.name + " ( " + sample.category + " )"
                  });
                });
              }

              if (element.data.extraProperties.institutionalSources !== undefined) {
                current.instSources = this.parseInstSources(JSON.parse(element.data.extraProperties.institutionalSources));
              }
              this.props.initStatusBoxInfo(element.data);
              current.consentForm = element.data.issue;
              currentStr = JSON.stringify(current);
              this.getReviewSuggestions();
              let edits = null;

              if (edits != null) {
                future.consentExtraProps = edits.data.extraProperties;
                futureStr = JSON.stringify(future);
                formData = JSON.parse(futureStr);
                futureCopy = JSON.parse(futureStr);
              } else {
                formData = JSON.parse(currentStr);
                future = JSON.parse((currentStr));
                futureCopy = JSON.parse(currentStr);
              }

              this.setState(prev => {
                // prepare form data here, initially same as current ....
                prev.sampleCollectionList = sampleCollectionList;
                prev.formData = formData;
                prev.current = current;
                prev.future = future;
                prev.futureCopy = futureCopy;
                prev.isAdmin = component.isAdmin;
                return prev;
              }, () => this.props.hideSpinner());
            }
          }
        );
      }).catch(() => {
      this.props.hideSpinner();
    });
  };

  parseInstSources(instSources) {
    let instSourcesArray = [];
    if (instSources !== undefined && instSources !== null && instSources.length > 0) {
      instSources.map(instSource => {
        instSourcesArray.push({
          current: { name: instSource.name, country: instSource.country },
          future: { name: instSource.name, country: instSource.country }
        });
      });
    }
    return instSourcesArray;
  }

  getReviewSuggestions = () => {
    Review.getSuggestions(this.props.consentKey).then(data => {
      if (this._isMounted) {
        if (data.data !== '') {
          this.setState(prev => {
            prev.formData = JSON.parse(data.data.suggestions);
            prev.editedForm = JSON.parse(data.data.suggestions);
            prev.reviewSuggestion = true;
            return prev;
          });
          this.props.changeInfoStatus(false);
          this.props.hideSpinner();
        } else {
          this.setState(prev => {
            prev.formData = JSON.parse(JSON.stringify(this.state.current));
            prev.reviewSuggestion = false;
            return prev;
          },() => this.props.hideSpinner());
        }
      }
    });
  };

  isValid = async () => {
    let consent = false;
    let protocol = false;
    let collInst = false;
    let endDate = false;
    let consentGroupName = false;

    if (isEmpty(this.state.formData.consentExtraProps.consent)) {
      consent = true;
    }

    if (isEmpty(this.state.formData.consentExtraProps.protocol)) {
      protocol = true;
    }

    if (isEmpty(this.state.formData.consentExtraProps.collInst)) {
      collInst = true;
    }
    if (!this.state.formData.consentExtraProps.onGoingProcess
      && isEmpty(this.state.formData.consentExtraProps.endDate)
      && !isEmpty(this.state.formData.consentExtraProps.startDate)
    ) {
      endDate = true;
    }

    if (await this.consentGroupNameExists()) {
      consentGroupName = true;
    }

    const valid = !consent &&
      !this.institutionalSrcHasErrors() &&
      !protocol &&
      !collInst &&
      !consentGroupName;

    if (this._isMounted) {
      this.setState(prev => {
        prev.errors.consent = consent;
        prev.errors.protocol = protocol;
        prev.errors.collInst = collInst;
        prev.errors.consentGroupName = consentGroupName;
        return prev;
      });
      this.setState({ errorSubmit: !valid });
    }
    return valid;
  };

  cleanErrors = () => {
    this.setState(prev => {
      prev.errors.consent = false;
      prev.errors.protocol = false;
      prev.errors.collInst = false;
      prev.errors.consentGroupName = false;
      prev.errors.instError = false;
      prev.errors.institutionalNameErrorIndex = [];
      prev.errors.institutionalCountryErrorIndex = [];
      return prev;
    });
  };

  approveConsentGroup = () => {
    this.props.showSpinner();
    this.setState({ disableApproveButton: true });
    const data = { approvalStatus: "Approved" };
    ConsentGroup.approve(this.props.consentKey, data).then(
      () => {
        if (this.state.reviewSuggestion) {
          let consentGroup = this.getConsentGroup();
          ConsentGroup.updateConsent(consentGroup, this.props.consentKey).then(resp => {
            this.removeEdits();
          }).catch(error => {
            this.props.hideSpinner();
            console.error(error);
          });
        }
        this.setState(prev => {
          prev.formData.consentForm.approvalStatus = data.approvalStatus;
          prev.current.consentExtraProps.projectReviewApproved = true;
          prev.approveInfoDialog = false;
          return prev;
        }, () => {      
          Project.getProject(this.props.consentKey).then(
            issue => {
              this.props.updateDetailsStatus(issue.data);
              this.props.hideSpinner();
            })
          });
        })
    };

  rejectConsentGroup() {
    this.props.showSpinner();
    ConsentGroup.rejectConsent(this.props.consentKey).then(resp => {
      window.location.href = this.getRedirectUrl(this.props.projectKey);
      this.props.hideSpinner();
    }).catch(error => {
      this.props.hideSpinner();
      console.error(error);
    });
  }

  discardEdits = () => {
    this.props.showSpinner();
    this.setState({ discardEditsDialog: false });
    this.removeEdits('reject');
  };

  approveEdits = () => {
    this.props.showSpinner();
    let consentGroup = this.getConsentGroup();
    consentGroup.editsApproved = true;
    ConsentGroup.updateConsent(consentGroup, this.props.consentKey).then(resp => {
      this.setState(prev => {
        prev.approveDialog = false;
        return prev;
      });
      this.removeEdits('approve');
      this.props.updateContent();
    })
    .catch(error => {
      this.props.hideSpinner();
      console.error(error);
    });
  };

  handleApproveDialog = async () => {
    if (await this.isValid()) {
      this.setState({
        approveDialog: true,
        isEdited: true,
        errorSubmit: false
      });
    }
    else {
      this.props.hideSpinner();
      this.setState({
        errorSubmit: true
      });
    }
  };

  handleApproveInfoDialog = () => {
    if (this.isValid()) {
      this.setState({
        approveInfoDialog: true,
        errorSubmit: false,
      });
    }
    else {
      this.props.hideSpinner();
      this.setState({
        errorSubmit: true
      });
    }
  };

  enableEdit = (e) => () => {
    this.props.showSpinner();
    this.getReviewSuggestions();
    this.setState(prev => {
      prev.readOnly = false;
      prev.resetIntCohorts = true;
      prev.isEdited = false;
      return prev;
    });
  };

  toggleState = (e) => () => {
    this.setState((state, props) => {
      return { [e]: !state[e] }
    });
  };

  cancelEdit = (e) => () => {
    this.cleanErrors();
    this.getReviewSuggestions();
    this.setState(prev => {
      prev.formData = this.state.futureCopy;
      prev.readOnly = true;
      prev.errorSubmit = false;
      return prev;
    });
  };

  submitEdit = (e) => async () => {
    this.props.showSpinner();
    let data = {};
    if (await this.isValid()) {
      this.setState(prev => {
        prev.readOnly = true;
        prev.errorSubmit = false;
        return prev;
      }, () => {
        let institutionalSourceArray = this.state.formData.instSources;
        let newFormData = Object.assign({}, this.state.formData);
        newFormData.instSources = institutionalSourceArray;
        User.getUserSession().then(resp => {
          data.projectKey = this.props.consentKey;
          newFormData.editCreator = resp.data.userName;
          data.suggestions = JSON.stringify(newFormData);
          if (this.state.reviewSuggestion) {
            Review.updateReview(this.props.consentKey, data).then(() => {
              this.getReviewSuggestions();
              this.props.updateContent();
            }).catch(error => {
              this.getReviewSuggestions();
              this.setState(prev => {
                prev.submitted = true;
                prev.errorSubmit = true;
                prev.errorMessage = 'Something went wrong. Please try again later.';
                return prev;
              });
            });
          } else {
            Review.submitReview(data).then(() => {
              this.getReviewSuggestions();
              this.props.updateContent();
            }).catch(error => {
              this.getReviewSuggestions();
              this.setState(prev => {
                prev.submitted = true;
                prev.errorSubmit = true;
                prev.errorMessage = 'Something went wrong. Please try again later.';
                return prev;
              });
            });
          }
        }).catch(error => {
          this.setState(this.setState(() => { throw error; }));
        });
      });
    } else {
      this.props.hideSpinner();
      this.setState(prev => {
        prev.submitted = true;
        prev.errorSubmit = true;
        prev.errorMessage = 'Please complete required fields.';
        return prev;
      });
    }
  };

  institutionalSrcHasErrors = () => {
    const instSources = this.state.formData.instSources == undefined ? [{ current: { name: '', country: '' }, future: { name: '', country: '' } }] : this.state.formData.instSources;
    let institutionalNameErrorIndex = [];
    let institutionalCountryErrorIndex = [];
    let institutionalError = instSources.filter((obj, idx) => {
      let response = false;
      // Error if Name is missing
      if (isEmpty(obj.current.name) && isEmpty(obj.future.name)
        || isEmpty(obj.future.name) && !isEmpty(obj.future.country)
      ) {
        institutionalNameErrorIndex.push(idx);
        response = true;
      }
      // Error if Country is missing
      if (isEmpty(obj.future.country) && isEmpty(obj.current.country)
        || isEmpty(obj.future.country) && !isEmpty(obj.future.name)
      ) {
        institutionalCountryErrorIndex.push(idx);
        response = true;
      }
      // Error if all elements are empty
      if (!instSources.filter(element => !isEmpty(element.future.name) && !isEmpty(element.future.country)).length > 0) {
        institutionalNameErrorIndex.push(0);
        institutionalCountryErrorIndex.push(0);
        response = true;
      }
      return response;
    }).length > 0;
    this.setState(prev => {
      prev.errors.institutionalNameErrorIndex = institutionalNameErrorIndex;
      prev.errors.institutionalCountryErrorIndex = institutionalCountryErrorIndex;
      prev.errors.instError = institutionalError;
      return prev;
    });

    return institutionalError;
  };

  parseDate(date) {
    if (date !== undefined) {
      let d = new Date(date).toISOString();
      return d.slice(0, d.indexOf("T"));
    }
  }

  getSampleCollections = () => {
    const sampleCollections = this.state.formData.sampleCollections;
    const sampleCollectionList = [];
    if (sampleCollections !== null && sampleCollections.length > 0) {
      sampleCollections.map((sc, idx) => {
        sampleCollectionList.push(sc.value);
      });
    }
    return sampleCollectionList;
  };

  getInstitutionalSrc(institutionalSources) {
    let institutionalSourcesList = [];
    if (institutionalSources !== null && institutionalSources.length > 0) {
      institutionalSources.map((f) => {
        if (!isEmpty(f.future.name) && !isEmpty(f.future.country)) {
          institutionalSourcesList.push({ name: f.future.name, country: f.future.country });
        }
      });
    }
    return institutionalSourcesList;
  }

  getConsentGroup = () => {
    const consentGroup = {};

    consentGroup.summary = this.state.formData.consentForm.summary;
    consentGroup.samples = this.getSampleCollections();
    consentGroup.source = component.projectKey;
    consentGroup.collInst = this.state.formData.consentExtraProps.collInst;
    consentGroup.collContact = this.state.formData.consentExtraProps.collContact;
    consentGroup.consent = this.state.formData.consentExtraProps.consent;
    consentGroup.protocol = this.state.formData.consentExtraProps.protocol;
    consentGroup.institutionalSources = JSON.stringify(this.getInstitutionalSrc(this.state.formData.instSources));
    consentGroup.editDescription = this.state.formData.consentExtraProps.editDescription;
    consentGroup.describeEditType = this.state.formData.consentExtraProps.describeEditType;
    if (this.state.reviewSuggestion) {
      consentGroup.editsApproved = true;
    }
    consentGroup.sensitive = this.state.formData.consentExtraProps.sensitive;
    return consentGroup;
  };

  removeEdits = (type) => {
    Review.deleteSuggestions(this.props.consentKey, type).then(
      resp => {
        this.init();
        this.props.hideSpinner();
      }, () =>
        this.props.hideSpinner()
      )
      .catch(error => {
        this.props.hideSpinner();
        console.error(error);
      });
  };

  handleUpdateinstitutionalSources = (updated) => {
    this.setState(prev => {
      prev.formData.instSources = updated;
      prev.isEdited = true;
      prev.errors.instError = false;
      return prev;
    }, async () => {
      if (this.state.submitted) {
        await this.isValid();
      }
    });
  };

  setInstitutionalError = (error) => {
    this.setState(prev => {
      prev.errors.instError = error;
      return prev;
    })
  };

  handleExtraPropsInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formData.consentExtraProps[field] = value;
      prev.errors[field] = false;
      prev.isEdited = !this.areObjectsEqual("formData", "current");
      return prev;
    }, async () => {
      if (this.state.errorSubmit === true) {
        await this.isValid();
      }
    });
  };

  handleChange = (id) => (date) => {
    this.setState(prev => {
      prev.formData.consentExtraProps[id] = date;
      prev.isEdited = !this.areObjectsEqual("formData", "current");
      prev.errors[id] = false;
      return prev;
    }, async () => {
      if (this.state.errorSubmit === true) {
        await this.isValid();
      }
    });
  };

  handleRadio2Change = (e, field, value) => {
    this.setState(prev => {
      prev.formData.consentExtraProps[field] = value;
      prev.errors[field] = false;
      prev.isEdited = !this.areObjectsEqual("formData", "current");
      return prev;
    }, async () => {
      if (this.state.errorSubmit) await this.isValid()
    });
  };

  getRedirectUrl(projectKey) {
    if (projectKey === "") {
      return component.serverURL + "/search/index";
    } else {
      return [component.serverURL, "project/main?projectKey=" + projectKey + "&tab=consent-groups"].join("/");
    }
  }

  areObjectsEqual(formData, current) {
    let newValues = JSON.parse(JSON.stringify(this.state[formData]));
    let currentValues = JSON.parse(JSON.stringify(this.state[current]));

    // remove Null consentExtraprops objects and normalize true/false to strings
    Object.keys(newValues.consentExtraProps).forEach((key) => {
      if (newValues.consentExtraProps[key] === true) newValues.consentExtraProps[key] = "true";
      else if (newValues.consentExtraProps[key] === false) newValues.consentExtraProps[key] = "false";
      return (newValues.consentExtraProps[key] === null) && delete newValues.consentExtraProps[key]

    });
    Object.keys(currentValues.consentExtraProps).forEach((key) => {
      if (currentValues.consentExtraProps[key] === true) currentValues.consentExtraProps[key] = "true";
      else if (currentValues.consentExtraProps[key] === false)
        return (currentValues.consentExtraProps[key] === null) && delete currentValues.consentExtraProps[key]
    });
    return JSON.stringify(newValues) === JSON.stringify(currentValues);
  }


   consentGroupNameExists = async () =>  {
    const groupName = [this.state.formData.consentExtraProps.consent, this.state.formData.consentExtraProps.protocol].join(" / ");
    let exists = false;
    if (!isEmpty(this.state.formData.consentExtraProps.consent) && !isEmpty(this.state.formData.consentExtraProps.protocol)) {
      exists = get(await ConsentGroup.getMatchingConsentByName(groupName), 'data', false);
      this.setState(prev => {
        prev.errors.consentGroupName = exists;
        return prev;
      });
    }
    return exists;
  }

  areFormsEqual() {
    let areFormsEqual = false;
    if (this.state.reviewSuggestion) {
      areFormsEqual = this.areObjectsEqual("formData", "editedForm");
    } else {
      areFormsEqual = this.areObjectsEqual("formData", "current");
    }
    return areFormsEqual;
  };

  successClarification = () => {
    setTimeout(this.clearAlertMessage, 5000, null);
    this.props.updateContent();
    this.setState(prev => {
      prev.errorSubmit = true;
      prev.errorMessage = 'Request clarification sent.';
      prev.alertType = 'success';
      return prev;
    });
  };

  clearAlertMessage = () => {
    this.setState(prev => {
      prev.errorSubmit = false;
      prev.errorMessage = '';
      prev.alertType = '';
      return prev;
    });
  };

  unlinkSampleCollection = () => {
    ConsentGroup.unlinkSampleCollection(this.state.unlinkDataRow.id).then(
      () => {
        this.toggleUnlinkDialog();
        this.init()
      }).catch(error => {
        this.setState({}, () => { throw error })
      })
  };

  handleRedirectToInfoLink = (consentCollectionId, projectKey) => {
    return [component.serverURL, "infoLink", "showInfoLink?cclId=" + consentCollectionId + "&projectKey=" + projectKey + "&consentKey=" + this.props.consentKey].join("/");
  };

  toggleUnlinkDialog = (data) => {
    this.setState(prev => {
      prev.unlinkDialog = !this.state.unlinkDialog;
      if (data !== undefined) {
        prev.unlinkDataRow = data;
      }
      return prev;
    });
  };

  render() {
    const {
      consent = '',
      protocol = '',
      collInst = '',
      collContact = '',
      describeEditType = null,
      editDescription = null
    } = get(this.state.formData, 'consentExtraProps', '');
    const instSources = this.state.formData.instSources === undefined ? [{ current: { name: '', country: '' }, future: { name: '', country: '' } }] : this.state.formData.instSources;
    return (
      div({}, [
        h2({ className: "stepTitle" }, [" Group as Sample/Data Cohort: " + this.props.consentKey]),
        button({
          className: "btn buttonPrimary floatRight",
          style: { 'marginTop': '15px' },
          onClick: this.enableEdit(),
          isRendered: this.state.readOnly === true && !component.isViewer,
        }, ["Edit Information"]),
        button({
          className: "btn buttonSecondary floatRight",
          style: { 'marginTop': '15px' },
          onClick: this.cancelEdit(),
          isRendered: this.state.readOnly === false
        }, ["Cancel"]),
        ConfirmationDialog({
          closeModal: this.toggleState('unlinkDialog'),
          show: this.state.unlinkDialog,
          handleOkAction: this.unlinkSampleCollection,
          title: 'Unlink Sample Collection association',
          bodyText: 'Are you sure you want to unlink the associated Sample Collection?',
          actionLabel: 'Yes'
        }),
        h(RequestClarificationDialog, {
          closeModal: this.toggleState('requestClarification'),
          show: this.state.requestClarification,
          issueKey: this.props.consentKey,
          successClarification: this.successClarification
        }),
        ConfirmationDialog({
          closeModal: this.toggleState('approveDialog'),
          show: this.state.approveDialog,
          handleOkAction: this.approveEdits,
          title: 'Approve Edits Confirmation',
          bodyText: 'Are you sure you want to approve these edits?',
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
          closeModal: this.toggleState('approveInfoDialog'),
          show: this.state.approveInfoDialog,
          handleOkAction: this.approveConsentGroup,
          title: 'Approve Project Information',
          bodyText: 'Are you sure you want to approve this  Group as Sample/Data Cohort Details?',
          actionLabel: 'Yes'
        }, []),
        ConfirmationDialog({
          closeModal: this.toggleState('dialog'),
          show: this.state.dialog,
          handleOkAction: this.rejectConsentGroup,
          title: 'Remove Confirmation',
          bodyText: 'Are you sure you want to remove this  Group as Sample/Data Cohort?',
          actionLabel: 'Yes'
        }, []),
        Panel({ title: "Notes to ORSP",
          isRendered: !this.state.readOnly || !isEmpty(this.state.formData.consentExtraProps.editDescription) || !isEmpty(this.state.formData.consentExtraProps.describeEditType)
        }, [
          InputFieldRadio({
            id: "radioDescribeEdits",
            name: "describeEditType",
            currentValue: this.state.current.consentExtraProps.describeEditType,
            label: "Please choose one of the following to describe the proposed edits: ",
            value: describeEditType,
            optionValues: ["newAmendment", "requestingAssistance", "clarificationResponse"],
            optionLabels: [
              "I am informing Broad's ORSP of a new amendment I already submitted to my IRB of record",
              "I am requesting assistance in updating an existing project",
              "I am responding to a request for clarifications from ORSP"
            ],
            onChange: this.handleRadio2Change,
            readOnly: this.state.readOnly,
            required: true,
            error: this.state.errors.editTypeError,
            errorMessage: "Required field"
          }),
          InputFieldTextArea({
            id: "inputDescribeEdits",
            name: "editDescription",
            label: "You may use this space to add additional information or clarifications related to your edits below",
            currentValue: this.state.current.consentExtraProps.editDescription,
            value: editDescription === null ? undefined : editDescription,
            readOnly: this.state.readOnly,
            required: true,
            onChange: this.handleExtraPropsInputChange,
            error: this.state.errors.editDescriptionError,
            errorMessage: "Required field"
          })
        ]),
        Panel({ title: " Group as Sample/Data Cohort Details" }, [
          InputFieldText({
            id: "inputConsentGroupName",
            name: "consentGroupName",
            label: " Group as Sample/Data Cohort Name",
            disabled: !this.state.readOnly,
            value: consent + " / " + protocol,
            currentValue: this.state.current.consentForm.summary,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly,
            error: this.state.errors.consentGroupName,
            errorMessage: "An existing  Group as Sample/Data Cohort with this protocol exists. Please choose a different one."
          }),
          InputFieldText({
            id: "inputInvestigatorLastName",
            name: "consent",
            label: "Last Name of Investigator Listed on the Consent Form",
            value: consent,
            currentValue: this.state.current.consentExtraProps.consent,
            onChange: this.handleExtraPropsInputChange,
            focusOut: this.consentGroupNameExists,
            readOnly: this.state.readOnly,
            error: this.state.errors.consent,
            errorMessage: "Required field"
          }),
          InputFieldText({
            id: "inputInstitutionProtocolNumber",
            name: "protocol",
            label: "Collaborating Institution's Protocol Number",
            value: protocol,
            currentValue: this.state.current.consentExtraProps.protocol,
            onChange: this.handleExtraPropsInputChange,
            focusOut: this.consentGroupNameExists,
            readOnly: this.state.readOnly,
            error: this.state.errors.protocol,
            errorMessage: "Required field"
          }),
          InputFieldText({
            id: "inputCollaboratingInstitution",
            name: "collInst",
            label: "Collaborating Institution",
            value: collInst,
            currentValue: this.state.current.consentExtraProps.collInst,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly,
            error: this.state.errors.collInst,
            errorMessage: "Required field"
          }),
          InputFieldText({
            id: "inputprimaryContact",
            name: "collContact",
            label: "Primary Contact at Collaborating Institution ",
            value: collContact,
            currentValue: this.state.current.consentExtraProps.collContact,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly,
            valueEdited: !isEmpty(collContact) === isEmpty(this.state.current.consentExtraProps.collContact)
          })
        ]),

        Panel({ title: "Sample Collections" }, [
          Table({
            headers: headers,
            isAdmin: this.state.isAdmin,
            data: this.state.current.sampleCollectionLinks,
            handleRedirectToInfoLink: this.handleRedirectToInfoLink,
            unlinkSampleCollection: this.toggleUnlinkDialog,
            sizePerPage: 10,
            paginationSize: 10
          })
        ]),

        Panel({ title: "Institutional Source of Data/Samples and Location" }, [
          InstitutionalSource({
            updateInstitutionalSource: this.handleUpdateinstitutionalSources,
            institutionalSources: instSources,
            readOnly: this.state.readOnly,
            edit: true,
            errorHandler: this.setInstitutionalError,
            institutionalNameErrorIndex: this.state.errors.institutionalNameErrorIndex,
            institutionalCountryErrorIndex: this.state.errors.institutionalCountryErrorIndex,
            error: this.state.errors.instError
          })
        ]),

        AlertMessage({
          msg: this.state.errorMessage,
          show: this.state.errorSubmit,
          type: this.state.alertType !== '' ? this.state.alertType : 'danger'
        }),
        div({ className: "buttonContainer", style: { 'margin': '20px 0 40px 0' } }, [
          button({
            className: "btn buttonPrimary floatLeft",
            onClick: this.enableEdit(),
            isRendered: this.state.readOnly === true && !component.isViewer,
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
            disabled: this.areFormsEqual(),
            isRendered: this.state.readOnly === false
          }, ["Submit Edits"]),

          /*visible for Admin in readOnly mode and if the consent group is in "pending" status*/
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.handleApproveInfoDialog,
            isRendered: this.state.current.consentExtraProps.projectReviewApproved !== true && this.state.isAdmin && this.state.readOnly === true,
            disabled: this.state.disableApproveButton
          }, ["Approve"]),

          /*visible for Admin in readOnly mode and if there are changes to review*/
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.handleApproveDialog,
            isRendered: this.state.isAdmin
              && this.state.reviewSuggestion === true
              && this.state.current.consentExtraProps.projectReviewApproved === true
              && this.state.readOnly === true
          }, ["Approve Edits"]),

          /*visible for Admin in readOnly mode and if the consent group is in "pending" status*/
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.toggleState('dialog'),
            disabled: this.state.disableApproveButton,
            isRendered: this.state.current.consentExtraProps.projectReviewApproved !== true && this.state.isAdmin && this.state.readOnly === true,
          }, ["Reject"]),
          /*visible for every user in readOnly mode and if there are changes to review*/
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.toggleState('discardEditsDialog'),
            isRendered: this.state.isAdmin && this.state.reviewSuggestion === true && this.state.readOnly === true
          }, ["Discard Edits"]),
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.toggleState('requestClarification'),
            isRendered: this.state.isAdmin && this.state.readOnly === true
          }, ["Request Clarification"])
        ])
      ])
    )
  }
});

export default LoadingWrapper(ConsentGroupReview);
