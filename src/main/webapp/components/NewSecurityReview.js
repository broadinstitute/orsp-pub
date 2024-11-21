import { Component } from "react";
import { u, hh, span, a, div, label, ul, li, p, hr, br, button, h } from 'react-hyperscript-helpers';
import { createObjectCopy, getDateString, isEmpty } from "../util/Utils";
import { UrlConstants } from "../util/UrlConstants";
import './QuestionnaireWorkflow.css';

export const NewSecurityReview = hh(class NewSecurityReview extends Component {

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
      textOtherIdentifier = '',
      dataSecondaryUse = '',
      collaboratorApproval = '',
      mtaOrDta = '',
      deliveryDate = '',
      releaseDate = '',
      dataLocations = [],
      approvalDocument = {}
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
      div({}, [
        div({ className: "answerWrapper" }, [
          label({}, ["1. Will your project involve receiving at or distributing from Broad any personally identifiable information (PII), protected health information (PHI), or genomic data? ",
            span({ className: "normal" }, ["For a list of what constitutes PII and PHI, ", a({ href: "https://intranet.broadinstitute.org/faq/storing-and-managing-phi", className: "link", target: "_blank" }, ["visit this link"]), "."])]),
          div({
          }, [this.props.stringAnswer(pii)]),
        ]),
        div({ className: "answerWrapper", isRendered: !isEmpty(pii) && this.props.getBoolIfString(pii) }, [
          label({}, ["a. Which of these types of data does your project involve? "]),
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
        div({ className: "answerWrapper", isRendered: this.props.getBoolIfString(piiDt) || this.props.getBoolIfString(phi) }, [
          label({}, ["b. Does your data contain any of the following direct identifiers? "]),
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
        div({ 
          className: "answerWrapper ", 
          isRendered: this.props.getBoolIfString(piiDt) || this.props.getBoolIfString(phi) || this.props.getBoolIfString(genomicData) 
        }, [
          label({}, ["c. Will your project make PII, PHI, or genomic data available to external collaborators via FireCloud/Terra?"]),
          div({
          }, [this.props.stringAnswer(externalAvailability)]),
        ]),
        div({ className: "answerWrapper" }, [
          label({}, ["2. Will your project make ", u({},[" any data that is not publicly available"]), " accessible to external collaborators over the internet (but not using Terra)?", span({ className: 'normal'}, [
            " This includes, for example, putting data in a Google Cloud Platform bucket outside of Terra and making it available to external parties. Another example is a custom application facing the public internet, or another digital file sharing service."
          ])]),
          div({
          }, [this.props.stringAnswer(publiclyAvailable)]),
        ]),
      
        div({ className: "answerWrapper" }, [
          label({}, ["3. Is this project subject to any regulations with specific data security requirements ", span({ className: 'normal' }, ["(FISMA, HIPAA, etc.)"]), "? "]),
          div({
          }, [this.props.stringAnswer(compliance)]),
        ]),
        div({ className: "answerWrapper" }, [
          label({}, ["Please specify which regulations must be adhered to below:"]),
          div({
          }, [isEmpty(textCompliance) ? "--" : textCompliance]),
        ]),
  
        div({ className: "answerWrapper" }, [
          label({}, ["4. Will the individual level data collected or generated as part of this project be shared to fulfill Broad Institute’s obligation for data sharing for the project via: "]),
          div({}, [this.props.sharingTypeAnswer(sharingType)]),
        ]),
  
        div({ className: "answerWrapper" }, [
          label({}, ["Name of Database(s): "]),
          div({
          }, [isEmpty(textSharingType) ? "--" : textSharingType]),
        ]),
  
        div({style: {marginBottom: '20px'}}, [
          label({
            style: {color: '#286090', fontSize: '1.071rem', marginBottom: '8px'}
          }, ["5. Data Location(s)"]),
          p({isRendered: !dataLocations.length}, ["--"]),
          div([dataLocations.map(
            (data, idx) => 
              div({className: "row"}, [
                hr({
                  isRendered: idx > 0,
                  style: {margin: '8px 6px', background: '#c7c7c7', height: '1px'}
                }),
                span({className: "col-lg-6"}, [
                  label({style: {fontWeight: 600}}, ["Research Stages"]),
                  p({}, [data.researchStage]),
                  p({isRendered: isEmpty(data.researchStage)}, ["--"])
                ]),
                span({className: "col-lg-6"}, [
                  label({style: {fontWeight: 600}}, ["Data Location"]),
                  p({}, [data.dataStores]),
                  p({isRendered: isEmpty(data.dataStores)}, ["--"])
                ]),
                span({className: "col-lg-6"}, [
                  label({style: {fontWeight: 600}}, ["Data Location URL"]),
                  p({}, [a({
                    className: "link",
                    onClick: () => this.redirectUrl(data.locationUrl)
                  }, [data.locationUrl])]),
                  p({isRendered: isEmpty(data.locationUrl)}, ["--"])
                ]),
                span({className: "col-lg-6"}, [
                  label({style: {fontWeight: 600}}, ["Cloud Provider"]),
                  p({}, [data.cloudProvider]),
                  p({isRendered: isEmpty(data.cloudProvider)}, ["--"])
                ]),
                div({ className: "col-lg-12", style: {margin: "10px 0 5px"}}, [
                  div({ 
                    isRendered: data.dataStores.includes("Terra"),
                    className: "answerWrapper " 
                  }, [
                    label({}, ["Terra: What is the URL of the Terra Workspace or Terra Data Repository (TDR) snapshot?"]),
                    div({
                    }, [isEmpty(data.terraUrl) ? "--" : data.terraUrl]),
                  ]),
                  div({ 
                    isRendered: data.dataStores.includes("Google Cloud storage assets (e.g. Cloud Storage; BigQuery)"),
                    className: "answerWrapper " 
                  }, [
                    label({}, ["Google Cloud storage assets: What is the URL of the GCP Project, and bucket?"]),
                    div({
                    }, [isEmpty(data.gcsaUrl) ? "--" : data.gcsaUrl]),
                  ]),
                  div({ 
                    isRendered: data.dataStores.includes("Google Drive"),
                    className: "answerWrapper " 
                  }, [
                    label({}, ["Google Drive: What is the folder name and URL?"]),
                    div({
                    }, [isEmpty(data.gdriveUrl) ? "--" : data.gdriveUrl]),
                  ]),
                  div({ 
                    isRendered: data.dataStores.includes("On prem storage"),
                    className: "answerWrapper " 
                  }, [
                    label({}, ["On prem storage: What is the name of the cluster and mountpoint?"]),
                    div({
                    }, [isEmpty(data.onpremUrl) ? "--" : data.onpremUrl]),
                  ]),
                  div({ 
                    isRendered: data.dataStores.includes("Broad-issued laptop"),
                    className: "answerWrapper " 
                  }, [
                    label({}, ["Broad-issued laptop: What is the laptop name (sometimes called hostname)?"]),
                    div({
                    }, [isEmpty(data.bilCluster) ? "--" : data.bilCluster]),
                  ]),
                  div({ 
                    isRendered: data.dataStores.includes("Other"),
                    className: "answerWrapper " 
                  }, [
                    label({}, ["Other"]),
                    div({
                    }, [isEmpty(data.otherText) ? "--" : data.otherText]),
                  ]),
                ])
              ]),
          )]),
        ]),
  
        div({ className: "answerWrapper" }, [
          label({}, ["6. Are you willing to share this data for secondary use in accordance with its consent form after primary research activites are complete? "]),
          div({}, [this.props.secondaryUseAnswer(dataSecondaryUse)]),
          p({isRendered: isEmpty(dataSecondaryUse)}, ["--"])
        ]),
  
        div({ className: "answerWrapper", style: {marginBottom: "10px"} }, [
          label({}, ["7. If you received these samples/data from a collaborator, did that collaborator approve/agree to sharing the data? "]),
          div({isRendered: collaboratorApproval === "true"}, ["Yes, my collaborator has approved sharing."]),
          div({isRendered: collaboratorApproval === "false"}, ["No, I do not have approval for sharing."]),
          div({isRendered: collaboratorApproval === "uncertain"}, ["Uncertain"]),
          p({isRendered: isEmpty(collaboratorApproval)}, ["--"])
        ]),
        div({
          isRendered: collaboratorApproval === "true" && !isEmpty(approvalDocument.fileName),
          style: {marginBottom: "20px"}
        }, [
          label({style: {marginRight: "7px"}}, ["Documentation: "]),
          span({}, [
            a({
              href: `${UrlConstants.downloadDocumentUrl}?uuid=${approvalDocument.uuid}`,
              target: '_blank',
              title: approvalDocument.fileName,
            }, [
              span({
                className: 'glyphicon glyphicon-download submission-download'
              }, []), " ",
              approvalDocument.fileName > 14 ? approvalDocument.fileName.slice(14) + '...' : approvalDocument.fileName
            ]),
          ]),
        ]),
  
        div({ className: "answerWrapper" }, [
          label({}, ["8. Has the tech transfer office of the institution providing samples/data confirmed that a Material or Data Transfer Agreement (MTA/DTA) is needed to transfer the materials/data? "]),
          div({}, [this.props.stringAnswer(mtaOrDta)]),
        ]),
  
        div({
          className: 'row'
        }, [
          span({className: 'col-xs-4'}, [
            label({className: 'inputFieldLabel'}, ["9.Target Delivery Date"]), br(),
            div({}, [getDateString(deliveryDate, 'mmddyyyy')]),
            p({isRendered: !(!!deliveryDate)}, ["--"])
          ]),
            span({className: 'col-xs-4'}, [
              label({className: 'inputFieldLabel'}, ["10.Target Public Release Date (if applicable)"]), br(),
              div({}, [getDateString(releaseDate, 'mmddyyyy')]),
              p({isRendered: !(!!releaseDate)}, ["--"])
          ])
        ])
      ])
    )
  }
})
