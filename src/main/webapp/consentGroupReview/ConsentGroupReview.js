import { Component } from 'react';
import { hh, p, div, h1, input, label, span, a } from 'react-hyperscript-helpers';

import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { InputFieldSelect } from '../components/InputFieldSelect';
import { InputFieldDatePicker } from '../components/InputFieldDatePicker';
import { InputYesNo } from '../components/InputYesNo';
import { InstitutionalSource } from '../components/InstitutionalSource';
import { ConsentGroup } from "../util/ajax";


class ConsentGroupReview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      consentForm: {
      summary: ''
      },
      consentExtraProps:{
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
      textSensitive: ''
      }
    }
  }

  componentDidMount() {
    console.log("Consent Key", this.props.consentKey);

    ConsentGroup.getConsentGroup(this.props.consentGroupUrl, this.props.consentKey).then(
        element =>
        this.setState(prev => {
            prev.consentForm = element.data.issue;
            prev.consentExtraProps = element.data.extraProperties;
            prev.collectionLinks = element.data.collectionLinks;
        return prev;
        }, ()=> console.log("Consent Review State ", this.state))
    );
  }

  parseBool(){
    let stringValue = this.state.consentExtraProps.onGoingProcess;
    let boolValue = stringValue.toLowerCase() == 'true' ? true : false;
    return boolValue;
  }

  render() {
    const endDate = this.state.consentExtraProps.endDate;
    return (
        div({}, [
          h1({},["Consent Group: " + this.props.consentKey]),
          Panel({ title: "Consent Group Details ", moreInfo: "" }, [

            InputFieldText({
                id: "inputConsentGroupName",
                name: "consentGroupName",
                label: "Consent Group Name",
                value: this.state.consentForm.summary,
                readOnly: true,
                disabled: true
            }),

            InputFieldText({
                id: "inputInvestigatorLastName",
                name: "investigatorLastName",
                label: "Last Name of Investigator Listed on the Consent Form",
                value: this.state.consentExtraProps.consent,
                readOnly: true,
                disabled: true
            }),

            InputFieldText({
                id: "inputInstitutionProtocolNumber",
                name: "institutionProtocolNumber",
                label: "Collaborating Institution's Protocol Number",
                value: this.state.consentExtraProps.protocol,
                readOnly: true,
                disabled: true
            }),

            InputFieldText({
                id: "inputCollaboratingInstitution",
                name: "collaboratingInstitution",
                label: "Collaborating Institution",
                value: this.state.consentExtraProps.collInst,
                readOnly: true,
                disabled: true
            }),

            InputFieldText({
                id: "inputprimaryContact",
                name: "primaryContact",
                label: "Primary Contact at Collaborating Institution ",
                value: this.state.consentExtraProps.collContact,
                readOnly: true,
                disabled: true
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
                readOnly: true
            }),

            InputYesNo({
                id: "radioRequireMta",
                name: "requireMta",
                label: span({}, ["Has the ", span({ style: { 'textDecoration': 'underline' } }, ["tech transfer office "]), "of the institution providing samples/data confirmed that an Material or Data Transfer Agreement (MTA/DTA) is needed to transfer the materials/data? "]),
                moreInfo: span({ className: "italic" }, ["(PLEASE NOTE THAT ALL SAMPLES ARRIVING FROM THE DANA FARBER CANCER INSTITUTE NOW REQUIRE AN MTA)"]),
                value: this.state.consentExtraProps.requireMta,
                readOnly: true
            })
          ]),

          Panel({
            title: "Sample Collection Date Range",
            moreInfo: "(if data will be deposited to GEO, dbGaP, or other federal repository. Optional)",
          }, [
              div({ className: "row" }, [
                div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                  InputFieldDatePicker({
                    selected: new Date(this.state.consentExtraProps.startDate),
                    name: "startDate",
                    label: "Start Date",
                    onChange: () => console.log("startDate"),
                    readOnly: true
                  })
                ]),
                div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                  InputFieldDatePicker({
                    startDate: this.startDate,
                    name: "endDate",
                    label: "End Date",
                    selected: (endDate === undefined || endDate === '') ? null : new Date(endDate),
                    onChange: () => console.log("endDate"),
                    disabled: (this.state.consentExtraProps.onGoingProcess === "true"),
                    readOnly: true
                  })
                ]),
                div({ className: "col-lg-4 col-md-4 col-sm-4 col-12 checkbox", style: { 'marginTop': '32px' } }, [
                  input({
                    type: 'checkbox',
                    id: "onGoingProcess",
                    name: "onGoingProcess",
                    checked: this.parseBool(),
                    onChange: () => console.log("checkbox"),
                    readOnly: true
                  }),
                  label({ id: "lbl_onGoingProcess", htmlFor: "onGoingProcess", className: "regular-checkbox" }, ["Ongoing Process"])
                ])
              ])
          ]),

          Panel({ title: "Institutional Source of Data/Samples and Location" }, [
            InstitutionalSource({
              updateInstitutionalSource: () => console.log("Institutional Sources"),
              institutionalSources: [],
              readOnly: true
            })
          ]),


          Panel({title: "International Cohorts"},[
            p({}, ["International Cohorts Questions"])
          ]),

          Panel({title: "Security"},[

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
              readOnly: true
            })

          ]),

          Panel({title: "Data Sharing"},[

            InputFieldRadio({
              id: "radioSharingPlan",
              name: "sharingPlan",
              label: "What is your Data Sharing plan?",
              moreInfo: "",
              optionValues: ["controlled", "open", "none", "undetermined"],
              optionLabels: ["Controlled Access", "Open Access", "No Sharing", "Data Sharing plan not yet determined"],
              value: this.state.consentExtraProps.sharingPlan,
              onChange: () => console.log("radio"),
              readOnly: true
            }),
            InputFieldText({
              isRendered: this.state.consentExtraProps.sharingPlan === "controlled",
              id: "inputDatabaseControlled",
              name: "databaseControlled",
              label: "Name of Database(s) ",
              moreInfo: "(Data Use LetterNR/link, consent or waiver of consent)",
              value: this.state.consentExtraProps.databaseControlled,
              readOnly: true
            }),
            InputFieldText({
              isRendered: this.state.consentExtraProps.sharingPlan === "open",
              id: "inputDatabaseOpen",
              name: "databaseOpen",
              label: "Name of Database(s) ",
              moreInfo: "(Data Use LetterNR/link, consent or waiver of consent, or documentation from source that consent is not available but samples were appropriately collected and publicly available)",
              value: this.state.consentExtraProps.databaseOpen,
              readOnly: true
            })

          ]),

        ])
    )
  }
}

export default ConsentGroupReview;