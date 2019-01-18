import { Component } from 'react';
import { hh, p, div, h2, input, label, span, a, button } from 'react-hyperscript-helpers';

import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { InputFieldSelect } from '../components/InputFieldSelect';
import { InputFieldDatePicker } from '../components/InputFieldDatePicker';
import { InputYesNo } from '../components/InputYesNo';
import { InstitutionalSource } from '../components/InstitutionalSource';
import { Table } from '../components/Table';
import { ConsentGroup, SampleCollections, User } from "../util/ajax";


class ConsentGroupReview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      readOnly: true,
      isAdmin: false,
      disableApproveButton: false,
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
      current: {},
      suggestions: {},
      suggestionsCopy: {}
    }
  }

  componentDidMount() {
    this.isCurrentUserAdmin();
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

            this.setState(prev => {
              prev.sampleCollectionList = sampleCollections;
              prev.consentForm = element.data.issue;
              prev.consentExtraProps = element.data.extraProperties;
              if (element.data.collectionLinks !== undefined) {
                prev.sampleCollectionLinks = element.data.collectionLinks;
              }
              if (element.data.sampleCollections !== undefined) {
                prev.sampleCollections = element.data.sampleCollections.map(sample => {
                  return ({
                    key: sample.id,
                    value: sample.collectionId,
                    label: sample.collectionId + ": " + sample.name + " ( " + sample.category + " )"
                  });

                });

              }
              if (element.data.extraProperties.institutionalSources !== undefined) {
                prev.instSources = JSON.parse(element.data.extraProperties.institutionalSources);
              }
              prev.current = JSON.parse(JSON.stringify(element.data.extraProperties));
              prev.suggestions = {};
              prev.suggestionsCopy = JSON.parse(JSON.stringify(element.data.extraProperties));
              return prev;
            });

          }
        );

      }
    );
  }

  parseBool() {
    if (this.state.consentExtraProps.onGoingProcess !== undefined) {
      let stringValue = this.state.consentExtraProps.onGoingProcess;
      let boolValue = stringValue.toLowerCase() == 'true' ? true : false;
      console.log("parseBool: ", boolValue);
      return boolValue;
    }
  }

  isEmpty(value) {
    return value === '' || value === null || value === undefined;
  }

  hasDate(date) {
    if (this.state.consentExtraProps[date] !== undefined)
      return true
  }

  approveConsentGroup = () => {
    this.setState({ disableApproveButton: true })
    const data = { approvalStatus: "Approved" }
    ConsentGroup.approve(this.props.approveConsentGroupUrl, this.props.consentKey, data).then(
      () =>
        this.setState(prev => {
          prev.consentForm.approvalStatus = data.approvalStatus;
          return prev;
        })
    );
  }

  approveRevision = (e) => () => {
    this.setState({ disableApproveButton: true })
    const data = { projectReviewApproved: true }
    Project.addExtraProperties(this.props.addExtraPropUrl, this.props.projectKey, data).then(
      () => this.setState(prev => {
        prev.projectExtraProps.projectReviewApproved = true;
        return prev;
      })
    );
  }

  isCurrentUserAdmin() {
    User.isCurrentUserAdmin(this.props.isAdminUrl).then(
      resp => this.setState({ isAdmin: resp.data.isAdmin })
    );
  }

  discardEdits = (e) => () => {

  }

  approveEdits = (e) => () => {

  }

  enableEdit = (e) => () => {
    this.setState({
      readOnly: false
    });
  }

  cancelEdit = (e) => () => {
    this.setState({
      formData: this.state.suggestionsCopy,
      readOnly: true
    });
  }

  submitEdit = (e) => () => {
    this.setState({
      readOnly: true
    });
  }

  handleSampleCollectionChange = () => (data) => {
    this.setState(prev => {
      prev.sampleCollections = data;
      return prev;
    }); //, () => this.props.updateForm(this.state.formData, "sampleCollections"));
    //this.props.removeErrorMessage();
  };

  handleCheck = (e) => {
    console.log('handleCheck: ', this.state.consentExtraProps.onGoingProcess, e.target.checked);

    this.setState(prev => {
      prev.consentExtraProps.onGoingProcess = !this.state.consentExtraProps.onGoingProcess;
      prev.endDate = null;
      return prev;
    }); // , () => this.props.updateForm(this.state.formData, "onGoingProcess"));
    //this.props.removeErrorMessage();
  };

  handleUpdateinstitutionalSources = (updated, field) => {
    this.setState(prev => {
      prev.institutionalSources = updated;
      return prev;
    }); //, () => this.props.updateForm(this.state.formData, field.concat("Institutional")));
    // this.props.removeErrorMessage();
  };

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev[field] = value;
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
      prev.consentExtraProps[field] = value;
      return prev;
    }); //, () => {
    //   this.props.updateForm(this.state.formData, field);
    //   this.props.removeErrorMessage();
    // })
  };

  handleChange = (id) => (date) => {
    this.setState(prev => {
      prev.consentExtraProps[id] = date;
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
      prev.formData[field] = value;
      return prev;
    }); //, () => this.props.updateForm(this.state.formData, field));
    // this.props.removeErrorMessage();
  };


  render() {

    const headers = [{ name: 'ID', value: 'id' }, { name: 'Name', value: 'name' }, { name: 'Category', value: 'category' }, { name: 'Group', value: 'groupName' }];
    // const endDate = this.state.consentExtraProps.endDate;
    // const startDate = this.state.consentExtraProps.startDate;

    const { startDate = null, endDate = null } = this.state.consentExtraProps;

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
      databaseOpen = ''
    } = this.state.consentExtraProps;


    console.log('---- RENDER ----', this.state);

    return (
      div({}, [
        h2({ className: "stepTitle" }, ["Consent Group: " + this.props.consentKey]),
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
            value: this.state.consentForm.summary,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly
          }),
          InputFieldText({
            id: "inputInvestigatorLastName",
            name: "investigatorLastName",
            label: "Last Name of Investigator Listed on the Consent Form",
            value: consent,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly
          }),
          InputFieldText({
            id: "inputInstitutionProtocolNumber",
            name: "institutionProtocolNumber",
            label: "Collaborating Institution's Protocol Number",
            value: protocol,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly
          }),
          InputFieldText({
            id: "inputCollaboratingInstitution",
            name: "collaboratingInstitution",
            label: "Collaborating Institution",
            value: collInst,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly
          }),
          InputFieldText({
            id: "inputprimaryContact",
            name: "primaryContact",
            label: "Primary Contact at Collaborating Institution ",
            value: collContact,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly
          }),
          InputFieldRadio({
            id: "radioDescribeConsentGroup",
            name: "describeConsentGroup",
            label: "Please choose one of the following to describe this proposed Consent Group: ",
            value: this.state.consentExtraProps.describeConsentGroup,
            optionValues: ["01", "02"],
            optionLabels: [
              "I am informing Broad's ORSP of a new amendment I already submitted to my IRB of record",
              "I am requesting assistance in updating and existing project"
            ],
            onChange: () => { },
            readOnly: this.state.readOnly
          }),
          InputFieldRadio({
            id: "radioRequireMta",
            name: "requireMta",
            label: span({}, ["Has the ", span({ style: { 'textDecoration': 'underline' } }, ["tech transfer office "]), "of the institution providing samples/data confirmed that an Material or Data Transfer Agreement (MTA/DTA) is needed to transfer the materials/data? "]),
            moreInfo: span({ className: "italic" }, ["(PLEASE NOTE THAT ALL SAMPLES ARRIVING FROM THE DANA FARBER CANCER INSTITUTE NOW REQUIRE AN MTA)"]),
            value: this.state.consentExtraProps.requireMta,
            optionValues: ["true", "false", "uncertain"],
            optionLabels: [
              "Yes, the provider does require an MTA/DTA.",
              "No, the provider does not require an MTA/DTA.",
              "Not sure"
            ],
            onChange: () => { },
            readOnly: this.state.readOnly
          })
        ]),

        Panel({ title: "Sample Collections" }, [

          InputFieldSelect({
            id: "sampleCollection_select",
            label: "Link Sample Collection to " + this.props.projectKey + "*",
            isDisabled: false,
            options: this.state.sampleCollectionList,
            onChange: this.handleSampleCollectionChange,
            value: this.state.sampleCollections,
            placeholder: "Start typing a Sample Collection",
            isMulti: true,
            error: this.state.errors.sampleCollections,
            errorMessage: "Required field"
          }),



          // Table({
          //   headers: headers,
          //   data: this.state.sampleCollections,
          //   search: false,
          //   pagination: false,
          //   sizePerPage: 15,
          // })
        ]),

        Panel({ title: "Sample Collection Date Range" }, [
          div({ className: "row" }, [
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
              InputFieldDatePicker({
                selected: startDate, //this.hasDate("startDate") ? new Date(startDate.substr(0, 4), startDate.substr(5, 2) - 1, startDate.substr(8, 2)) : null,
                name: "startDate",
                label: "Start Date",
                onChange: this.handleChange,
                readOnly: this.state.readOnly
              })
            ]),
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
              InputFieldDatePicker({
                startDate: this.startDate,
                name: "endDate",
                label: "End Date",
                selected: endDate, // this.hasDate("endDate") ? new Date(endDate.substr(0, 4), endDate.substr(5, 2) - 1, endDate.substr(8, 2)) : null,
                onChange: this.handleChange,
                disabled: (this.state.consentExtraProps.onGoingProcess === "true"),
                readOnly: this.state.readOnly
              })
            ]),
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12 checkbox checkboxReadOnly", style: { 'marginTop': '32px' } }, [
              input({
                type: 'checkbox',
                id: "onGoingProcess",
                name: "onGoingProcess",
                checked: this.state.consentExtraProps.onGoingProcess === 'true' || this.state.consentExtraProps.onGoingProcess === true,
                onClick: this.handleCheck,
                onChange: (e) => { console.log(e.target.name, e.target.checked) }
                // readOnly: this.state.readOnly
              }),
              label({ id: "lbl_onGoingProcess", htmlFor: "onGoingProcess", className: "regular-checkbox" }, ["Ongoing Process"])
            ])
          ])
        ]),

        Panel({ title: "Institutional Source of Data/Samples and Location" }, [
          InstitutionalSource({
            updateInstitutionalSource: () => { },
            institutionalSources: this.state.instSources,
            readOnly: this.state.readOnly
          })
        ]),

        Panel({ title: "International Cohorts" }, [
          div({ isRendered: !this.isEmpty(this.state.consentExtraProps.individualDataSourced), className: "firstRadioGroup" }, [
            InputYesNo({
              id: "radioQuestion1",
              value: this.state.consentExtraProps.individualDataSourced,
              label: span({}, ["Are samples or individual-level data sourced from a country in the European Economic Area? "]),
              readOnly: this.state.readOnly,
              onChange: this.handleExtraPropsInputChange,
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.consentExtraProps.isLinkMaintained) }, [
            InputYesNo({
              id: "radioQuestion2",
              value: this.state.consentExtraProps.isLinkMaintained,
              label: span({}, ["Is a link maintained ", span({ className: "normal" }, ["(by anyone) "]), "between samples/data being sent to the Broad and the identities of living EEA subjects?"]),
              readOnly: this.state.readOnly,
              onChange: this.handleExtraPropsInputChange,
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.consentExtraProps.isFeeForService) }, [
            InputYesNo({
              id: "radioQuestion3",
              value: this.state.consentExtraProps.isFeeForService,
              label: 'Is the Broad work being performed as fee-for-service?',
              readOnly: this.state.readOnly,
              onChange: this.handleExtraPropsInputChange,
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.consentExtraProps.areSamplesComingFromEEAA) }, [
            InputYesNo({
              id: "radioQuestion4",
              value: this.state.consentExtraProps.areSamplesComingFromEEAA,
              label: 'Are samples/data coming directly to the Broad from the EEA?',
              readOnly: this.state.readOnly,
              onChange: this.handleExtraPropsInputChange,
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.consentExtraProps.isCollaboratorProvidingGoodService) }, [
            InputYesNo({
              id: "radioQuestion5",
              value: this.state.consentExtraProps.isCollaboratorProvidingGoodService,
              label: span({}, ["Is Broad or the EEA collaborator providing goods/services ", span({ className: "normal" }, ["(including routine return of research results) "]), "to EEA subjects, or engaging in ongoing monitoring of them", span({ className: "normal" }, ["(e.g. via use of a FitBit)?"])]),
              readOnly: this.state.readOnly,
              onChange: this.handleExtraPropsInputChange,
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.consentExtraProps.isConsentUnambiguous) }, [
            InputYesNo({
              id: "radioQuestion6",
              value: this.state.consentExtraProps.isConsentUnambiguous,
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
            value: this.state.consentExtraProps.pii,
            optionValues: ["true", "false"],
            optionLabels: [
              "Yes",
              "No"
            ],
            readOnly: this.state.readOnly
          }),
          InputFieldRadio({
            id: "radioCompliance",
            name: "compliance",
            label: span({}, ["Are you bound by any regulatory compliance ", span({ className: 'normal' }, ["(FISMA, CLIA, etc.)"]), "?"]),
            value: this.state.consentExtraProps.compliance,
            optionValues: ["true", "false", "uncertain"],
            optionLabels: [
              "Yes",
              "No",
              "Uncertain"
            ],
            readOnly: this.state.readOnly
          }),
          InputFieldText({
            isRendered: this.state.consentExtraProps.compliance === "true",
            id: "inputCompliance",
            name: "textCompliance",
            label: "Add regulatory compliance",
            value: textCompliance,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly
          }),
          InputFieldRadio({
            id: "radioSensitive",
            name: "sensitive",
            label: span({}, ["Is this data ", span({ className: 'italic' }, ["“sensitive” "]), "for any reason?"]),
            value: this.state.consentExtraProps.sensitive,
            optionValues: ["true", "false", "uncertain"],
            optionLabels: [
              "Yes",
              "No",
              "Uncertain"
            ],
            readOnly: this.state.readOnly
          }),
          InputFieldText({
            isRendered: this.state.consentExtraProps.sensitive === "true",
            id: "inputSensitive",
            name: "textSensitive",
            label: "Please explain",
            value: textSensitive,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly
          }),
          InputFieldRadio({
            id: "radioAccessible",
            name: "accessible",
            label: span({}, ["Will your data be accessible on the Internet ", span({ className: 'normal' }, ["(even if authenticated)"]), "?"]),
            value: this.state.consentExtraProps.accessible,
            optionValues: ["true", "false", "uncertain"],
            optionLabels: [
              "Yes",
              "No",
              "Uncertain"
            ],
            readOnly: this.state.readOnly
          }),
          InputFieldText({
            isRendered: this.state.consentExtraProps.accessible === "true",
            id: "inputAccessible",
            name: "textAccessible",
            label: "Please explain",
            value: textAccessible,
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
            value: this.state.consentExtraProps.sharingPlan,
            onChange: () => { },
            readOnly: this.state.readOnly
          }),
          InputFieldText({
            isRendered: this.state.consentExtraProps.sharingPlan === "controlled",
            id: "inputDatabaseControlled",
            name: "databaseControlled",
            label: "Name of Database(s) ",
            moreInfo: "(Data Use LetterNR/link, consent or waiver of consent)",
            value: databaseControlled,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly
          }),
          InputFieldText({
            isRendered: this.state.consentExtraProps.sharingPlan === "open",
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
            isRendered: this.isAdmin && this.state.formData.projectExtraProps.projectReviewApproved
          }, ["Approve Edits"]),

          /*visible for every user in readOnly mode and if there are changes to review*/
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.discardEdits(),
            disabled: this.state.disableApproveButton,
            isRendered: this.isAdmin && this.state.formData.projectExtraProps.projectReviewApproved
          }, ["Discard Edits"]),

          /*visible for Admin in readOnly mode and if this is the first revision to approve the project*/
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.approveConsentGroup,
            isRendered: this.state.consentForm.approvalStatus !== 'Approved' && this.state.isAdmin,
            disabled: this.state.disableApproveButton
          }, ["Approve"]),
        ])
      ])
    )
  }
}

export default ConsentGroupReview;
