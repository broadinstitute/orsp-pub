import { Component, React } from 'react';
import { u, hh, span, a, div, label, ul, li, p, hr, br, button, h } from 'react-hyperscript-helpers';
import { createObjectCopy, getDateString, isEmpty } from "../util/Utils";
import './QuestionnaireWorkflow.css';
import { UrlConstants } from '../util/UrlConstants';
import { Security } from './Security';
import { ConsentGroup, ProjectInfoLink } from '../util/ajax';
import { AlertMessage } from './AlertMessage';
import { LegacySecurityReview } from './LegacySecurityReview';
import { NewSecurityReview } from './NewSecurityReview';


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
  {id: '1', value: 'pre', label: 'Pre-analysis'}, 
  {id: '2', value: 'post', label: 'Post-analysis'},
  {id: '3', value: 'intra_analysis', label: 'Intra-analysis'}
];

const DATA_LOCATIONS = [
  {id: '1', value: 'terra', label: 'Terra'}, 
  {id: '2', value: 'gcsa', label: 'Google Cloud storage assets (e.g. Cloud Storage; BigQuery)'},
  {id: '3', value: 'gdrive', label: 'Google Drive'},
  {id: '4', value: 'onprem', label: 'On prem storage'},
  {id: '5', value: 'bil', label: 'Broad-issued laptop'},
  {id: '6', value: 'other', label: 'Other'}
];

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
          terraUrl: null,
          gcsaUrl: null,
          gdriveUrl: null,
          onpremUrl: null,
          bilCluster: null,
          otherText: null
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
      },
      prevSeqData: {}
    };
  }

  componentDidMount() {
    this.init();
  }

  init = async () => {
    let securityInfoData = createObjectCopy(this.props.sample);
    if (!isEmpty(securityInfoData.dataSecondaryUse)) {
      securityInfoData.dataSecondaryUse = securityInfoData.dataSecondaryUse.split(', ');
      securityInfoData.dataSecondaryUse.forEach(item => {
        securityInfoData[item] = true;
      });
    }
    this.setState({sampleProps: createObjectCopy(securityInfoData)});

    if (!isEmpty(securityInfoData.parentId)) {
      ConsentGroup.getCclBySequence(securityInfoData.parentId, (securityInfoData.sequenceNumber - 1))
      .then((data) => {
        let prevData = createObjectCopy(data.data[0]);
        ProjectInfoLink.getProjectDataLocations(prevData.id).then((data) => {
          prevData.dataLocations = createObjectCopy(data.data);
          this.setState({prevSeqData: prevData});
        })
      })
      .catch(err => console.log(err));
    }

    if (!isEmpty(securityInfoData.store)) {
      let store = securityInfoData.store.split(',');
      store.forEach(item => securityInfoData[item] = true);
    }

    if (!isEmpty(securityInfoData.textStore)) securityInfoData.otherStore = true;
    let dataLocations = !isEmpty(securityInfoData.dataLocations) ? createObjectCopy(securityInfoData.dataLocations) : this.state.securityInfoData.dataLocations;
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
    securityInfoData.approvalDocument = isEmpty(securityInfoData.approvalDocument) ? {fileName: null} : securityInfoData.approvalDocument;
    
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

  redirectToLatestVersion(consentCollectionId, projectKey, consentKey) {
    const baseUrl = window.location.origin;
    window.location.href = baseUrl + "/infoLink/showInfoLink?cclId=" + consentCollectionId + "&projectKey=" + projectKey + "&consentKey=" + consentKey;
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
    let tempSecInfo = createObjectCopy(this.state.tempSecurityInfoData);
    let secInfoData = createObjectCopy(this.state.securityInfoData);
    let isDSUEdited = false;
    tempSecInfo.dataSecondaryUse = !tempSecInfo.dataSecondaryUse ? [] : tempSecInfo.dataSecondaryUse;
    if(tempSecInfo.dataSecondaryUse.length !== secInfoData.dataSecondaryUse.length) {
      isDSUEdited = true;
    } else {
      isDSUEdited = !tempSecInfo.dataSecondaryUse.every(item => secInfoData.dataSecondaryUse.includes(item));
    }
    delete tempSecInfo.dataSecondaryUse;
    delete secInfoData.dataSecondaryUse;
    if (JSON.stringify(tempSecInfo) === JSON.stringify(secInfoData) && !isDSUEdited) {
      this.setState({
        alert: {showMsg: true, msg: "Please make changes to the form before submitting", type: "warning"}
      }, () => setTimeout(() => this.setState({alert: {showMsg: false}}), 3000));
      return;
    }
    const {approvalDocument, dataLocations, ...securityInfo} = this.state.securityInfoData;
    securityInfo.projectKey = securityInfo.projectKey ? securityInfo.projectKey : securityInfo.linkedProjectKey;
    if (!isEmpty(securityInfo.store) && typeof securityInfo.store !== 'string') securityInfo.store = securityInfo.store.join(',');
    securityInfo.deliveryDate = securityInfo.deliveryDate ? securityInfo.deliveryDate : null;
    securityInfo.releaseDate = securityInfo.releaseDate ? securityInfo.releaseDate : null;
    securityInfo.dataSecondaryUse = securityInfo.dataSecondaryUse.join(", ");
    const REQ_OBJ = {
      securityInfo, 
      file: approvalDocument,
      dataLocations: !isEmpty(dataLocations) ? this.getDataLocations(dataLocations) : []
    }
    ConsentGroup.update(REQ_OBJ)
    .then((data) => {
      let response = data.data;
      let savedData = createObjectCopy(this.state.securityInfoData);
      if (typeof savedData.store === 'object') savedData.store = savedData.store.join(',');
      savedData.questionnaireVersion = response.consentCollectionLink.questionnaireVersion;
      savedData.approvalDocument.uuid = response.docId;
      savedData.id = response.consentCollectionLink.id;
      savedData.sequenceNumber = response.consentCollectionLink.sequenceNumber;
      savedData.parentId = response.consentCollectionLink.parentId;
      this.setState({
        sampleProps: savedData,
        securityInfoData: savedData,
        alert: {msg: 'Data Security updated Successfully', showMsg: true, type: 'success'}
      }, () => {
        setTimeout(() => this.setState(prev => prev.alert.showMsg = false), 4000);
        this.redirectToLatestVersion(savedData.id, response.consentCollectionLink.projectKey, savedData.consentKey);
      });
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
    dataLocations.forEach((data, idx) => {
      data.researchStage = data.researchStage && data.researchStage.map(stage => {
        if(!isEmpty(stage)) return stage.label
      }).join(", ");
      data.dataStores = data.dataStores && data.dataStores.map(store => {
        if (!isEmpty(store)) return store.label
      }).join(", ");
      if(isEmpty(data.dataStores) && isEmpty(data.researchStage)) {
        dataLocations.splice(idx);
      }
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

  getBoolIfString = (value) => {
    if (isEmpty(value)) return null;
    if (typeof value === 'string') {
      return value === 'true' ? true : false;
    }
    return value;
  }

  render() {
    if (this.props.currentStep === this.props.step) {
      return(
        div([
          div({isRendered: !this.props.editSecurity}, [
            (this.state.sampleProps.questionnaireVersion === "v1" ? 
              LegacySecurityReview({
                sampleProps: this.state.sampleProps,
                stringAnswer: this.stringAnswer,
                sharingTypeAnswer: this.sharingTypeAnswer,
                secondaryUseAnswer: this.secondaryUseAnswer,
                storeOptions: this.storeOptions,
                getBoolIfString: this.getBoolIfString
              }) :
              NewSecurityReview({
                sampleProps: this.state.sampleProps,
                stringAnswer: this.stringAnswer,
                sharingTypeAnswer: this.sharingTypeAnswer,
                secondaryUseAnswer: this.secondaryUseAnswer,
                storeOptions: this.storeOptions,
                getBoolIfString: this.getBoolIfString,
                compareChange: this.props.compareChange,
                prevSeqData: this.state.prevSeqData
              })
            )
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
            div({style: {height: "40px", marginBottom: "20px"}}, [
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
