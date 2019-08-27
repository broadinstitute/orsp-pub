import React, { Component } from 'react';
import { h1, h, div, hh, h2, strong, ul, i, p, li, label, abbr, input, span, hr, button } from 'react-hyperscript-helpers';
import { InputFieldText } from "../components/InputFieldText";
import { InputYesNo } from "../components/InputYesNo";
import { Search } from "../util/ajax";
import { InputFieldTextArea } from "../components/InputFieldTextArea";
import { MultiSelect } from "../components/MultiSelect";
import { AlertMessage } from '../components/AlertMessage';
import { DataUse, ConsentGroup } from "../util/ajax";
import { isEmpty } from '../util/Utils';
import { UrlConstants } from '../util/UrlConstants';
import { spinnerService } from "../util/spinner-service";
import { Spinner } from "../components/Spinner";
import '../components/Btn.css';


const styles = {
  borderedContainer: {
    border: '1px solid #e3e3e3',
    padding: '19px',
    borderRadius: '4px',
    marginBottom: '20px'
  },
  inputGroup: {
    margin: '20px 0 15px 0'
  },
  alertPadding: {
    padding: '15px'
  }
};

export const DataUseRestrictionEdit = hh(class DataUseRestrictionEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consent: {
        projectKey: '',
        summary: ''
      },
      showError: false,
      restriction: this.initRestriction(),
      create: this.props.location.state !== undefined && this.props.location.state.create !== undefined ? this.props.location.state.create : false,
      consentKey: this.props.location.state.consentKey
    }
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    this.init();
    this.scrollTop();
  }

  initRestriction(restriction, reset) {
    let resp = {
      consentGroupKey: this.props.location.state.consentKey,
      noRestriction: restriction !== undefined ? restriction.noRestriction : '',
      hmbResearch: restriction !== undefined ? restriction.hmbResearch : '',
      diseaseRestrictions: restriction !== undefined ? this.getDiseasesFromRestriction(restriction) : [],
      generalUse: restriction !== undefined ? restriction.generalUse : '',
      populationOriginsAncestry: restriction !== undefined ? restriction.populationOriginsAncestry : '',
      commercialUseExcluded:  restriction !== undefined ? restriction.commercialUseExcluded : '',
      methodsResearchExcluded: restriction !== undefined ? restriction.methodsResearchExcluded : '',
      aggregateResearchResponse: restriction !== undefined ? restriction.aggregateResearchResponse : '',
      controlSetOption: restriction !== undefined ? restriction.controlSetOption : '',
      gender: restriction !== undefined ? restriction.gender : '',
      pediatric: restriction !== undefined ? restriction.pediatric : '',
      collaborationInvestigators: restriction !== undefined ? restriction.collaborationInvestigators : '',
      irb: restriction !== undefined ? restriction.irb : '',
      publicationResults: restriction !== undefined ? restriction.publicationResults : '',
      genomicResults: restriction !== undefined ? restriction.genomicResults : '',
      geographicalRestrictions: restriction !== undefined ? restriction.geographicalRestrictions : '',
      other: restriction !== undefined ? restriction.other : '',
      manualReview: restriction !== undefined ? restriction.manualReview : false,
      comments: restriction !== undefined ? restriction.comments : '',
      populationRestrictions: [],
      genomicSummaryResults: restriction !== undefined ? restriction.genomicSummaryResults : '',
      genomicPhenotypicData: restriction !== undefined ? restriction.genomicPhenotypicData : '',
      consentPIName: restriction !== undefined  && !isEmpty(restriction.consentPIName)  ? restriction.consentPIName : '', 
    };
    return resp;
  }

  init() {
    spinnerService.showAll();
    const params = new URLSearchParams(this.props.location.search);
    console.log(this.props.location);
    const restrictionId = params.get('restrictionId');
    console.log(this.state.consentKey);
    ConsentGroup.getConsentGroup(this.state.consentKey).then(result => {
      this.setState(prev => {
        prev.restriction.consentPIName = !isEmpty(result.data.extraProperties["consent"]) ? result.data.extraProperties["consent"] : "";
        prev.restriction.consentGroupKey = result.data.issue.projectKey;
        prev.consent = result.data.issue;
        prev.disabledConsent = true;
        return prev;
      }, () => {
        if(restrictionId === undefined) {
          spinnerService.hideAll();
        }
      })
    })
    if(restrictionId !== undefined) {
     DataUse.getRestriction(restrictionId).then(result => {
      let restriction = this.initRestriction(result.data.restriction);
      this.setState(prev => {
        prev.restriction = restriction;
        return prev;
      })
     }, () => spinnerService.hideAll())
    }
  }

  scrollTop() {
    $('html, body').animate({ scrollTop: top }, 'fast');
  }

  validateForm() {
    let validForm = false;
    if (this.state.restriction.noRestriction || this.state.restriction.generalUse ||
      this.state.restriction.hmbResearch || this.state.restriction.diseaseRestrictions.length > 0) {
        validForm = true;
    }
    let showError = !validForm;
    this.setState(prev => {
      prev.showError = showError;
      return prev;
    });
    return validForm;
  }

  submit() {
    if (this.validateForm()) {
      let restriction = this.state.restriction;
      restriction.diseaseRestrictions = this.getDiseases(this.state.restriction.diseaseRestrictions)
      DataUse.createRestriction(restriction).then(resp => {
        if (this.state.create) {
          this.props.history.push({
            pathname: '/newConsentGroup/main',
            search: '?consentKey=' + this.state.consentKey,
            state: { issueType: 'consent-group', tab: 'documents', consentKey: this.state.consentKey }
          })
        } else {
          this.props.history.push({
            pathname: '/newConsentGroup/main',
            search: '?consentKey=' + this.state.consentKey,
            pathname: UrlConstants.restrictionUrl,
            search: '?restrictionId=' + this.props.restrictionId,
            state: { issueType: 'consent-group', tab: 'documents', consentKey: this.state.consentKey }
          })
        }
      }).catch(error => {
        this.setState(() => { throw error; });
      });
    } else {
      this.scrollTop();
    }
  }

  handleRadioChange = (e, field, value) => {
    if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    }
    this.setState(prev => {
      prev.restriction[field] = value;
      return prev;
    });
  }

  handleControlSetChange = (e) => {
    let name = e.target.name;
    this.setState(prev => {
      if (name === 'controlSetOptionYes') {
        prev.restriction.controlSetOption = 'Yes';
      } else if (name === 'controlSetOptionNo') {
        prev.restriction.controlSetOption = 'No';
      } else if (name === 'controlSetOptionUnspecified') {
        prev.restriction.controlSetOption = 'Unspecified';
      }
      return prev;
    });
  }

  handleResearchChange = (e) => {
    let name = e.target.name;
    this.setState(prev => {
      if (name === 'agregateResearchYes') {
        prev.restriction.aggregateResearchResponse = 'Yes';
      } else if (name === 'agregateResearchNo') {
        prev.restriction.aggregateResearchResponse = 'No';
      } else if (name === 'agregateResearchUnspecified') {
        prev.restriction.aggregateResearchResponse = 'Unspecified';
      }
      return prev;
    });
  }

  handleGenderChange = (e) => {
    let name = e.target.name;
    this.setState(prev => {
      if (name === 'female') {
        prev.restriction.gender = 'female';
      } else if (name === 'male') {
        prev.restriction.gender = 'male';
      } else if (name === 'na') {
        prev.restriction.gender = 'na';
      }
      return prev;
    });
  }


  genomicHandlerChange = (e) => {
    let name = e.target.name;
    this.setState(prev => {
      if (name === 'genomicYes') {
        prev.restriction.genomicPhenotypicData = 'Yes';
      } else if (name === 'genomicNo') {
        prev.restriction.genomicPhenotypicData = 'No';
      } else if (name === 'genomicUnspecified') {
        prev.restriction.genomicPhenotypicData = 'Unspecified';
      }
      return prev;
    });
  }

  handleNoRestrictionRadioChange = (e, field, value) => {
    value = this.getValue(value);
    if (value) {
      this.setState(prev => {
        prev.restriction.noRestriction = true;
        prev.restriction.generalUse = false;
        prev.restriction.hmbResearch = false;
        prev.restriction.diseaseRestrictions = [];
        prev.restriction.controlSetOption = 'No';
        return prev;
      }, () => this.validateForm());
    } else {
      this.setFieldValue(field, value);
    }
  }

  setFieldValue(field, value) {
    this.setState(prev => {
      prev.restriction[field] = value;
      return prev;
    });
  }

  getValue(value) {
    if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    }
    return value;
  }

  /*
  See https://broadinstitute.atlassian.net/browse/GAWB-3210
  General Use, HMB, and Disease Restrictions are intertwined and exclusive. One has to
  choose one of the three.
  * GRU means HMB == no && no diseases && controlSet == yes
  * HMB means GRU == no && no diseases && POA == yes
  * Diseases means GRU == no && HMB == no && POA == yes
  */
  handleGeneralUseRadioChange = (e, field, value) => {
    value = this.getValue(value);
    if (value) {
      this.setState(prev => {
        prev.restriction.hmbResearch = false;
        prev.restriction.controlSetOption = 'No';
        prev.restriction.diseaseRestrictions = [];
        prev.restriction.generalUse = true;
        return prev;
      }, () => this.validateForm());
    } else {
      this.setFieldValue(field, value);
    }
  }

  handleGenomicResultChange = (e, field, value) => {
    value = this.getValue(value);
    if (value) {
      this.setState(prev => {
        prev.restriction.genomicResults = true;
        prev.restriction.controlSetOption = 'No';
        prev.restriction.diseaseRestrictions = [];
        prev.restriction.generalUse = true;
        return prev;
      });
    } else {
      this.setFieldValue(field, value);
    }
  }

  handleHmbResearchChange = (e, field, value) => {
    value = this.getValue(value);
    if (value) {
      this.setState(prev => {
        prev.restriction.generalUse = false;
        prev.restriction.diseaseRestrictions = [];
        prev.restriction.populationOriginsAncestry = true;
        prev.restriction.hmbResearch = true;
        return prev;
      }, () => this.validateForm());
    } else {
      this.setFieldValue(field, value);
    }
  }

  loadDOIDOptions = (query, callback) => {
    if (query.length > 2) {
      Search.getSourceDiseases(query)
        .then(response => {
          let options = response.data.map(function (item) {
            return {
              key: item.id,
              value: item.definition[0],
              label: item.label
            };
          });
          callback(options);
        }).catch(error => {
          this.setState(() => { throw error; });
        });
    }
  };

  loadPopulationOptions = (query, callback) => {
    if (query.length > 2) {
      Search.getMatchingPopulationOntologies(query)
        .then(response => {
          let options = response.data.map(function (item) {
            return {
              key: item.id,
              label: item.label,
              value: item.id
            };
          });
          callback(options);
        }).catch(error => {
          this.setState(() => { throw error; });
        });
    }
  };

  handleDiseaseChange = (data, action) => {
    this.setState(prev => {
      if (data !== null) {
        prev.restriction.diseaseRestrictions = data;
        prev.restriction.noRestriction = false;
        prev.restriction.generalUse = false;
        prev.restriction.hmbResearch = false;
        prev.restriction.populationOriginsAncestry = false;
        prev.restriction.controlSetOption = 'Yes';
      } else {
        prev.restriction.diseaseRestrictions = [];
      }
      return prev;
    }, () => {
      if(this.state.restriction.diseaseRestrictions.length > 0) {
        this.validateForm();
      }
    });
  };

  handlePopulationChange = (data, action) => {
    this.setState(prev => {
      if (data !== null) {
        prev.restriction.populationRestrictions = data;
        prev.restriction.manualReview = true;
      } else {
        prev.restriction.populationRestrictions = [];
      }
      return prev;
    });
  };

  handleGeographicalRestrictions = (e) => {
    const { name = '', value = '' } = e.target;
    this.setState(prev => {
      prev.restriction.geographicalRestrictions = value;
      if (!isEmpty(value)) {
        prev.restriction.manualReview = true;
      }
      return prev;
    });
  }

  handleRadioRelatedMRChange = (e, field, value) => {
    value = this.getValue(value);
    if (value) {
      this.setState(prev => {
        prev.restriction.collaborationInvestigators = true;
        prev.restriction.manualReview = true;
        prev.restriction.irb = true;
        return prev;
      });
    } else {
      this.setFieldValue(field, value);
    }
  }

  changeTextHandler = (e) => {
    const { name = '', value = '' } = e.target;
    this.setState(prev => {
      prev.restriction[name] = value;
      return prev;
    });
  };

  handleRadioIRB = (e, field, value) => {
    value = this.getValue(value);
    if (value) {
      this.setState(prev => {
        prev.restriction.manualReview = true;
        prev.restriction.irb = true;
        return prev;
      });
    } else {
      this.setFieldValue(field, value);
    }
  }

  reset = (e) => {
    let restriction = this.initRestriction();
    restriction.consentPIName = this.state.restriction.consentPIName
    this.setState(prev => {
      prev.restriction = restriction;
      return prev;
    });
  }

  getDiseases(diseases) {
    return diseases.map(disease =>
        disease.key
    );
  }

  getDiseasesFromRestriction(restriction) {
    let diseases = [];
    if(restriction.diseaseRestrictions !== null) {
      let diseases = restriction.diseaseRestrictions.map(disease => {
        diseases.push( {
          key: disease,
          label: disease
        })
      })
    }
    return diseases;
  }

  render() {
    return (
      div({}, [
        h1({ className: styles.headerTitle }, [(this.state.create ? 'Create ' : 'Edit ') + 'Data Use Restrictions for ' + this.state.consentKey + ': ' + this.state.consent.summary]),
        div({ style: styles.borderedContainer }, [
          AlertMessage({
            msg: 'At least one of NRES, GRU, HMB, or a Disease Restriction must be selected.',
            show: this.state.showError,
            type: 'danger'
          }),
          InputFieldText({
            label: "Consent Group",
            disabled: true,
            value: this.state.restriction.consentGroupKey,
            onChange: () => {}
          })
        ]),

        div({ style: styles.borderedContainer }, [
          InputFieldText({
            label: "Principal Investigator listed on the informed consent form",
            disabled: true,
            value: this.state.restriction.consentPIName,
            onChange: this.changeTextHandler,
            name: 'consentPIName'
          })
        ]),

        h2({}, ['Data Use Limitations']),
        div({ style: styles.borderedContainer }, [
          div({ className: "row" }, [
            div({ className: "col-sm-7" }, [
              InputYesNo({
                id: "radioNoRestriction",
                name: "noRestriction",
                value: this.state.restriction.noRestriction,
                label: "Data is available for future research with no restrictions [NRES]",
                readOnly: false,
                onChange: this.handleNoRestrictionRadioChange
              })
            ]),
            div({ className: "col-sm-4 alert alert-info col-sm-offset-1", style: styles.alertPadding }, [
              "Selecting No Restriction ", strong({}, ["[NRES]"]),
              ":",
              ul({}, [
                li({}, [
                  "Disables ", strong({}, ["[GRU]"])
                ]),
                li({}, [
                  "Disables ", strong({}, ["[HMB]"])
                ]),
                li({}, [
                  "Clears all Disease Restrictions ", strong({}, ["[DS]"])
                ]),
                li({}, [
                  "Enables Control Set Usage ", strong({}, ["[CTRL]"])
                ])
              ])
            ])
          ]),
          div({ className: "row" }, [
            div({ className: "col-sm-7" }, [
              InputYesNo({
                id: "radioGeneralUse",
                name: "generalUse",
                value: this.state.restriction.generalUse,
                label: "Data is available for future general research use [GRU]",
                readOnly: false,
                onChange: this.handleGeneralUseRadioChange
              })
            ]),
            div({ className: "col-sm-4 alert alert-info col-sm-offset-1", style: styles.alertPadding }, [
              "Selecting General Use ", strong({}, ["[GRU]"]),
              ":",
              ul({}, [
                li({}, [
                  "Disables ", strong({}, ["[HMB]"])
                ]),
                li({}, [
                  "Clears all Disease Restrictions ", strong({}, ["[DS]"])
                ]),
                li({}, [
                  "Enables Control Set Usage ", strong({}, ["[CTRL]"])
                ])
              ])
            ])
          ]),

          div({ className: "row" }, [
            div({ className: "col-sm-7" }, [
              InputYesNo({
                id: "radioHmbResearch",
                name: "hmbResearch",
                value: this.state.restriction.hmbResearch,
                label: "Data is limited for health/medical/biomedical research [HMB]",
                readOnly: false,
                onChange: this.handleHmbResearchChange
              })
            ]),

            div({ className: "col-sm-4 alert alert-info col-sm-offset-1", style: styles.alertPadding }, [
              "Selecting Health, Medical, Biomedical ", strong({}, ["[DS]"]),
              ":",
              ul({}, [
                li({}, [
                  "Disables ", strong({}, ["[GRU]"])
                ]),
                li({}, [
                  "Clears Disease Restrictions ", strong({}, ["[DS]"])
                ]),
                li({}, [
                  "Prevents Population Origins or Ancestry Usage ", strong({}, ["[POA]"])
                ])
              ])
            ])
          ]),

          div({ className: "row" }, [
            div({ className: "col-sm-7" }, [
              MultiSelect({
                id: "diseasesSelect",
                label: "Please select",
                name: "otherDiseaseSpecify",
                isDisabled: false,
                loadOptions: this.loadDOIDOptions,
                handleChange: this.handleDiseaseChange,
                value: this.state.restriction.diseaseRestrictions,
                placeholder: "Start typing the name of the disease",
                isMulti: true,
                edit: false,
                isClearable: true
              })
            ]),
            div({ className: "col-sm-4 alert alert-info col-sm-offset-1", style: styles.alertPadding }, [
              "Choosing a disease restriction ", strong({}, ["[DS]"]),
              ":",
              ul({}, [
                li({}, [
                  "Disables ", strong({}, ["[GRU]"])
                ]),
                li({}, [
                  "Disables ", strong({}, ["[HMB]"])
                ]),
                li({}, [
                  "Prevents Population Origins or Ancestry Usage ", strong({}, ["[POA]"])
                ])
              ])
            ])
          ])
        ]),
        div({ style: styles.borderedContainer }, [
          InputYesNo({
            id: "radioPopulationOriginsAncestry",
            name: "populationOriginsAncestry",
            value: this.state.restriction.populationOriginsAncestry,
            label: "Future use of population origins or ancestry is prohibited [POA]",
            readOnly: false,
            onChange: this.handleRadioChange
          })
        ]),
        div({ style: styles.borderedContainer }, [
          InputYesNo({
            id: "radioCommercialUseExcluded",
            name: "commercialUseExcluded",
            value: this.state.restriction.commercialUseExcluded,
            label: "Future commercial use is prohibited [NCU]",
            readOnly: false,
            onChange: this.handleRadioChange
          })
        ]),
        div({ style: styles.borderedContainer }, [
          InputYesNo({
            id: "radioMethodsResearchExcluded",
            name: "methodsResearchExcluded",
            value: this.state.restriction.methodsResearchExcluded,
            label: "Future use for methods research (analytic/software/technology development) is prohibited [NMDS]",
            readOnly: false,
            onChange: this.handleRadioChange
          })
        ]),
        div({ style: styles.borderedContainer, className: "radioContainer" }, [
          label({ className: "inputFieldLabel" }, ["Future use of aggregate-level data for general research purposes is prohibited [NAGR]"]),
          label({ className: "radioOptions" }, [
            input({ type: "radio", checked: this.state.restriction.aggregateResearchResponse === 'Yes', onChange: this.handleResearchChange, name: 'agregateResearchYes' }, []),
            span({ className: "radioCheck" }, []),
            span({ className: "radioLabel" }, ["Yes"])
          ]),
          label({ className: "radioOptions" }, [
            input({ type: "radio", checked: this.state.restriction.aggregateResearchResponse === 'No', onChange: this.handleResearchChange, name: 'agregateResearchNo' }, []),
            span({ className: "radioCheck" }, []),
            span({ className: "radioLabel" }, ["No"])
          ]),
          label({ className: "radioOptions" }, [
            input({ type: "radio", checked: this.state.restriction.aggregateResearchResponse === 'Unspecified', onChange: this.handleResearchChange, name: 'agregateResearchUnspecified' }, []),
            span({ className: "radioCheck" }, []),
            span({ className: "radioLabel" }, ["Unspecified"])
          ])
        ]),
        div({ style: styles.borderedContainer, className: "radioContainer" }, [
          label({ className: "inputFieldLabel" }, ["Future as a control set for diseases other than those specified is prohibited [CTRL]"]),
          label({ className: "radioOptions" }, [
            input({ type: "radio", checked: this.state.restriction.controlSetOption === 'Yes', onChange: this.handleControlSetChange, name: 'controlSetOptionYes' }, []),
            span({ className: "radioCheck" }, []),
            span({ className: "radioLabel" }, ["Yes"])
          ]),
          label({ className: "radioOptions" }, [
            input({ type: "radio", checked: this.state.restriction.controlSetOption === 'No', onChange: this.handleControlSetChange, name: 'controlSetOptionNo' }, []),
            span({ className: "radioCheck" }, []),
            span({ className: "radioLabel" }, ["No"])
          ]),
          label({ className: "radioOptions" }, [
            input({ type: "radio", checked: this.state.restriction.controlSetOption === 'Unspecified', onChange: this.handleControlSetChange, name: 'controlSetOptionUnspecified' }, []),
            span({ className: "radioCheck" }, []),
            span({ className: "radioLabel" }, ["Unspecified"])
          ])
        ]),
        div({ style: styles.borderedContainer, className: "radioContainer" }, [
          label({ className: "inputFieldLabel" }, ["Future use is limited to research involving a particular gender [RS-M] / [RS-FM]"]),
          label({ className: "radioOptions" }, [
            input({ type: "radio", checked: this.state.restriction.gender === 'male', onChange: this.handleGenderChange, name: 'male' }, []),
            span({ className: "radioCheck" }, []),
            span({ className: "radioLabel" }, ["Male"])
          ]),
          label({ className: "radioOptions" }, [
            input({ type: "radio", checked: this.state.restriction.gender === 'female', onChange: this.handleGenderChange, name: 'female' }, []),
            span({ className: "radioCheck" }, []),
            span({ className: "radioLabel" }, ["Female"])
          ]),
          label({ className: "radioOptions" }, [
            input({ type: "radio", checked: this.state.restriction.gender === 'na', onChange: this.handleGenderChange, name: "na" }, []),
            span({ className: "radioCheck" }, []),
            span({ className: "radioLabel" }, ["N/A"])
          ])
        ]),
        div({ style: styles.borderedContainer }, [
          InputYesNo({
            id: "radioPediatric",
            name: "pediatric",
            value: this.state.restriction.pediatric,
            label: "Future use is limited to pediatric research [RS-PD]",
            readOnly: false,
            onChange: this.handleRadioChange

          })
        ]),
        div({ style: styles.borderedContainer }, [
          MultiSelect({
            id: "populationRestrictionsSelect",
            label: "Future use is limited to research involving a specific population [RS-POP] ",
            name: "populationRestrictions",
            isDisabled: false,
            loadOptions: this.loadPopulationOptions,
            handleChange: this.handlePopulationChange,
            value: this.state.restriction.populationRestrictions,
            placeholder: "",
            isMulti: true,
            edit: false,
            isClearable: true
          })
        ]),
        h2({}, ['Terms of Use']),
        div({ style: styles.borderedContainer, className: "radioContainer" }, [
          label({ className: "inputFieldLabel" }, ["Did participants consent to the use of their genomic and phenotypic data for future research and broad sharing?"]),
          label({ className: "radioOptions" }, [
            input({ type: "radio", value: "Yes", checked: this.state.restriction.genomicPhenotypicData === 'Yes', name: 'genomicYes', onChange: this.genomicHandlerChange }, []),
            span({ className: "radioCheck" }, []),
            span({ className: "radioLabel" }, ["Yes"])
          ]),
          label({ className: "radioOptions" }, [
            input({ type: "radio", value: "No", checked: this.state.restriction.genomicPhenotypicData === 'No', name: 'genomicNo', onChange: this.genomicHandlerChange }, []),
            span({ className: "radioCheck" }, []),
            span({ className: "radioLabel" }, ["No"])
          ]),
          label({ className: "radioOptions" }, [
            input({ type: "radio", value: "Unspecified", checked: this.state.restriction.genomicPhenotypicData === 'Unspecified', name: 'genomicUnspecified', onChange: this.genomicHandlerChange }, []),
            span({ className: "radioCheck" }, []),
            span({ className: "radioLabel" }, ["Unspecified"])
          ])
        ]),
        div({ style: styles.borderedContainer }, [
          InputYesNo({
            id: "radioCollaborationInvestigators",
            name: "collaborationInvestigators",
            value: this.state.restriction.collaborationInvestigators,
            label: "Collaboration with the primary study investigators required [COL-XX]",
            readOnly: false,
            onChange: this.handleRadioChange
          }),
          hr({}, []),
          div({ style: styles.inputGroup }, [
            InputYesNo({
              id: "radioIrb",
              name: "irb",
              value: this.state.restriction.irb,
              label: "Ethics committee approval required?",
              readOnly: false,
              onChange: this.handleRadioIRB
            })
          ]),
          hr({}, []),
          div({ style: styles.inputGroup }, [
            InputYesNo({
              id: "radioPublicationResults",
              name: "publicationResults",
              value: this.state.restriction.publicationResults,
              label: "Publication of results of studies using the data is required [PUB]",
              readOnly: false,
              onChange: this.handleRadioChange
            })
          ]),
          hr({}, []),
          div({ style: styles.inputGroup }, [
            InputYesNo({
              id: "radioGenomicResults",
              name: "genomicResults",
              value: this.state.restriction.genomicResults,
              label: "Are the genomic summary results (GSR) from this study to be made available only through controlled-access?",
              readOnly: false,
              onChange: this.handleRadioChange
            })
          ]),
          hr({ isRendered: this.state.restriction.genomicResults }, []),
          div({ isRendered: this.state.restriction.genomicResults, style: styles.inputGroup }, [
            p({className: "inputFieldLabel"}, ["If ", i({}, ["Yes"]), ", please explain."]),
            InputFieldTextArea({
              disabled: false,
              value: this.state.restriction.genomicSummaryResults,
              name: 'genomicSummaryResults',
              onChange: this.changeTextHandler
            })
          ]),
          hr({}, []),
          div({ style: styles.inputGroup }, [
            p({className: "inputFieldLabel"}, ["Geographical restrictions?"]),
            InputFieldText({
              disabled: false,
              value: this.state.restriction.geographicalRestrictions,
              name: 'geographicalRestrictions',
              onChange: this.handleGeographicalRestrictions
            })
          ]),
          hr({}, []),
          div({ style: styles.inputGroup }, [
            label({className: "inputFieldLabel"}, ["Other terms of use?"]),
            InputFieldTextArea({
              disabled: false,
              value: this.state.restriction.other,
              name: 'other',
              onChange: this.changeTextHandler
            })
          ]),
          div({}, [
            InputYesNo({
              id: "radioManualReview",
              name: "manualReview",
              value: this.state.restriction.manualReview,
              label: "Future use of this data requires manual review",
              readOnly: false,
              onChange: this.handleRadioChange
            })
          ])
        ]),
        div({ style: styles.borderedContainer }, [
          label({className: "inputFieldLabel"}, ["Comments (ORSP Use Only)"]),
          InputFieldTextArea({
            disabled: false,
            value: this.state.restriction.comments,
            name: 'comments',
            onChange: this.changeTextHandler
          })
        ]),
        div({ className: "modal-footer", style: { 'marginTop': '15px' } }, [
          button({ className: "btn btn-default", onClick: this.reset }, ["Reset"]),
          button({ className: "btn btn-primary", onClick: this.submit }, ["Save"])
        ]),
        h(Spinner, {
          name: "mainSpinner", group: "orsp", loadingImage: component.loadingImage
        })
      ])
    )
  }
});
export default DataUseRestrictionEdit;
