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
import { ConsentGroup } from "../util/ajax";


class ConsentGroupReview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      consentForm: {
        summary: ''
      },
      consentExtraProps: {
        consent: '',
        protocol: '',
        collInst: '',
        collContact: '',
        describeConsentGroup: '',
        requireMta: '',
        startDate: '',
        endDate: '',
        onGoingProcess: '',
        pii: '',
        accessible: '',
        compliance: '',
        sensitive: '',
        textAccessible: '',
        textCompliance: '',
        textSensitive: '',
        individualDataSourced: '',
        instSources: []
      }
    }
  }

  componentDidMount() {
    ConsentGroup.getConsentGroup(this.props.consentGroupUrl, this.props.consentKey).then(
      element =>{
        this.setState(prev => {
          prev.consentForm = element.data.issue;
          prev.consentExtraProps = element.data.extraProperties;
          if (element.data.collectionLinks !== undefined) {
            prev.sampleCollectionLinks = element.data.collectionLinks;
          }
          if (element.data.sampleCollections !== undefined) {
            prev.sampleCollections = element.data.sampleCollections;
          }
          if (element.data.extraProperties.institutionalSources !== undefined) {
            prev.instSources = JSON.parse(element.data.extraProperties.institutionalSources);
          }
          return prev;
        })
        }
    );
  }

  parseBool() {
    if (this.state.consentExtraProps.onGoingProcess !== undefined) {
        let stringValue = this.state.consentExtraProps.onGoingProcess;
        let boolValue = stringValue.toLowerCase() == 'true' ? true : false;
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
    const data = { approvalStatus: "Approved", fundings : [{ identifier: "identi", source: { label:"Purchase Order", value:"purchase_order"}, sponsor: "sponsor"}]}
    ConsentGroup.approve(this.props.approveConsentGroupUrl, this.props.consentKey, data).then(response => console.log("Respuesta ", response));
  }

  render() {

    const headers = [{name: 'ID', value: 'id'}, {name: 'Name', value: 'name'}, {name: 'Category', value: 'category'}, {name: 'Group', value: 'groupName'}];
    const endDate = this.state.consentExtraProps.endDate;
    const startDate = this.state.consentExtraProps.startDate;
    return (
      div({}, [
        h2({ className: "stepTitle" }, ["Consent Group: " + this.props.consentKey]),

        Panel({ title: "Consent Group Details" }, [
          InputFieldText({
            id: "inputConsentGroupName",
            name: "consentGroupName",
            label: "Consent Group Name",
            value: this.state.consentForm.summary,
            onChange: () => {},
            readOnly: true
          }),
          InputFieldText({
            id: "inputInvestigatorLastName",
            name: "investigatorLastName",
            label: "Last Name of Investigator Listed on the Consent Form",
            value: this.state.consentExtraProps.consent,
            onChange: () => {},
            readOnly: true
          }),
          InputFieldText({
            id: "inputInstitutionProtocolNumber",
            name: "institutionProtocolNumber",
            label: "Collaborating Institution's Protocol Number",
            value: this.state.consentExtraProps.protocol,
            onChange: () => {},
            readOnly: true
          }),
          InputFieldText({
            id: "inputCollaboratingInstitution",
            name: "collaboratingInstitution",
            label: "Collaborating Institution",
            value: this.state.consentExtraProps.collInst,
            onChange: () => {},
            readOnly: true
          }),
          InputFieldText({
            id: "inputprimaryContact",
            name: "primaryContact",
            label: "Primary Contact at Collaborating Institution ",
            value: this.state.consentExtraProps.collContact,
            onChange: () => {},
            readOnly: true
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
            onChange: () => {},
            readOnly: true
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
            onChange: () => {},
            readOnly: true
          })
        ]),

        Panel({ title: "Sample Collections" }, [
          Table({
              headers: headers,
              data: this.state.sampleCollections,
              search: false,
              pagination: false,
              sizePerPage: 15,
          })
        ]),

        Panel({ title: "Sample Collection Date Range" }, [
          div({ className: "row" }, [
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
              InputFieldDatePicker({
                selected: this.hasDate("startDate") ? new Date(startDate.substr(0,4), startDate.substr(5,2) - 1, startDate.substr(8,2)) : null,
                name: "startDate",
                label: "Start Date",
                onChange: () => {},
                readOnly: true
              })
            ]),
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
              InputFieldDatePicker({
                startDate: this.startDate,
                name: "endDate",
                label: "End Date",
                selected: this.hasDate("endDate") ? new Date(endDate.substr(0,4), endDate.substr(5,2) - 1, endDate.substr(8,2)) : null,
                onChange: () => {},
                disabled: (this.state.consentExtraProps.onGoingProcess === "true"),
                readOnly: true
              })
            ]),
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12 checkbox checkboxReadOnly", style: { 'marginTop': '32px' } }, [
              input({
                type: 'checkbox',
                id: "onGoingProcess",
                name: "onGoingProcess",
                checked: this.parseBool(),
                onChange: () => {},
                readOnly: true
              }),
              label({ id: "lbl_onGoingProcess", htmlFor: "onGoingProcess", className: "regular-checkbox" }, ["Ongoing Process"])
            ])
          ])
        ]),

        Panel({ title: "Institutional Source of Data/Samples and Location" }, [
          InstitutionalSource({
            updateInstitutionalSource: () => {},
            institutionalSources: this.state.instSources,
            readOnly: true
          })
        ]),

        Panel({ title: "International Cohorts" }, [
          div({ isRendered: !this.isEmpty(this.state.consentExtraProps.individualDataSourced), className: "firstRadioGroup" }, [
            InputYesNo({
              id: "radioQuestion1",
              value: this.state.consentExtraProps.individualDataSourced,
              label: span({}, ["Are samples or individual-level data sourced from a country in the European Economic Area? "]),
              readOnly: true
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.consentExtraProps.isLinkMaintained) }, [
            InputYesNo({
              id: "radioQuestion2",
              value: this.state.consentExtraProps.isLinkMaintained,
              label: span({}, ["Is a link maintained ", span({ className: "normal" }, ["(by anyone) "]), "between samples/data being sent to the Broad and the identities of living EEA subjects?"]),
              readOnly: true
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.consentExtraProps.isFeeForService) }, [
            InputYesNo({
              id: "radioQuestion3",
              value: this.state.consentExtraProps.isFeeForService,
              label: 'Is the Broad work being performed as fee-for-service?',
              readOnly: true
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.consentExtraProps.areSamplesComingFromEEAA) }, [
            InputYesNo({
              id: "radioQuestion4",
              value: this.state.consentExtraProps.areSamplesComingFromEEAA,
              label: 'Are samples/data coming directly to the Broad from the EEA?',
              readOnly: true
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.consentExtraProps.isCollaboratorProvidingGoodService) }, [
            InputYesNo({
              id: "radioQuestion5",
              value: this.state.consentExtraProps.isCollaboratorProvidingGoodService,
              label: span({}, ["Is Broad or the EEA collaborator providing goods/services ", span({ className: "normal" }, ["(including routine return of research results) "]), "to EEA subjects, or engaging in ongoing monitoring of them", span({ className: "normal" }, ["(e.g. via use of a FitBit)?"])]),
              readOnly: true
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.consentExtraProps.isConsentUnambiguous) }, [
            InputYesNo({
              id: "radioQuestion6",
              value: this.state.consentExtraProps.isConsentUnambiguous,
              label: span({}, ["GDPR does not apply, but a legal basis for transfer must be established. Is consent unambiguous ", span({ className: "normal" }, ["(identifies transfer to the US, and risks associated with less stringent data protections here)?"])]),
              readOnly: true
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
            readOnly: true
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
            readOnly: true
          }),
          InputFieldText({
            isRendered: this.state.consentExtraProps.compliance === "true",
            id: "inputCompliance",
            name: "textCompliance",
            label: "Add regulatory compliance",
            value: this.state.consentExtraProps.textCompliance,
            onChange: () => {},
            readOnly: true
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
            readOnly: true
          }),
          InputFieldText({
            isRendered: this.state.consentExtraProps.sensitive === "true",
            id: "inputSensitive",
            name: "textSensitive",
            label: "Please explain",
            value: this.state.consentExtraProps.textSensitive,
            onChange: () => {},
            readOnly: true
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
            readOnly: true
          }),
          InputFieldText({
            isRendered: this.state.consentExtraProps.accessible === "true",
            id: "inputAccessible",
            name: "textAccessible",
            label: "Please explain",
            value: this.state.consentExtraProps.textAccessible,
            onChange: () => {},
            readOnly: true
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
            onChange: () => {},
            readOnly: true
          }),
          InputFieldText({
            isRendered: this.state.consentExtraProps.sharingPlan === "controlled",
            id: "inputDatabaseControlled",
            name: "databaseControlled",
            label: "Name of Database(s) ",
            moreInfo: "(Data Use LetterNR/link, consent or waiver of consent)",
            value: this.state.consentExtraProps.databaseControlled,
            onChange: () => {},
            readOnly: true
          }),
          InputFieldText({
            isRendered: this.state.consentExtraProps.sharingPlan === "open",
            id: "inputDatabaseOpen",
            name: "databaseOpen",
            label: "Name of Database(s) ",
            moreInfo: "(Data Use LetterNR/link, consent or waiver of consent, or documentation from source that consent is not available but samples were appropriately collected and publicly available)",
            value: this.state.consentExtraProps.databaseOpen,
            onChange: () => {},
            readOnly: true
          })
        ]),
        div({ className: "buttonContainer", style: { 'marginRight': '0' } }, [
          button({ className: "btn buttonPrimary floatRight", onClick: this.approveConsentGroup, isRendered: true }, ["Approve"]),
        ])
      ])
    )
  }
}

export default ConsentGroupReview;