import React, { Component } from 'react';
import { h1, div, hh, h2, strong, ul, i, li, label, abbr, input, span, hr, button } from 'react-hyperscript-helpers';
import { InputFieldText } from "../components/InputFieldText";
import { InputYesNo } from "../components/InputYesNo";
import { Search } from "../util/ajax";
import { InputFieldTextArea } from "../components/InputFieldTextArea";
import { MultiSelect } from "../components/MultiSelect";
import { AlertMessage } from '../components/AlertMessage';
import { DataUse, ConsentGroup } from "../util/ajax";
import '../components/Btn.css';
import { isEmpty } from '../util/Utils';

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
      restriction: {
        consentPIName: '',
        consentGroupKey: '',
        noRestriction: '',
        hmbResearch: '',
        diseaseRestrictions: [],
        generalUse: '',
        populationOriginsAncestry: '',
        commercialUseExcluded: '',
        methodsResearchExcluded: '',
        aggregateResearchResponse: '',
        controlSetOption: '',
        gender: '',
        pediatric: '',
        collaborationInvestigators: '',
        irb: '',
        publicationResults: '',
        genomicResults: '',
        geographicalRestrictions: '',
        other: '',
        manualReview: false,
        comments: '',
        populationRestrictions: [],
        genomicSummaryResults: ''
      },
      create: this.props.location.state !== undefined && this.props.location.state.create !== undefined ? this.props.location.state.create : false,
      consentKey: ''//this.props.location.state.consentKey
    }
  }

  componentWillMount() {
    this.init();

  }

  init() {
    ConsentGroup.getConsentGroup('DEV-CG-5553').then(result => {
      this.setState(prev => {
        prev.restriction.consentGroupKey = result.data.issue.projectKey;
        prev.consent = result.data.issue;
        return prev;
      })
    })
  }

  validateForm() {
    if (this.state.restriction.noRestriction || this.state.restriction.generalUse ||
      this.state.restriction.hmbResearch || this.state.restriction.diseases.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  submit() {
    if (this.validateForm()) {
      // abrir spinner y redireccionar a dde estaba

    } else {
      this.setState(prev => {
        prev.showError = true;
        return prev;
      })
    }
  }
  handleRadioChange = (e, field, value) => {
    if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    }
    if (field === 'noRestriction' && value) {
      checkFields(value);
    }
    this.setState(prev => {
      prev.restriction[field] = value;
      return prev;
    });
  }

  handleNoRestrictionRadioChange = (e, field, value) => {
    value = this.getValue();
    if (value) {
      this.setState(prev => {
        prev.restriction.noRestriction = true;
        prev.restriction.generalUse = false;
        prev.restriction.hmbResearch = false;
        prev.restriction.diseaseRestrictions = [];
        prev.restriction.controlSetOption = false;
        return prev;
      });
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
        prev.restriction.controlSetOption = false;
        prev.restriction.diseaseRestrictions = [];
        prev.restriction.generalUse = true;
        return prev;
      });
    } else {
      this.setFieldValue(field, value);
    }
  }

  handleGenomicResultChange = (e, field, value) => {
    value = this.getValue(value);
    if (value) {
      this.setState(prev => {
        prev.restriction.genomicResults = true;
        prev.restriction.controlSetOption = false;
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
        return prev;
      });
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
        prev.restriction.controlSetOption = true;
      } else {
        prev.restriction.diseaseRestrictions = [];
      }
      return prev;
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

  handleGeographicalRestrictions = (e, field, value) => {
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
        return prev;
      });
    } else {
      this.setFieldValue(field, value);
    }

  }


  render() {
    return (
      div({}, [
        h1({ className: styles.headerTitle }, [this.state.create ? 'Create ' : 'Edit ' + 'Data Use Restrictions for ' + this.state.consent.projectKey + ':' + this.state.consent.summary]),
        div({ style: styles.borderedContainer }, [
          AlertMessage({
            msg: 'At least one of NRES, GRU, HMB, or a Disease Restriction must be selected.',
            show: this.state.showError,
            type: 'danger'
          }),
          InputFieldText({
            label: "Consent Group",
            disabled: true,
            value: this.state.restriction.consentGroupKey
          })
        ]),

        div({ style: styles.borderedContainer }, [
          InputFieldText({
            label: "Principal Investigator listed on the informed consent form",
            disabled: this.state.create ? false : true,
            value: ''
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
        div({ style: styles.borderedContainer }, [
          InputYesNo({
            id: "radioAggregateResearchResponse",
            name: "aggregateResearchResponse",
            value: this.state.restriction.aggregateResearchResponse,
            label: "Future use of aggregate-level data for general research purposes is prohibited [NAGR]",
            readOnly: false,
            onChange: this.handleRadioRelatedMRChange
          })
        ]),
        div({ style: styles.borderedContainer }, [
          InputYesNo({
            id: "radioControlSetOption",
            name: "controlSetOption",
            value: this.state.restriction.controlSetOption,
            label: "Future as a control set for diseases other than those specified is prohibited [CTRL]",
            readOnly: false,
            onChange: this.handleRadioChange
          })
        ]),
        div({ style: styles.borderedContainer, className: "radioContainer" }, [
          label({className: "inputFieldLabel"}, ["Future use is limited to research involving a particular gender [RS-M] / [RS-FM]"]),
          label({ className: "radioOptions" }, [
            input({ type: "radio", value: this.state.restriction.gender }, []),
            span({className: "radioCheck"}, []),
            span({className: "radioLabel"}, ["Male"])
          ]),
          label({ className: "radioOptions" }, [
            input({ type: "radio", value: this.state.restriction.gender }, []),
            span({className: "radioCheck"}, []),
            span({className: "radioLabel"}, ["Female"])
          ]),
          label({ className: "radioOptions" }, [
            input({ type: "radio", value: this.state.restriction.gender }, []),
            span({className: "radioCheck"}, []),
            span({className: "radioLabel"}, ["N/A"])
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
          label({className: "inputFieldLabel"}, ["Did participants consent to the use of their genomic and phenotypic data for future research and broad sharing?"]),
          label({ className: "radioOptions" }, [
            input({ type: "radio", value: "Yes" }, []),
            span({className: "radioCheck"}, []),
            span({className: "radioLabel"}, ["Yes"])
          ]),
          label({ className: "radioOptions" }, [
            input({ type: "radio", value: "No" }, []),
            span({className: "radioCheck"}, []),
            span({className: "radioLabel"}, ["No"])
          ]),
          label({ className: "radioOptions" }, [
            input({ type: "radio", value: "Unspecified" }, []),
            span({className: "radioCheck"}, []),
            span({className: "radioLabel"}, ["Unspecified"])
          ])
        ]),
        div({ style: styles.borderedContainer }, [
          InputYesNo({
            id: "radioCollaborationInvestigators",
            name: "collaborationInvestigators",
            value: this.state.restriction.collaborationInvestigators,
            label: "Collaboration with the primary study investigators required [COL-XX]",
            readOnly: false,
            onChange: this.handleRadioRelatedMRChange
          }),
          hr({}, []),
          div({ style: styles.inputGroup }, [
            InputYesNo({
              id: "radioIrb",
              name: "irb",
              value: this.state.restriction.irb,
              label: "Ethics committee approval required?",
              readOnly: false,
              onChange: this.handleRadioRelatedMRChange
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
            label({}, ["If ", i({}, ["Yes"]), ", please explain."]),
            InputFieldTextArea({
              disabled: false,
              value: this.state.restriction.genomicSummaryResults
            })
          ]),
          hr({}, []),
          div({ style: styles.inputGroup }, [
            label({}, ["Geographical restrictions?"]),
            InputFieldText({
              disabled: false,
              value: this.state.restriction.geographicalRestrictions,
              onChange: this.handleGeographicalRestrictions
            })
          ]),
          hr({}, []),
          div({ style: styles.inputGroup }, [
            label({}, ["Other terms of use?"]),
            InputFieldTextArea({
              disabled: false,
              value: this.state.restriction.other
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
          label({}, ["Comments (ORSP Use Only)"]),
          InputFieldTextArea({
            disabled: false,
            value: this.state.restriction.comments
          })
        ]),
        div({ className: "modal-footer", style: { 'marginTop': '15px' } }, [
          button({ className: "btn btn-default" }, ["Reset"]),
          button({ className: "btn btn-primary" }, ["Save"])
        ])
      ])
    )
  }
});
export default DataUseRestrictionEdit;
