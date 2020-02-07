import { Component, React } from 'react';
import { u, hh, span, a, div, label, ul, li } from 'react-hyperscript-helpers';
import { isEmpty } from "../util/Utils";
import './QuestionnaireWorkflow.css';

const sharingTypes = {
    open : "An open/unrestricted repository (such as GEO)",
    controlled: "A controlled-access repository (such as dbGaP or DUOS)",
    both: "Both a controlled-access and an open-access repository",
    noDataSharing: "No data sharing via a repository (data returned to research collaborator only)",
    undetermined: "Data sharing plan not yet determined"
}
export const SecurityReview = hh(class SecurityReview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
    };
  }

  stringAnswer = (current) => {
    let answer = '';
    if (current === 'true' || current === true) {
      answer = 'Yes';
    } else if (current === 'uncertain') {
      answer = 'Uncertain';
    } else if (current === 'false' || current === false) {
      answer = 'No';
    } else if (current === 'null' || current === null || isEmpty(current)) {
      answer = '--';
    }
    return answer
  };

  sharingTypeAnswer = (type) => {
    return sharingTypes[type];
  };

  storeOptions = (store) => {
    const labels = {
      "terra": "Terra",
      "bgp": "Broad Genomics Platform",
      "gcp": "Google Cloud Platform",
      "aws": "Amazon Web Services",
      "bop": "Broad on-prem",
    };
    return labels[store];
  };

  render() {
    const {
      textSharingType = '',
      sharingType = '',
      textCompliance = '',
      compliance = '',
      pii = '',
      phi = '',
      piiDt = '',
      genomicData = '',
      externalAvailability = '',
      publiclyAvailable = '',
      store = '',
      names = '',
      dates = '',
      telephone = '',
      geographicData = '',
      fax = '',
      socialSecurityNumber = '',
      emailAddresses = '',
      medicalNumbers = '',
      accountNumbers = '',
      healthPlanNumbers = '',
      licenseNumbers = '',
      vehicleIdentifiers = '',
      webUrls = '',
      deviceIdentifiers = '',
      internetProtocolAddresses = '',
      facePhotos = '',
      biometricIdentifiers = '',
      uniqueIdentifying = '',
      otherIdentifier = '',
      textOtherIdentifier = ''
    } = this.props.sample;

    const labelStore = !isEmpty(this.storeOptions(store)) ? this.storeOptions(store) : this.props.sample.textStore;
    
    if (this.props.currentStep === this.props.step) {
      return(
        div({}, [
          div({ className: "answerWrapper" }, [
            label({}, ["Where will the data for this project be processed, handled, and stored?"]),
            div({
            }, [labelStore]),
          ]),
          div({ className: "answerWrapper" }, [
            label({}, ["Will your project involve receiving at or distributing from Broad any personally identifiable information (PII), protected health information (PHI), or genomic data? * ",
              span({ className: "normal" }, ["For a list of what constitutes PII and PHI, ", a({ href: "https://intranet.broadinstitute.org/faq/storing-and-managing-phi", className: "link", target: "_blank" }, ["visit this link"]), "."])]),
            div({
            }, [this.stringAnswer(pii)]),
          ]),          
          div({ className: "answerWrapper", isRendered: !isEmpty(pii) && pii === "true" }, [
            label({}, ["Which of these types of data does your project involve? "]),
            ul({key: "involvedPII"}, [
              li({key: "pii"}, [
                span({className: "bold"}, ['PII']), ': ' ,  this.stringAnswer(piiDt)
              ]),
              li({key: "phi"}, [
                span({className: "bold"}, ['PHI']), ': ' ,  this.stringAnswer(phi)
              ]),
              li({key: "genomicData"}, [
                span({className: "bold"}, ['Genomic Data']), ': ' ,  this.stringAnswer(genomicData)
              ]),
            ])
          ]),
          div({ className: "answerWrapper", isRendered: piiDt === 'true' || phi === 'true' }, [
            label({}, ["Does your data contain any of the following direct identifiers? "]),
            ul({key: "involvedPII"}, [
              li({key: "names"}, [
                span({className: "bold"}, ['Names']), ': ' ,  this.stringAnswer(names)
              ]),
              li({key: "dates"}, [
                span({className: "bold"}, ['Dates, except year']), ': ' ,  this.stringAnswer(dates)
              ]),
              li({key: "telephone"}, [
                span({className: "bold"}, ['Telephone numbers']), ': ' ,  this.stringAnswer(telephone)
              ]),
              li({key: "geographicData"}, [
                span({className: "bold"}, ['Geographic data']), ': ' ,  this.stringAnswer(geographicData)
              ]),
              li({key: "fax"}, [
                span({className: "bold"}, ['FAX numbers']), ': ' ,  this.stringAnswer(fax)
              ]),
              li({key: "socialSecurityNumber"}, [
                span({className: "bold"}, ['Social Security numbers']), ': ' ,  this.stringAnswer(socialSecurityNumber)
              ]),
              li({key: "emailAddresses"}, [
                span({className: "bold"}, ['Email addresses']), ': ' ,  this.stringAnswer(emailAddresses)
              ]),
              li({key: "medicalNumbers"}, [
                span({className: "bold"}, ['Medical record numbers']), ': ' ,  this.stringAnswer(medicalNumbers)
              ]),
              li({key: "accountNumbers"}, [
                span({className: "bold"}, ['Account numbers']), ': ' ,  this.stringAnswer(accountNumbers)
              ]),
              li({key: "healthPlanNumbers"}, [
                span({className: "bold"}, ['Health plan beneficiary numbers']), ': ' ,  this.stringAnswer(healthPlanNumbers)
              ]),
              li({key: "licenseNumbers"}, [
                span({className: "bold"}, ['Certificate/license numbers']), ': ' ,  this.stringAnswer(licenseNumbers)
              ]),
              li({key: "vehicleIdentifiers"}, [
                span({className: "bold"}, ['Vehicle identifiers and serial numbers including license plates']), ': ' ,  this.stringAnswer(vehicleIdentifiers)
              ]),
              li({key: "webUrls"}, [
                span({className: "bold"}, ['Web URLs']), ': ' ,  this.stringAnswer(webUrls)
              ]),
              li({key: "deviceIdentifiers"}, [
                span({className: "bold"}, ['Device identifiers and serial numbers']), ': ' ,  this.stringAnswer(deviceIdentifiers)
              ]),
              li({key: "internetProtocolAddresses"}, [
                span({className: "bold"}, ['Internet protocol addresses']), ': ' ,  this.stringAnswer(internetProtocolAddresses)
              ]),
              li({key: "facePhotos"}, [
                span({className: "bold"}, ['Full face photos and comparable images']), ': ' ,  this.stringAnswer(facePhotos)
              ]),
              li({key: "biometricIdentifiers"}, [
                span({className: "bold"}, ['Biometric identifiers (i.e. retinal scan, fingerprints)']), ': ' ,  this.stringAnswer(biometricIdentifiers)
              ]),
              li({key: "uniqueIdentifying"}, [
                span({className: "bold"}, ['Any unique identifying number or code']), ': ' ,  this.stringAnswer(uniqueIdentifying)
              ]),
              li({key: "otherIdentifier"}, [
                span({className: "bold"}, ['Other']), ': ' ,  this.stringAnswer(otherIdentifier)
              ]),
              li({isRendered: otherIdentifier === 'true', key: "textOtherIdentifier"}, [
                span({className: "bold"}, ['Please describe “other”']), ': ' ,  isEmpty(textOtherIdentifier) ? "--" : textOtherIdentifier
              ])
            ])
          ]),

          div({ className: "answerWrapper", isRendered: !isEmpty(piiDt) || !isEmpty(phi) || !isEmpty(genomicData)  }, [
            label({}, ["Will your project make PII, PHI, or genomic data available to external collaborators via FireCloud/Terra?"]),
            div({
            }, [this.stringAnswer(externalAvailability)]),
          ]),
          div({ className: "answerWrapper" }, [
            label({}, ["Will your project make ", u({},[" any data that is not publicly available"]), " accessible to external collaborators over the internet?", span({ className: 'normal'}, [
              " This includes, for example, putting data in Google Cloud Platform and making it available to external parties, a custom application facing the public internet, or another digital file sharing service."
            ])]),
            div({
            }, [this.stringAnswer(publiclyAvailable)]),
          ]),
        
          div({ className: "answerWrapper" }, [
            label({}, ["Is this project subject to any regulations with specific data security requirements ", span({ className: 'normal' }, ["(FISMA, HIPAA, etc.)"]), "?*"]),
            div({
            }, [this.stringAnswer(compliance)]),
          ]),
          div({ className: "answerWrapper" }, [
            label({}, ["Please specify which regulations must be adhered to below:"]),
            div({
            }, [isEmpty(textCompliance) ? "--" : textCompliance]),
          ]),

          div({ className: "answerWrapper" }, [
            label({}, ["Will the individual level data collected or generated as part of this project be shared to fulfill Broad Institute’s obligation for data sharing for the project via: *"]),
            div({}, [this.sharingTypeAnswer(sharingType)]),
          ]),

          div({ className: "answerWrapper" }, [
            label({}, ["Name of Database(s): "]),
            div({
            }, [isEmpty(textSharingType) ? "--" : textSharingType]),
          ]),
        ])
      )
    } else {
      return ("")
    }
  }
});
