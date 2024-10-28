import { Component, React } from 'react';
import { u, hh, span, a, div, label, ul, li, p, hr, br, button } from 'react-hyperscript-helpers';
import { createObjectCopy, getDateString, isEmpty } from "../util/Utils";
import './QuestionnaireWorkflow.css';
import { UrlConstants } from '../util/UrlConstants';
import { Security } from './Security';
import { ConsentGroup } from '../util/ajax';
import { AlertMessage } from './AlertMessage';


const sharingTypes = {
    open : "An open/unrestricted repository (such as GEO)",
    controlled: "A controlled-access repository (such as dbGaP or DUOS)",
    both: "Both a controlled-access and an open-access repository",
    noDataSharing: "No data sharing via a repository (data returned to research collaborator only)",
    undetermined: "Data sharing plan not yet determined"
}

const secondaryUseTypes = {
  broadFacilitatedSharing: "Yes, the Broad may facilitate sharing my data for secondary use via the Broad Data Access Committee",
  externalSharing: "Yes, it will be shared through an external repository and/or data access committee (i.e. dbGaP)",
  no: "No, this data should not be shared for secondary use",
  needAssistance: "I need assistance from ORSP to answer this question",
  uncertain: "Uncertain"
}

const REASEARCH_STAGES = [
  {id: '1', value: 'pre', label: 'Pre'}, 
  {id: '2', value: 'post', label: 'Post'},
  {id: '3', value: 'intra_analysis', label: 'Intra Analysis'}
];

const DATA_LOCATIONS = [
  {id: '1', value: 'terra', label: 'Terra'}, 
  {id: '2', value: 'bgp', label: 'Broad Genomics Platform'},
  {id: '3', value: 'gcp', label: 'Google Cloud Platform (without Terra)'},
  {id: '4', value: 'aws', label: 'Amazon Web Services'},
  {id: '5', value: 'bop', label: 'Broad on-prem'},
  {id: '6', value: 'other', label: 'Other'}
]

