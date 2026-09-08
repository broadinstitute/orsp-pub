import { Component } from "react";
import { u, hh, span, a, div, label, ul, li, p, hr, br, button, h } from 'react-hyperscript-helpers';
import { createObjectCopy, getDateString, isEmpty } from "../util/Utils";
import { UrlConstants } from "../util/UrlConstants";
import './QuestionnaireWorkflow.css';

export const LegacySecurityReview = hh(class LegacySecurityReview extends Component {

  constructor(props) {
      super(props);
      this.state = {}
  }

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
    } = this.props.sampleProps;

    let labelStore = '';
    if (typeof store === 'string') {
      let stores = store.split(",");
      stores.forEach(item => {
        if (!isEmpty(this.props.storeOptions(item))) {
          labelStore = labelStore.concat(this.props.storeOptions(item),", ");
        }
      });
    }
    
    if (!isEmpty(this.props.sampleProps.textStore)) {
      labelStore = labelStore.concat(this.props.sampleProps.textStore);
    } else if (!isEmpty(store)) {
      labelStore = labelStore.substring(0,labelStore.length - 2);
    }

    return (
      div([
        div({}, [

          div({ className: "answerWrapper" }, [
            label({}, ["1. Where will the data for this project be processed, handled, and stored?"]),
            div({
            }, [labelStore]),
          ]),
          div({ className: "answerWrapper" }, [
            label({}, ["2. Will your project involve receiving at or distributing from Broad any personally identifiable information (PII), protected health information (PHI), or genomic data? "]),
            div({
            }, [this.props.stringAnswer(pii)]),
          ]),
          div({ className: "answerWrapper", isRendered: !isEmpty(pii) && pii === "true" }, [
            label({}, ["Which of these types of data does your project involve? "]),
            ul({key: "involvedPII"}, [
              li({key: "pii"}, [
                span({className: "bold"}, ['PII']), ': ' ,  this.props.stringAnswer(piiDt)
              ]),
              li({key: "phi"}, [
                span({className: "bold"}, ['PHI']), ': ' ,  this.props.stringAnswer(phi)
              ]),
              li({key: "genomicData"}, [
                span({className: "bold"}, ['Genomic Data']), ': ' ,  this.props.stringAnswer(genomicData)
              ]),
            ])
          ]),
          div({ className: "answerWrapper", isRendered: piiDt === 'true' || phi === 'true' }, [
            label({}, ["Does your data contain any of the following direct identifiers? "]),
            ul({key: "involvedPII"}, [
              li({key: "names"}, [
                span({className: "bold"}, ['Names']), ': ' ,  this.props.stringAnswer(names)
              ]),
              li({key: "dates"}, [
                span({className: "bold"}, ['Dates, except year']), ': ' ,  this.props.stringAnswer(dates)
              ]),
              li({key: "telephone"}, [
                span({className: "bold"}, ['Telephone numbers']), ': ' ,  this.props.stringAnswer(telephone)
              ]),
              li({key: "geographicData"}, [
                span({className: "bold"}, ['Geographic data']), ': ' ,  this.props.stringAnswer(geographicData)
              ]),
              li({key: "fax"}, [
                span({className: "bold"}, ['FAX numbers']), ': ' ,  this.props.stringAnswer(fax)
              ]),
              li({key: "socialSecurityNumber"}, [
                span({className: "bold"}, ['Social Security numbers']), ': ' ,  this.props.stringAnswer(socialSecurityNumber)
              ]),
              li({key: "emailAddresses"}, [
                span({className: "bold"}, ['Email addresses']), ': ' ,  this.props.stringAnswer(emailAddresses)
              ]),
              li({key: "medicalNumbers"}, [
                span({className: "bold"}, ['Medical record numbers']), ': ' ,  this.props.stringAnswer(medicalNumbers)
              ]),
              li({key: "accountNumbers"}, [
                span({className: "bold"}, ['Account numbers']), ': ' ,  this.props.stringAnswer(accountNumbers)
              ]),
              li({key: "healthPlanNumbers"}, [
                span({className: "bold"}, ['Health plan beneficiary numbers']), ': ' ,  this.props.stringAnswer(healthPlanNumbers)
              ]),
              li({key: "licenseNumbers"}, [
                span({className: "bold"}, ['Certificate/license numbers']), ': ' ,  this.props.stringAnswer(licenseNumbers)
              ]),
              li({key: "vehicleIdentifiers"}, [
                span({className: "bold"}, ['Vehicle identifiers and serial numbers including license plates']), ': ' ,  this.props.stringAnswer(vehicleIdentifiers)
              ]),
              li({key: "webUrls"}, [
                span({className: "bold"}, ['Web URLs']), ': ' ,  this.props.stringAnswer(webUrls)
              ]),
              li({key: "deviceIdentifiers"}, [
                span({className: "bold"}, ['Device identifiers and serial numbers']), ': ' ,  this.props.stringAnswer(deviceIdentifiers)
              ]),
              li({key: "internetProtocolAddresses"}, [
                span({className: "bold"}, ['Internet protocol addresses']), ': ' ,  this.props.stringAnswer(internetProtocolAddresses)
              ]),
              li({key: "facePhotos"}, [
                span({className: "bold"}, ['Full face photos and comparable images']), ': ' ,  this.props.stringAnswer(facePhotos)
              ]),
              li({key: "biometricIdentifiers"}, [
                span({className: "bold"}, ['Biometric identifiers (i.e. retinal scan, fingerprints)']), ': ' ,  this.props.stringAnswer(biometricIdentifiers)
              ]),
              li({key: "uniqueIdentifying"}, [
                span({className: "bold"}, ['Any unique identifying number or code']), ': ' ,  this.props.stringAnswer(uniqueIdentifying)
              ]),
              li({key: "otherIdentifier"}, [
                span({className: "bold"}, ['Other']), ': ' ,  this.props.stringAnswer(otherIdentifier)
              ]),
              li({isRendered: otherIdentifier === 'true', key: "textOtherIdentifier"}, [
                span({className: "bold"}, ['Please describe “other”']), ': ' ,  isEmpty(textOtherIdentifier) ? "--" : textOtherIdentifier
              ])
            ])
          ]),

          div({ className: "answerWrapper", isRendered: !isEmpty(piiDt) || !isEmpty(phi) || !isEmpty(genomicData)  }, [
            label({}, ["Will your project make PII, PHI, or genomic data available to external collaborators via FireCloud/Terra?"]),
            div({
            }, [this.props.stringAnswer(externalAvailability)]),
          ]),
          div({ className: "answerWrapper" }, [
            label({}, ["3. Will your project make ", u({},[" any data that is not publicly available"]), " accessible to external collaborators over the internet (but not using Terra)?", span({ className: 'normal'}, [
              " This includes, for example, putting data in a Google Cloud Platform bucket outside of Terra and making it available to external parties. Another example is a custom application facing the public internet, or another digital file sharing service."
            ])]),
            div({
            }, [this.props.stringAnswer(publiclyAvailable)]),
          ]),
        
          div({ className: "answerWrapper" }, [
            label({}, ["4. Is this project subject to any regulations with specific data security requirements ", span({ className: 'normal' }, ["(FISMA, HIPAA, etc.)"]), "? "]),
            div({
            }, [this.props.stringAnswer(compliance)]),
          ]),
          div({ className: "answerWrapper" }, [
            label({}, ["Please specify which regulations must be adhered to below:"]),
            div({
            }, [isEmpty(textCompliance) ? "--" : textCompliance]),
          ]),

          div({ className: "answerWrapper" }, [
            label({}, ["5. Will the individual level data collected or generated as part of this project be shared to fulfill Broad Institute’s obligation for data sharing for the project via: "]),
            div({}, [this.props.sharingTypeAnswer(sharingType)]),
          ]),

          div({ className: "answerWrapper" }, [
            label({}, ["Name of Database(s): "]),
            div({
            }, [isEmpty(textSharingType) ? "--" : textSharingType]),
          ]),
        ])
      ])
    )
  }
})
