import { Component } from 'react';
import { hh, p, div, h2, input, label, span, a, button } from 'react-hyperscript-helpers';

import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { InputFieldSelect } from '../components/InputFieldSelect';
import { InputFieldDatePicker } from '../components/InputFieldDatePicker';
import { InputYesNo } from '../components/InputYesNo';
import { InstitutionalSource } from '../components/InstitutionalSource';
import { ConsentGroup, SampleCollections, User, Review } from "../util/ajax";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { spinnerService } from "../util/spinner-service";

class ConsentGroupReview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      readOnly: true,
      isAdmin: false,
      disableApproveButton: false,
      reviewSuggestion: false,
      consentForm: {
        summary: '',
        approvalStatus: 'Pending'
      },

      consentExtraProps: {
        consent: '',
        protocol: '',
        collInst: '',
        collContact: '',
        describeConsentGroup: '',
        requireMta: '',

        startDate: null,
        endDate: null,
        onGoingProcess: false,

        individualDataSourced: null,
        isLinkMaintained: null,
        isFeeForService: null,
        areSamplesComingFromEEAA: null,
        isCollaboratorProvidingGoodService: null,
        isConsentUnambiguous: null,
        pii: null,
        compliance: null,
        textCompliance: null,
        sensitive: null,
        textSensitive: null,
        accessible: null,
        textAccessible: null,
        sharingPlan: null,
        databaseControlled: null,
        databaseOpen: null,


        instSources: []
      },
      errors: {
        sampleCollections: false
      },
      formData: {
        consentExtraProps: {},
        consentForm: {},
        sampleCollections: [],
      },
      current: {
        consentExtraProps: {
        },
        consentForm: {
        }
      },
      suggestions: {},
      suggestionsCopy: {}
    };
    this.rejectConsentGroup = this.rejectConsentGroup.bind(this);
  }

  componentDidMount() {
    this.isCurrentUserAdmin();
    let current = {};
    let currentStr = {};
    let future = {};
    let futureCopy = {};
    let futureStr = {};
    let formData = {};
    let formDataStr = {};
    let sampleCollectionList = [];

    ConsentGroup.getConsentGroup(this.props.consentGroupUrl, this.props.consentKey).then(
      element => {
        let sampleCollections = [];
        SampleCollections.getSampleCollections(this.props.sampleSearchUrl).then(
          resp => {

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
                return ({
                  key: sample.id,
                  value: sample.collectionId,
                  label: sample.collectionId + ": " + sample.name + " ( " + sample.category + " )"
                });
              });
            }

            if (element.data.extraProperties.institutionalSources !== undefined) {
              current.instSources = JSON.parse(element.data.extraProperties.institutionalSources);
            }

            current.consentForm = element.data.issue;
            currentStr = JSON.stringify(current);
            this.getReviewSuggestions();
            let edits = null;

            if (edits != null) {
              // prepare form data here, initially same as current ....
              future.consentExtraProps = edits.data.extraProperties;
              // ...
              // ...
              // ... need to complete future to look like current, same structure
              // ...
              // ...
              futureStr = JSON.stringify(future);

              formData = JSON.parse(futureStr);
              futureCopy = JSON.parse(futureStr);


            } else {
              // prepare form data here, initially same as current ....
              formData = JSON.parse(currentStr);
              future = JSON.parse((currentStr));
              futureCopy = JSON.parse(currentStr);
            }

            // });

            // store current issue info here ....
            this.setState(prev => {
              // prepare form data here, initially same as current ....
              prev.sampleCollectionList = sampleCollectionList;
              prev.formData = formData;
              prev.current = current;
              prev.future = future;
              prev.futureCopy = futureCopy;
              return prev;
            });
          }
        );
      }
    );
  }

  getReviewSuggestions() {
    Review.getSuggestions(this.props.serverURL, this.props.consentKey).then(
      data => {
        if (data.data !== '') {
          this.setState(prev => {
            prev.formData = JSON.parse(data.data.suggestions);
            prev.reviewSuggestion = true;
            return prev;
          });
        } else {
          this.setState(prev => {
            prev.reviewSuggestion = false;
            return prev;
          });
        }
      }
    );
  }

  parseBool() {
    if (this.state.formData.consentExtraProps.onGoingProcess !== undefined) {
      let stringValue = this.state.formData.consentExtraProps.onGoingProcess;
      let boolValue = stringValue.toLowerCase() === 'true';
      return boolValue;
    }
  }

  isEmpty(value) {
    return value === '' || value === null || value === undefined;
  }

  hasDate(date) {
    if (this.state.formData.consentExtraProps[date] !== undefined)
      return true
  }

  approveConsentGroup = () => {
    this.setState({ disableApproveButton: true });
    const data = { approvalStatus: "Approved" };
    ConsentGroup.approve(this.props.approveConsentGroupUrl, this.props.consentKey, data).then(
      () =>
        this.setState(prev => {
          prev.formData.consentForm.approvalStatus = data.approvalStatus;
          return prev;
        })
    );
  };

  approveRevision = (e) => () => {
    this.setState({ disableApproveButton: true });
    const data = { projectReviewApproved: true };
    Project.addExtraProperties(this.props.addExtraPropUrl, this.props.projectKey, data).then(
      () => this.setState(prev => {
        prev.formData.consentExtraProps.projectReviewApproved = true;
        return prev;
      })
    );
  }

  isCurrentUserAdmin() {
    User.isCurrentUserAdmin(this.props.isAdminUrl).then(
      resp => this.setState({ isAdmin: resp.data.isAdmin })
    );
  }

  rejectConsentGroup() {
    spinnerService.showAll();
    ConsentGroup.rejectConsent(this.props.rejectConsentUrl, this.props.consentKey).then(resp => {
      window.location.href = this.getRedirectUrl(this.props.projectKey);
      spinnerService.hideAll();
    }).catch(error => {
      spinnerService.hideAll();
      console.error(error);
    });
  }

  discardEdits = (e) => () => {

  }

  approveEdits = (e) => () => {

  }

  enableEdit = (e) => () => {
    this.getReviewSuggestions();
    this.setState({
      readOnly: false
    });
  };

  cancelEdit = (e) => () => {
    this.setState({
      formData: this.state.futureCopy,
      readOnly: true
    });
    this.getReviewSuggestions();
  };

  submitEdit = (e) => () => {
    this.setState({
      readOnly: true
    });
    const data = {
      projectKey: this.props.consentKey,
      suggestions: JSON.stringify(this.state.formData),
    };

    if (this.state.reviewSuggestion) {
      Review.updateReview (this.props.serverURL, this.props.consentKey, data).then(() =>
        this.getReviewSuggestions()
      );
    } else {
      Review.submitReview (this.props.serverURL, data).then(() =>
        this.getReviewSuggestions()
      );
    }
  }

  handleSampleCollectionChange = () => (data) => {
    this.setState(prev => {
      prev.formData.sampleCollections = data;
      return prev;
    }); //, () => this.props.updateForm(this.state.formData, "sampleCollections"));
    //this.props.removeErrorMessage();
  };

  handleCheck = (e) => {
    const checked = e.target.checked;
    const date = this.state.current.consentExtraProps.endDate;
    this.setState(prev => {
      prev.formData.consentExtraProps.onGoingProcess = checked;
      prev.formData.consentExtraProps.endDate = checked ? null : date;
      return prev;
    });
  };

  addDays(date, days) {
    if (date !== null) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }
    return null
  }

  handleUpdateinstitutionalSources = (updated, field) => {
    this.setState(prev => {
      prev.formData.institutionalSources = updated;
      return prev;
    }); //, () => this.props.updateForm(this.state.formData, field.concat("Institutional")));
    // this.props.removeErrorMessage();
  };

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }); //, () => {
    //   this.props.updateForm(this.state.formData, field);
    //   this.props.removeErrorMessage();
    // })
  };

  handleExtraPropsInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formData.consentExtraProps[field] = value;
      return prev;
    }); //, () => {
    //   this.props.updateForm(this.state.formData, field);
    //   this.props.removeErrorMessage();
    // })
  };

  handleChange = (id) => (date) => {
    this.setState(prev => {
      prev.formData.consentExtraProps[id] = date;
      return prev;
    }); //, () => this.props.updateForm(this.state.formData, id));
    //this.props.removeErrorMessage();
  };

  handleRadioChange = (e, field, value) => {
    if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    }

    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }); //, () => this.props.updateForm(this.state.formData, field));
    // this.props.removeErrorMessage();
  };

  handleRadio2Change = (e, field, value) => {
    this.setState(prev => {
      prev.formData.consentExtraProps[field] = value;
      return prev;
    }); //, () => this.props.updateForm(this.state.formData, field));
    // this.props.removeErrorMessage();
  };

  closeModal = () => {
    this.setState({ showDialog: !this.state.showDialog });
  };

  handleDialog = () => {
    this.setState({
      showDialog: !this.state.showDialog
    });
  };

  getRedirectUrl(projectKey) {
    if (projectKey === "") {
      return this.props.serverURL + "/search/index";
    } else {
      let key = projectKey.split("-");
      let projectType = '';
      if (key.length === 3) {
        projectType = key[1].toLowerCase();
      } else {
        projectType = key[0].toLowerCase();
      }
      return [this.props.serverURL, projectType, "show", projectKey, "?tab=consent-groups"].join("/");
    }
  }

  render() {

    const headers = [{ name: 'ID', value: 'id' }, { name: 'Name', value: 'name' }, { name: 'Category', value: 'category' }, { name: 'Group', value: 'groupName' }];

    const { startDate = null, endDate = null } = this.state.formData.consentExtraProps;

    const {
      consent = '',
      protocol = '',
      collInst = '',
      collContact = '',

      individualDataSourced = '',
      isLinkMaintained = '',
      isFeeForService = '',
      areSamplesComingFromEEAA = '',
      isCollaboratorProvidingGoodService = '',
      isConsentUnambiguous = '',
      pii = '',
      compliance = '',
      textCompliance = '',
      sensitive = '',
      textSensitive = '',
      accessible = '',
      textAccessible = '',
      sharingPlan = '',
      databaseControlled = '',
      databaseOpen = '',
      onGoingProcess = '',
      describeConsentGroup = '',
      requireMta = '',

    } = this.state.formData.consentExtraProps;


    return (
      div({}, [
        h2({ className: "stepTitle" }, ["Consent Group: " + this.props.consentKey]),
        ConfirmationDialog({
          closeModal: this.closeModal,
          show: this.state.showDialog,
          handleOkAction: this.rejectConsentGroup,
          title: 'Remove Confirmation',
          bodyText: 'Are you sure yo want to remove this consent group?',
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

        Panel({ title: "Consent Group Details" }, [
          InputFieldText({
            id: "inputConsentGroupName",
            name: "consentGroupName",
            label: "Consent Group Name",
            disabled: !this.state.readOnly,
            value: consent + " / " + protocol,
            currentValue: this.state.current.consentForm.summary,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly
          }),
          InputFieldText({
            id: "inputInvestigatorLastName",
            name: "consent",
            label: "Last Name of Investigator Listed on the Consent Form",
            value: consent,
            currentValue: this.state.current.consentExtraProps.consent,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly
          }),
          InputFieldText({
            id: "inputInstitutionProtocolNumber",
            name: "protocol",
            label: "Collaborating Institution's Protocol Number",
            value: protocol,
            currentValue: this.state.current.consentExtraProps.protocol,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly
          }),
          InputFieldText({
            id: "inputCollaboratingInstitution",
            name: "collInst",
            label: "Collaborating Institution",
            value: collInst,
            currentValue: this.state.current.consentExtraProps.collInst,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly
          }),
          InputFieldText({
            id: "inputprimaryContact",
            name: "collContact",
            label: "Primary Contact at Collaborating Institution ",
            value: collContact,
            currentValue: this.state.current.consentExtraProps.collContact,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly,
            valueEdited: this.isEmpty(this.state.current.consentExtraProps.collContact) === !this.isEmpty(this.state.formData.consentExtraProps.collContact)
          }),
          InputFieldRadio({
            id: "radioDescribeConsentGroup",
            name: "describeConsentGroup",
            label: "Please choose one of the following to describe this proposed Consent Group: ",
            value: describeConsentGroup,
            currentValue: this.state.current.consentExtraProps.describeConsentGroup,
            optionValues: ["01", "02"],
            optionLabels: [
              "I am informing Broad's ORSP of a new amendment I already submitted to my IRB of record",
              "I am requesting assistance in updating and existing project"
            ],
            onChange: this.handleRadio2Change,
            readOnly: this.state.readOnly
          }),
          InputFieldRadio({
            id: "radioRequireMta",
            name: "requireMta",
            label: span({}, ["Has the ", span({ style: { 'textDecoration': 'underline' } }, ["tech transfer office "]), "of the institution providing samples/data confirmed that an Material or Data Transfer Agreement (MTA/DTA) is needed to transfer the materials/data? "]),
            moreInfo: span({ className: "italic" }, ["(PLEASE NOTE THAT ALL SAMPLES ARRIVING FROM THE DANA FARBER CANCER INSTITUTE NOW REQUIRE AN MTA)"]),
            value: requireMta,
            currentValue: this.state.current.consentExtraProps.requireMta,
            optionValues: ["true", "false", "uncertain"],
            optionLabels: [
              "Yes, the provider does require an MTA/DTA.",
              "No, the provider does not require an MTA/DTA.",
              "Not sure"
            ],
            onChange: this.handleRadio2Change,
            readOnly: this.state.readOnly
          })
        ]),

        Panel({ title: "Sample Collections" }, [

          InputFieldSelect({
            id: "sampleCollection_select",
            label: "Link Sample Collection to " + this.props.projectKey + "*",
            name: 'sampleCollections',
            isDisabled: false,
            options: this.state.sampleCollectionList,
            onChange: this.handleSampleCollectionChange,
            value: this.state.formData.sampleCollections,
            currentValue: this.state.current.sampleCollections,
            placeholder: "Start typing a Sample Collection",
            isMulti: true,
            error: this.state.errors.sampleCollections,
            errorMessage: "Required field",
            readOnly: this.state.readOnly
          }),
        ]),

        Panel({ title: "Sample Collection Date Range" }, [
          div({ className: "row" }, [
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
              InputFieldDatePicker({
                selected: startDate, //this.hasDate("startDate") ? new Date(startDate.substr(0, 4), startDate.substr(5, 2) - 1, startDate.substr(8, 2)) : null,
                value: startDate,
                currentValue: this.state.current.consentExtraProps.startDate,
                name: "startDate",
                label: "Start Date",
                onChange: this.handleChange,
                readOnly: this.state.readOnly
              })
            ]),
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
              InputFieldDatePicker({
                selected: this.addDays(endDate, 1),
                value: endDate,
                currentValue: this.state.current.consentExtraProps.endDate,
                name: "endDate",
                label: "End Date",
                onChange: this.handleChange,
                disabled: (this.state.formData.consentExtraProps.onGoingProcess === "true"),
                readOnly: this.state.readOnly
              })
            ]),
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12 checkbox" + (this.state.readOnly ? ' checkboxReadOnly' : ''), style: { 'marginTop': '32px' } }, [
              input({
                type: 'checkbox',
                id: "onGoingProcess",
                name: "onGoingProcess",
                checked: onGoingProcess === 'true' || onGoingProcess === true,
                onChange:this.handleCheck,
              }),
              label({ id: "lbl_onGoingProcess", htmlFor: "onGoingProcess", className: "regular-checkbox" }, ["Ongoing Process"])
            ])
          ])
        ]),

        Panel({ title: "Institutional Source of Data/Samples and Location" }, [
          InstitutionalSource({
            updateInstitutionalSource: () => { },
            institutionalSources: this.state.formData.instSources,
            currentValue: this.state.current.instSources,
            readOnly: this.state.readOnly
          })
        ]),

        Panel({ title: "International Cohorts" }, [
          div({ isRendered: !this.isEmpty(this.state.formData.consentExtraProps.individualDataSourced), className: "firstRadioGroup" }, [
            InputYesNo({
              id: "radioQuestion1",
              name: "individualDataSourced",
              value: this.state.formData.consentExtraProps.individualDataSourced,
              currentValue: this.state.current.consentExtraProps.individualDataSourced,
              label: span({}, ["Are samples or individual-level data sourced from a country in the European Economic Area? "]),
              readOnly: this.state.readOnly,
              onChange: this.handleExtraPropsInputChange,
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.consentExtraProps.isLinkMaintained) }, [
            InputYesNo({
              id: "radioQuestion2",
              name: "isLinkMaintained",
              value: this.state.formData.consentExtraProps.isLinkMaintained,
              currentValue: this.state.current.consentExtraProps.isLinkMaintained,
              label: span({}, ["Is a link maintained ", span({ className: "normal" }, ["(by anyone) "]), "between samples/data being sent to the Broad and the identities of living EEA subjects?"]),
              readOnly: this.state.readOnly,
              onChange: this.handleExtraPropsInputChange,
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.consentExtraProps.isFeeForService) }, [
            InputYesNo({
              id: "radioQuestion3",
              name: "isFeeForService",
              value: this.state.formData.consentExtraProps.isFeeForService,
              currentValue: this.state.current.consentExtraProps.isFeeForService,
              label: 'Is the Broad work being performed as fee-for-service?',
              readOnly: this.state.readOnly,
              onChange: this.handleExtraPropsInputChange,
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.consentExtraProps.areSamplesComingFromEEAA) }, [
            InputYesNo({
              id: "radioQuestion4",
              name: "areSamplesComingFromEEAA",
              value: this.state.formData.consentExtraProps.areSamplesComingFromEEAA,
              currentValue: this.state.current.consentExtraProps.areSamplesComingFromEEAA,
              label: 'Are samples/data coming directly to the Broad from the EEA?',
              readOnly: this.state.readOnly,
              onChange: this.handleExtraPropsInputChange,
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.consentExtraProps.isCollaboratorProvidingGoodService) }, [
            InputYesNo({
              id: "radioQuestion5",
              name: "isCollaboratorProvidingGoodService",
              value: this.state.formData.consentExtraProps.isCollaboratorProvidingGoodService,
              currentValue: this.state.current.consentExtraProps.isCollaboratorProvidingGoodService,
              label: span({}, ["Is Broad or the EEA collaborator providing goods/services ", span({ className: "normal" }, ["(including routine return of research results) "]), "to EEA subjects, or engaging in ongoing monitoring of them", span({ className: "normal" }, ["(e.g. via use of a FitBit)?"])]),
              readOnly: this.state.readOnly,
              onChange: this.handleExtraPropsInputChange,
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.consentExtraProps.isConsentUnambiguous) }, [
            InputYesNo({
              id: "radioQuestion6",
              name: "isConsentUnambiguous",
              value: this.state.formData.consentExtraProps.isConsentUnambiguous,
              currentValue: this.state.current.consentExtraProps.isConsentUnambiguous,
              label: span({}, ["GDPR does not apply, but a legal basis for transfer must be established. Is consent unambiguous ", span({ className: "normal" }, ["(identifies transfer to the US, and risks associated with less stringent data protections here)?"])]),
              readOnly: this.state.readOnly,
              onChange: this.handleExtraPropsInputChange,
            })
          ])
        ]),

        Panel({ title: "Security" }, [
          InputFieldRadio({
            id: "radioPII",
            name: "pii",
            label: "As part of this project, will Broad receive either personally identifiable information (PII) or protected health information (PHI)? ",
            moreInfo: span({}, ["For a list of what constitutes PII and PHI, ", a({ href: "https://intranet.broadinstitute.org/faq/storing-and-managing-phi", target: "_blank" }, ["visit this link"]), "."]),
            value: this.state.formData.consentExtraProps.pii,
            currentValue: this.state.current.consentExtraProps.pii,
            optionValues: ["true", "false"],
            optionLabels: [
              "Yes",
              "No"
            ],
            readOnly: this.state.readOnly,
            onChange: this.handleRadio2Change,
          }),
          InputFieldRadio({
            id: "radioCompliance",
            name: "compliance",
            label: span({}, ["Are you bound by any regulatory compliance ", span({ className: 'normal' }, ["(FISMA, CLIA, etc.)"]), "?"]),
            value: this.state.formData.consentExtraProps.compliance,
            currentValue: this.state.current.consentExtraProps.compliance,
            optionValues: ["true", "false", "uncertain"],
            optionLabels: [
              "Yes",
              "No",
              "Uncertain"
            ],
            readOnly: this.state.readOnly,
            onChange: this.handleRadio2Change,
          }),
          InputFieldText({
            isRendered: this.state.formData.consentExtraProps.compliance === "true",
            id: "inputCompliance",
            name: "textCompliance",
            label: "Add regulatory compliance",
            value: textCompliance,
            currentValue: this.state.current.consentExtraProps.textCompliance,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly
          }),
          InputFieldRadio({
            id: "radioSensitive",
            name: "sensitive",
            label: span({}, ["Is this data ", span({ className: 'italic' }, ["“sensitive” "]), "for any reason?"]),
            value: this.state.formData.consentExtraProps.sensitive,
            currentValue: this.state.current.consentExtraProps.sensitive,
            optionValues: ["true", "false", "uncertain"],
            optionLabels: [
              "Yes",
              "No",
              "Uncertain"
            ],
            readOnly: this.state.readOnly,
            onChange: this.handleRadio2Change,
          }),
          InputFieldText({
            isRendered: this.state.formData.consentExtraProps.sensitive === "true",
            id: "inputSensitive",
            name: "textSensitive",
            label: "Please explain",
            value: textSensitive,
            currentValue: this.state.current.consentExtraProps.textSensitive,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly
          }),
          InputFieldRadio({
            id: "radioAccessible",
            name: "accessible",
            label: span({}, ["Will your data be accessible on the Internet ", span({ className: 'normal' }, ["(even if authenticated)"]), "?"]),
            value: this.state.formData.consentExtraProps.accessible,
            currentValue: this.state.current.consentExtraProps.accessible,
            optionValues: ["true", "false", "uncertain"],
            optionLabels: [
              "Yes",
              "No",
              "Uncertain"
            ],
            readOnly: this.state.readOnly,
            onChange: this.handleRadio2Change,
          }),
          InputFieldText({
            isRendered: this.state.formData.consentExtraProps.accessible === "true",
            id: "inputAccessible",
            name: "textAccessible",
            label: "Please explain",
            value: textAccessible,
            currentValue: this.state.current.consentExtraProps.textAccessible,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly
          })
        ]),

        Panel({ title: "Data Sharing" }, [
          InputFieldRadio({
            id: "radioSharingPlan",
            name: "sharingPlan",
            label: "What is your Data Sharing plan?",
            moreInfo: "",
            optionValues: ["controlled", "open", "none", "undetermined"],
            optionLabels: ["Controlled Access", "Open Access", "No Sharing", "Data Sharing plan not yet determined"],
            value: this.state.formData.consentExtraProps.sharingPlan,
            currentValue: this.state.current.consentExtraProps.sharingPlan,
            onChange: this.handleRadio2Change,
            readOnly: this.state.readOnly
          }),
          InputFieldText({
            isRendered: this.state.formData.consentExtraProps.sharingPlan === "controlled",
            id: "inputDatabaseControlled",
            name: "databaseControlled",
            label: "Name of Database(s) ",
            moreInfo: "(Data Use LetterNR/link, consent or waiver of consent)",
            value: databaseControlled,
            currentValue: this.state.current.consentExtraProps.databaseControlled,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly
          }),
          InputFieldText({
            isRendered: this.state.formData.consentExtraProps.sharingPlan === "open",
            id: "inputDatabaseOpen",
            name: "databaseOpen",
            label: "Name of Database(s) ",
            moreInfo: "(Data Use LetterNR/link, consent or waiver of consent, or documentation from source that consent is not available but samples were appropriately collected and publicly available)",
            value: databaseOpen,
            currentValue: this.state.current.databaseOpen,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly
          })
        ]),
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
            // disabled: ,
            isRendered: this.state.readOnly === false
          }, ["Submit Edits"]),

          /*visible for Admin in readOnly mode and if there are changes to review*/
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.approveEdits(),
            disabled: this.state.disableApproveButton,
            isRendered: this.isAdmin && this.state.reviewSuggestion
          }, ["Approve Edits"]),

          /*visible for every user in readOnly mode and if there are changes to review*/
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.discardEdits(),
            disabled: this.state.disableApproveButton,
            isRendered: this.isAdmin && this.state.reviewSuggestion
          }, ["Discard Edits"]),

          /*visible for Admin in readOnly mode and if the consent group is in "pending" status*/
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.approveConsentGroup,
            isRendered: this.state.consentForm.approvalStatus !== 'Approved' && this.state.isAdmin,
            disabled: this.state.disableApproveButton
          }, ["Approve"]),

          /*visible for Admin in readOnly mode and if the consent group is in "pending" status*/
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.handleDialog,
            disabled: this.state.disableApproveButton,
            isRendered: this.state.consentForm.approvalStatus !== 'Approved' && this.state.isAdmin,
          }, ["Reject"])
        ])
      ])
    )
  }
}

export default ConsentGroupReview;