export const SecurityReview = hh(class SecurityReview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
      securityInfoData: {
        pii: '',
        compliance: '',
        sharingType: '',
        textSharingType: '',
        textCompliance: '',
        publiclyAvailable: '',
        store: [],
        terra: false,
        bgp: false,
        gcp: false,
        aws: false,
        bop: false,
        otherStore: false,
        externalAvailability: '',
        textStore: '',
        piiDt: false,
        phi: false,
        genomicData: false,
        names: false,
        dates: false,
        telephone: false,
        geographicData: false,
        fax: false,
        socialSecurityNumber: false,
        emailAddresses: false,
        medicalNumbers: false,
        accountNumbers: false,
        healthPlanNumbers: false,
        licenseNumbers: false,
        vehicleIdentifiers: false,
        webUrls: false,
        deviceIdentifiers: false,
        internetProtocolAddresses: false,
        facePhotos: false,
        biometricIdentifiers: false,
        uniqueIdentifying: false,
        otherIdentifier: false,
        textOtherIdentifier: '',
        dataLocations: [{
          researchStage: null,
          dataStores: null,
          locationUrl: null,
          cloudProvider: null
        }],
        approvalDocument: {
          fileName: null
        }
      },
      isInfoSecurityValid: false,
      submitError: false,
      tempSecurityInfoData: {},
      sampleProps: {},
      alert: {
        msg: '',
        showMsg: false,
        type: 'success'
      }
    };
  }

  componentDidMount() {
    this.init();
  }

  init = async () => {
    let securityInfoData = createObjectCopy(this.props.sample);
    this.setState({sampleProps: createObjectCopy(securityInfoData)});
    let store = securityInfoData.store.split(',');
    store.forEach(item => securityInfoData[item] = true);
    if (!isEmpty(securityInfoData.textStore)) securityInfoData.otherStore = true;
    let dataLocations = createObjectCopy(securityInfoData.dataLocations);
    !isEmpty(dataLocations) && dataLocations.forEach(loc => {
      let researchStage = !isEmpty(loc.researchStage) ? loc.researchStage.split(',') : [];
      loc.researchStage = [];
      researchStage.forEach(element => {
        loc.researchStage.push(REASEARCH_STAGES.find(stage => stage.label.trim() === element.trim()));
      });
      let dataStore = !isEmpty(loc.dataStores) ? loc.dataStores.split(',') : [];
      loc.dataStores = [];
      dataStore.forEach(item => {
        loc.dataStores.push(DATA_LOCATIONS.find(dataLoc => dataLoc.label.trim() === item.trim()));
      })
    });
    securityInfoData.dataLocations = dataLocations;
    this.setState((prev) => {
      securityInfoData.deliveryDate = !isEmpty(securityInfoData.deliveryDate) ? new Date(securityInfoData.deliveryDate) : '';
      securityInfoData.releaseDate = !isEmpty(securityInfoData.releaseDate) ? new Date(securityInfoData.releaseDate) : '';
      prev.securityInfoData = securityInfoData;
      return prev;
    });
  }

  getLabelObj = () => {
    let dataLocations = this.state.securityInfoData.dataLocations;
    !isEmpty(dataLocations) && dataLocations.forEach(loc => {
      if (typeof loc.researchStage === 'string') {
        let researchStage = !isEmpty(loc.researchStage) ? loc.researchStage.split(',') : [];
        loc.researchStage = [];
        researchStage.forEach(element => {
          loc.researchStage.push(REASEARCH_STAGES.find(stage => stage.label.trim() === element.trim()));
        });
      }
      if (typeof loc.dataStores === 'string') {
        let dataStore = !isEmpty(loc.dataStores) ? loc.dataStores.split(',') : [];
        loc.dataStores = [];
        dataStore.forEach(item => {
          loc.dataStores.push(DATA_LOCATIONS.find(dataLoc => dataLoc.label.trim() === item.trim()));
        })
      }
    });
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

  secondaryUseAnswer = (type) => {
    return secondaryUseTypes[type];
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

  redirectUrl = (url) => {
    url.includes('http') ? window.open(url, '_blank') : window.open('//' + url, '_blank');
  }

  updateInfoSecurityFormData = (updatedForm, field) => {
    let securityInfoData = this.state.securityInfoData;
    securityInfoData[field] = updatedForm[field];
    this.setState(prev => {
      prev.securityInfoData = securityInfoData;
      return prev;
    });
  };

  handleInfoSecurityValidity = (isValid) => {
    this.setState({
      isInfoSecurityValid: isValid
    });
  }

  handleSecurityInfoSubmit = () => {
    const {approvalDocument, dataLocations, ...securityInfo} = this.state.securityInfoData;
    securityInfo.projectKey = securityInfo.projectKey ? securityInfo.projectKey : securityInfo.linkedProjectKey;
    if (typeof securityInfo.store !== 'string') securityInfo.store = securityInfo.store.join(',');
    securityInfo.deliveryDate = securityInfo.deliveryDate ? securityInfo.deliveryDate : null;
    securityInfo.releaseDate = securityInfo.releaseDate ? securityInfo.releaseDate : null;
    const REQ_OBJ = {
      securityInfo, 
      file: approvalDocument,
      dataLocations: !isEmpty(dataLocations) ? this.getDataLocations(dataLocations) : []
    }
    ConsentGroup.update(REQ_OBJ)
    .then(() => {
      let savedData = createObjectCopy(this.state.securityInfoData);
      if (typeof savedData.store === 'object') savedData.store = savedData.store.join(',');
      this.setState({
        sampleProps: savedData,
        alert: {msg: 'Data Security updated Successfully', showMsg: true, type: 'success'}
      }, () => {setTimeout(() => this.setState(prev => prev.alert.showMsg = false), 4000)});
      this.props.setEditSecurity(false);
    })
    .catch((() => {
      this.setNonEditedSecurityInfoData();
      this.setState({
        alert: {msg: 'Error occured while updating Data Security.', showMsg: true, type: 'danger'}
      }, () => {setTimeout(() => this.setState(prev => prev.alert.showMsg = false), 4000)})
    }))
  }

  getDataLocations = (dataLocations) => {
    dataLocations.forEach(data => {
      data.researchStage = data.researchStage && data.researchStage.map(stage => stage.label).join(", ");
      data.dataStores = data.dataStores && data.dataStores.map(store => store.label).join(", ");
    });
    return dataLocations;
  }

  getCopyOfNonEditedSecurityInfoData = () => {
    this.setState({tempSecurityInfoData: createObjectCopy(this.state.securityInfoData)});
  }

  setNonEditedSecurityInfoData = () => {
    this.state.tempSecurityInfoData.deliveryDate = !isEmpty(this.state.tempSecurityInfoData.deliveryDate) ? new Date(this.state.tempSecurityInfoData.deliveryDate) : null;
    this.state.tempSecurityInfoData.releaseDate = !isEmpty(this.state.tempSecurityInfoData.releaseDate) ? new Date(this.state.tempSecurityInfoData.releaseDate) : null;
    let tempData = createObjectCopy(this.state.tempSecurityInfoData);
    tempData.dataLocations = !isEmpty(tempData.dataLocations) ? this.getDataLocations(tempData.dataLocations) : [];
    this.setState({
      securityInfoData: this.state.tempSecurityInfoData,
      sampleProps: tempData
    });
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
      deliveryDate = '',
      releaseDate = '',
      dataLocations = [],
      approvalDocument = {}
    } = this.state.sampleProps;

    let labelStore = '';
    if (typeof store === 'string') {
      let stores = store.split(",");
      stores.forEach(item => {
        if (!isEmpty(this.storeOptions(item))) {
          labelStore = labelStore.concat(this.storeOptions(item),", ");
        }
      });
    }
    
    if (!isEmpty(this.props.sample.textStore)) {
      labelStore = labelStore.concat(this.props.sample.textStore);
    } else if (!isEmpty(store)) {
      labelStore = labelStore.substring(0,labelStore.length - 2);
    }

    if (this.props.currentStep === this.props.step) {
      return(
        div([
          div({isRendered: !this.props.editSecurity}, [
  
            div({ className: "answerWrapper" }, [
              label({}, ["Where will the data for this project be processed, handled, and stored?"]),
              div({
              }, [labelStore]),
            ]),
            div({ className: "answerWrapper" }, [
              label({}, ["Will your project involve receiving at or distributing from Broad any personally identifiable information (PII), protected health information (PHI), or genomic data? ",
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
              label({}, ["Will your project make ", u({},[" any data that is not publicly available"]), " accessible to external collaborators over the internet (but not using Terra)?", span({ className: 'normal'}, [
                " This includes, for example, putting data in a Google Cloud Platform bucket outside of Terra and making it available to external parties. Another example is a custom application facing the public internet, or another digital file sharing service."
              ])]),
              div({
              }, [this.stringAnswer(publiclyAvailable)]),
            ]),
          
            div({ className: "answerWrapper" }, [
              label({}, ["Is this project subject to any regulations with specific data security requirements ", span({ className: 'normal' }, ["(FISMA, HIPAA, etc.)"]), "? "]),
              div({
              }, [this.stringAnswer(compliance)]),
            ]),
            div({ className: "answerWrapper" }, [
              label({}, ["Please specify which regulations must be adhered to below:"]),
              div({
              }, [isEmpty(textCompliance) ? "--" : textCompliance]),
            ]),
  
            div({ className: "answerWrapper" }, [
              label({}, ["Will the individual level data collected or generated as part of this project be shared to fulfill Broad Institute’s obligation for data sharing for the project via: "]),
              div({}, [this.sharingTypeAnswer(sharingType)]),
            ]),
  
            div({ className: "answerWrapper" }, [
              label({}, ["Name of Database(s): "]),
              div({
              }, [isEmpty(textSharingType) ? "--" : textSharingType]),
            ]),
  
            div({style: {marginBottom: '20px'}}, [
              label({
                style: {color: '#286090', fontSize: '1.071rem', marginBottom: '8px'}
              }, ["Data Location(s)"]),
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
                  ]),
              )]),
            ]),
  
            div({ className: "answerWrapper" }, [
              label({}, ["Are you willing to share this data for secondary use in accordance with its consent form after primary research activites are complete? "]),
              div({}, [this.secondaryUseAnswer(dataSecondaryUse)]),
              p({isRendered: isEmpty(dataSecondaryUse)}, ["--"])
            ]),
  
            div({ className: "answerWrapper", style: {marginBottom: "10px"} }, [
              label({}, ["If you received these samples/data from a collaborator, did that collaborator approve/agree to sharing the data? "]),
              div({isRendered: collaboratorApproval === "true"}, ["Yes, my collaborator has approved sharing."]),
              div({isRendered: collaboratorApproval === "false"}, ["No, I do not have approval for sharing."]),
              div({isRendered: collaboratorApproval === "uncertain"}, ["Uncertain"]),
              p({isRendered: isEmpty(collaboratorApproval)}, ["--"])
            ]),
            div({
              isRendered: collaboratorApproval === "true" && approvalDocument.fileName,
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
  
            div({
              className: 'row'
            }, [
              span({className: 'col-xs-4'}, [
                label({className: 'inputFieldLabel'}, ["Target Delivery Date"]), br(),
                div({}, [getDateString(deliveryDate, 'mmddyyyy')]),
                p({isRendered: !(!!deliveryDate)}, ["--"])
            ]),
              span({className: 'col-xs-4'}, [
                label({className: 'inputFieldLabel'}, ["Target Public Release Date (if applicable)"]), br(),
                div({}, [getDateString(releaseDate, 'mmddyyyy')]),
                p({isRendered: !(!!releaseDate)}, ["--"])
            ])
            ])
          ]),
          div({isRendered: this.props.editSecurity}, [
            Security({
              title: "Security",
              step: 1,
              currentStep: this.props.currentStep,
              updateForm: this.updateInfoSecurityFormData,
              generalError: false,
              submitError: false,
              handleSecurityValidity: this.handleInfoSecurityValidity,
              securityInfoData: this.state.securityInfoData
            }),
            div({style: {height: "40px"}}, [
              hr({style: {margin: "12px 0"}}),
              button({
                className: "btn buttonPrimary floatRight",
                onClick: this.handleSecurityInfoSubmit
              }, ['Submit']),
              button({
                className: "btn buttonSecondary floatRight",
                onClick: this.props.handleCancelEdit
              }, ['Cancel'])
            ])
          ]),
          AlertMessage({
            msg: this.state.alert.msg,
            show: this.state.alert.showMsg,
            type: this.state.alert.type
          })
        ])
      )
    } else {
      return ("")
    }
  }
});
