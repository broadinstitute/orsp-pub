import { Component } from "react";
import { u, hh, span, a, div, label, ul, li, p, hr, br, ins, del } from 'react-hyperscript-helpers';
import { getDateString, isEmpty } from "../util/Utils";
import { UrlConstants } from "../util/UrlConstants";

const ChangeComparision = hh(class ChangeComparision extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    collaboratorApprovalAnswer = (answer) => {
      switch (answer) {
        case 'true':
          return 'Yes, my collaborator has approved sharing.'
        case 'false':
          return 'No, I do not have approval for sharing.'
        case 'uncertain':
          return 'Uncertain'
      }
    }

    compareData = (key, value, method='', index='') => {
        switch(method) {

          case 'stringAnswer':
              if (this.props.stringAnswer(value) !== this.props.stringAnswer(this.props.prevSeqData[key])) {
                  return span ({}, [
                      del([this.props.stringAnswer(this.props.prevSeqData[key])]),
                      ins([this.props.stringAnswer(value)])
                  ]);
              } else {
                  return span([this.props.stringAnswer(value)]);
              }

          case 'sharingTypeAnswer':
            if (this.props.sharingTypeAnswer(value) !== this.props.sharingTypeAnswer(this.props.prevSeqData[key])) {
              return span ({}, [
                  del([this.props.sharingTypeAnswer(this.props.prevSeqData[key])]),
                  ins([this.props.sharingTypeAnswer(value)])
              ]);
            } else {
                return span([this.props.sharingTypeAnswer(value)]);
            }

          case 'secondaryUseAnswer':
            if (value.join(", ") !== this.props.prevSeqData[key]) {
              return span ({}, [
                ul({style: {backgroundColor: "rgba(255, 0, 0, 0.3)", textDecoration: "line-through"}}, [
                  this.props.prevSeqData[key].split(", ").map(item => li([this.props.secondaryUseAnswer(item)]))
                ]),
                ul({style: {backgroundColor: "rgba(60, 179, 113, 0.3)", textDecoration: "underline"}}, [
                  value.map(item => li([this.props.secondaryUseAnswer(item)]))
                ])
              ]);
            } else {
                return span([this.props.secondaryUseAnswer(value)]);
            }

          case 'collaboratorApprovalAnswer':
            if (this.collaboratorApprovalAnswer(value) !== this.collaboratorApprovalAnswer(this.props.prevSeqData[key])) {
              return span ({}, [
                  del([this.collaboratorApprovalAnswer(this.props.prevSeqData[key])]),
                  ins([this.collaboratorApprovalAnswer(value)])
              ]);
            } else {
                return span([this.collaboratorApprovalAnswer(value)]);
            }

          case 'dataLocations':
            if ((this.props.prevSeqData.dataLocations.length - 1) >= index && value !== this.props.prevSeqData.dataLocations[index][key]) {
              return span ({}, [
                  del([this.props.prevSeqData.dataLocations[index][key]]),
                  ins([value])
              ]);
            } else if (index > this.props.prevSeqData.dataLocations.length - 1) {
              return span ({}, [
                del([' ']),
                ins([value])
              ]);
            } else {
                return span([value]);
            }

          case 'date':
            if (getDateString(value, 'mmddyyyy') !== getDateString(this.props.prevSeqData[key], 'mmddyyyy')) {
              return span ({}, [
                  del([getDateString(this.props.prevSeqData[key], 'mmddyyyy')]),
                  ins([getDateString(value, 'mmddyyyy')])
              ]);
            } else {
                return span([getDateString(value, 'mmddyyyy')]);
            }

          default:
            if (value !== this.props.prevSeqData[key]) {
              return span ({}, [
                  del([this.props.prevSeqData[key]]),
                  ins([value])
              ]);
            } else {
                return span([value]);
            }
        }
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
              }, [this.compareData('pii', pii, 'stringAnswer')]),
            ]),
            div({ className: "answerWrapper", isRendered: !isEmpty(pii) && this.props.getBoolIfString(pii) }, [
              label({}, ["a. Which of these types of data does your project involve? "]),
              ul({key: "involvedPII"}, [
                li({key: "pii"}, [
                  span({className: "bold"}, ['PII']), ': ', this.compareData('piiDt', piiDt, 'stringAnswer')
                ]),
                li({key: "phi"}, [
                  span({className: "bold"}, ['PHI']), ': ', this.compareData('phi', phi, 'stringAnswer')
                ]),
                li({key: "genomicData"}, [
                  span({className: "bold"}, ['Genomic Data']), ': ', this.compareData('genomicData', genomicData, 'stringAnswer')
                ]),
              ])
            ]),
            div({ className: "answerWrapper", isRendered: this.props.getBoolIfString(piiDt) || this.props.getBoolIfString(phi) }, [
              label({}, ["b. Does your data contain any of the following direct identifiers? "]),
              ul({key: "involvedPII"}, [
                li({key: "names"}, [
                  span({className: "bold"}, ['Names']), ': ', this.compareData('names', names, 'stringAnswer')
                ]),
                li({key: "dates"}, [
                  span({className: "bold"}, ['Dates, except year']), ': ', this.compareData('dates', dates, 'stringAnswer')
                ]),
                li({key: "telephone"}, [
                  span({className: "bold"}, ['Telephone numbers']), ': ', this.compareData('telephone', telephone, 'stringAnswer')
                ]),
                li({key: "geographicData"}, [
                  span({className: "bold"}, ['Geographic data']), ': ', this.compareData('geographicData', geographicData, 'stringAnswer')
                ]),
                li({key: "fax"}, [
                  span({className: "bold"}, ['FAX numbers']), ': ', this.compareData('fax', fax, 'stringAnswer')
                ]),
                li({key: "socialSecurityNumber"}, [
                  span({className: "bold"}, ['Social Security numbers']), ': ', this.compareData('socialSecurityNumber', socialSecurityNumber, 'stringAnswer')
                ]),
                li({key: "emailAddresses"}, [
                  span({className: "bold"}, ['Email addresses']), ': ', this.compareData('emailAddresses', emailAddresses, 'stringAnswer')
                ]),
                li({key: "medicalNumbers"}, [
                  span({className: "bold"}, ['Medical record numbers']), ': ', this.compareData('medicalNumbers', medicalNumbers, 'stringAnswer')
                ]),
                li({key: "accountNumbers"}, [
                  span({className: "bold"}, ['Account numbers']), ': ', this.compareData('accountNumbers', accountNumbers, 'stringAnswer')
                ]),
                li({key: "healthPlanNumbers"}, [
                  span({className: "bold"}, ['Health plan beneficiary numbers']), ': ', this.compareData('healthPlanNumbers', healthPlanNumbers, 'stringAnswer')
                ]),
                li({key: "licenseNumbers"}, [
                  span({className: "bold"}, ['Certificate/license numbers']), ': ', this.compareData('licenseNumbers', licenseNumbers, 'stringAnswer')
                ]),
                li({key: "vehicleIdentifiers"}, [
                  span({className: "bold"}, ['Vehicle identifiers and serial numbers including license plates']), ': ', this.compareData('vehicleIdentifiers', vehicleIdentifiers, 'stringAnswer')
                ]),
                li({key: "webUrls"}, [
                  span({className: "bold"}, ['Web URLs']), ': ', this.compareData('webUrls', webUrls, 'stringAnswer')
                ]),
                li({key: "deviceIdentifiers"}, [
                  span({className: "bold"}, ['Device identifiers and serial numbers']), ': ', this.compareData('deviceIdentifiers', deviceIdentifiers, 'stringAnswer')
                ]),
                li({key: "internetProtocolAddresses"}, [
                  span({className: "bold"}, ['Internet protocol addresses']), ': ', this.compareData('internetProtocolAddresses', internetProtocolAddresses, 'stringAnswer')
                ]),
                li({key: "facePhotos"}, [
                  span({className: "bold"}, ['Full face photos and comparable images']), ': ', this.compareData('facePhotos', facePhotos, 'stringAnswer')
                ]),
                li({key: "biometricIdentifiers"}, [
                  span({className: "bold"}, ['Biometric identifiers (i.e. retinal scan, fingerprints)']), ': ', this.compareData('biometricIdentifiers', biometricIdentifiers, 'stringAnswer')
                ]),
                li({key: "uniqueIdentifying"}, [
                  span({className: "bold"}, ['Any unique identifying number or code']), ': ', this.compareData('uniqueIdentifying', uniqueIdentifying, 'stringAnswer')
                ]),
                li({key: "otherIdentifier"}, [
                  span({className: "bold"}, ['Other']), ': ', this.compareData('otherIdentifier', otherIdentifier, 'stringAnswer')
                ]),
                li({isRendered: otherIdentifier === 'true', key: "textOtherIdentifier"}, [
                  span({className: "bold"}, ['Please describe “other”']), ': ', isEmpty(textOtherIdentifier) ? "--" : this.compareData('textOtherIdentifier', textOtherIdentifier)
                ])
              ])
            ]),
            div({ 
              className: "answerWrapper ", 
              isRendered: this.props.getBoolIfString(piiDt) || this.props.getBoolIfString(phi) || this.props.getBoolIfString(genomicData) 
            }, [
              label({}, ["c. Will your project make PII, PHI, or genomic data available to external collaborators via FireCloud/Terra?"]),
              div({
              }, [this.compareData('externalAvailability', externalAvailability, 'stringAnswer')]),
            ]),
            div({ className: "answerWrapper" }, [
              label({}, ["2. Will your project make ", u({},[" any data that is not publicly available"]), " accessible to external collaborators over the internet (but not using Terra)?", span({ className: 'normal'}, [
                " This includes, for example, putting data in a Google Cloud Platform bucket outside of Terra and making it available to external parties. Another example is a custom application facing the public internet, or another digital file sharing service."
              ])]),
              div({
              }, [this.compareData('publiclyAvailable', publiclyAvailable, 'stringAnswer')]),
            ]),
          
            div({ className: "answerWrapper" }, [
              label({}, ["3. Is this project subject to any regulations with specific data security requirements ", span({ className: 'normal' }, ["(FISMA, HIPAA, etc.)"]), "? "]),
              div({
              }, [this.compareData('compliance', compliance, 'stringAnswer')]),
            ]),
            div({ className: "answerWrapper" }, [
              label({}, ["Please specify which regulations must be adhered to below:"]),
              div({
              }, [isEmpty(textCompliance) ? "--" : this.compareData('textCompliance', textCompliance)]),
            ]),
      
            div({ className: "answerWrapper" }, [
              label({}, ["4. Will the individual level data collected or generated as part of this project be shared to fulfill Broad Institute’s obligation for data sharing for the project via: "]),
              div({}, [this.compareData('sharingType', sharingType, 'sharingTypeAnswer')]),
            ]),
      
            div({ className: "answerWrapper" }, [
              label({}, ["Name of Database(s): "]),
              div({
              }, [isEmpty(textSharingType) ? "--" : this.compareData('textSharingType', textSharingType)]),
            ]),
      
            div({}, [
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
                      p({}, [this.compareData('researchStage', data.researchStage, 'dataLocations', idx)]),
                      p({isRendered: isEmpty(data.researchStage)}, ["--"])
                    ]),
                    span({className: "col-lg-6"}, [
                      label({style: {fontWeight: 600}}, ["Data Location"]),
                      p({}, [this.compareData('dataStores', data.dataStores, 'dataLocations', idx)]),
                      p({isRendered: isEmpty(data.dataStores)}, ["--"])
                    ]),
                    div({ className: "col-lg-12", style: {margin: "10px 0 5px"}}, [
                      div({ 
                        isRendered: !isEmpty(data.dataStores) && data.dataStores.includes("Terra"),
                        className: "answerWrapper " 
                      }, [
                        label({}, ["Terra: What is the URL of the Terra Workspace or Terra Data Repository (TDR) snapshot?"]),
                        div({
                        }, [isEmpty(data.terraUrl) ? "--" : this.compareData('terraUrl', data.terraUrl, 'dataLocations', idx)]),
                      ]),
                      div({ 
                        isRendered: !isEmpty(data.dataStores) && data.dataStores.includes("Google Cloud storage assets (e.g. Cloud Storage; BigQuery)"),
                        className: "answerWrapper " 
                      }, [
                        label({}, ["Google Cloud storage assets: What is the URL of the GCP Project, and bucket?"]),
                        div({
                        }, [isEmpty(data.gcsaUrl) ? "--" : this.compareData('gcsaUrl', data.gcsaUrl, 'dataLocations', idx)]),
                      ]),
                      div({ 
                        isRendered: !isEmpty(data.dataStores) && data.dataStores.includes("Google Drive"),
                        className: "answerWrapper " 
                      }, [
                        label({}, ["Google Drive: What is the folder name and URL?"]),
                        div({
                        }, [isEmpty(data.gdriveUrl) ? "--" : this.compareData('gdriveUrl', data.gdriveUrl, 'dataLocations', idx)]),
                      ]),
                      div({ 
                        isRendered: !isEmpty(data.dataStores) && data.dataStores.includes("On prem storage"),
                        className: "answerWrapper " 
                      }, [
                        label({}, ["On prem storage: What is the name of the cluster and mountpoint?"]),
                        div({
                        }, [isEmpty(data.onpremUrl) ? "--" : this.compareData('onpremUrl', data.onpremUrl, 'dataLocations', idx)]),
                      ]),
                      div({ 
                        isRendered: !isEmpty(data.dataStores) && data.dataStores.includes("Broad-issued laptop"),
                        className: "answerWrapper " 
                      }, [
                        label({}, ["Broad-issued laptop: What is the laptop name (sometimes called hostname)?"]),
                        div({
                        }, [isEmpty(data.bilCluster) ? "--" : this.compareData('bilCluster', data.bilCluster, 'dataLocations', idx)]),
                      ]),
                      div({ 
                        isRendered: !isEmpty(data.dataStores) && data.dataStores.includes("Other"),
                        className: "answerWrapper " 
                      }, [
                        label({}, ["Other"]),
                        div({
                        }, [isEmpty(data.otherText) ? "--" : this.compareData('otherText', data.otherText, 'dataLocations', idx)]),
                      ]),
                    ])
                  ]),
              )]),
            ]),
      
            div({ className: "answerWrapper" }, [
              label({}, ["6. Are you willing to share this data for secondary use in accordance with its consent form after primary research activites are complete? "]),
              div({}, [this.compareData('dataSecondaryUse', dataSecondaryUse, 'secondaryUseAnswer')]),
              p({isRendered: isEmpty(dataSecondaryUse)}, ["--"])
            ]),
      
            div({ className: "answerWrapper", style: {marginBottom: "10px"} }, [
              label({}, ["7. If you received these samples/data from a collaborator, did that collaborator approve/agree to sharing the data? "]),
              div({isRendered: !isEmpty(collaboratorApproval)}, [this.compareData('collaboratorApproval', collaboratorApproval, 'collaboratorApprovalAnswer')]),
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
              div({}, [this.compareData('mtaOrDta', mtaOrDta, 'stringAnswer')]),
            ]),
      
            div({
              className: 'row'
            }, [
              span({className: 'col-xs-4'}, [
                label({className: 'inputFieldLabel'}, ["9. Target Data Delivery Date"]), br(),
                div({}, [this.compareData('deliveryDate', deliveryDate, 'date')]),
                p({isRendered: !(!!deliveryDate)}, ["--"])
              ]),
                span({className: 'col-xs-4'}, [
                  label({className: 'inputFieldLabel'}, ["10. Target Date for Public Release of Data (if applicable)"]), br(),
                  div({}, [this.compareData('releaseDate', releaseDate, 'date')]),
                  p({isRendered: !(!!releaseDate)}, ["--"])
              ])
            ])
          ])
        )
      }
})

export default ChangeComparision;
