import React, { Component } from 'react';
import { h1, div, hh,h2, strong, ul, li, label, abbr, input, span, hr, button } from 'react-hyperscript-helpers';
import { InputFieldText } from "../components/InputFieldText";
import { InputFieldTextArea } from "../components/InputFieldTextArea";
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
  }

  render() {
    return(
      div({},[
        h1({ className: styles.headerTitle }, ["Edit Data Use Restrictions for DEV-CG-4390: Lo Forte / 015"]),
        div({ style: styles.borderedContainer }, [
          InputFieldText({
            label: "Consent Group",
            disabled: true,
            value: "DEV-CG-4390"
          })
        ]),

        div({ style: styles.borderedContainer },[
          InputFieldText({
            label: "Principal Investigator listed on the informed consent form",
            disabled: true,
            value: "Lo Forte"
          })
        ]),

        h2({}, ['Data Use Limitations']),
        div({ style: styles.borderedContainer },[
          div({className: "row"},[
            div({className: "col-sm-7"},[
              label({}, [
                "Data is available for future research with no restrictions [", abbr({}, ["NRES"]), "]"
              ]),
              div({className: "pull-right"}, [
                label({className: "radio-inline"}, [
                  input({type: "radio", value: "Yes"}, []),
                  "Yes"
                ]),
                label({className: "radio-inline"}, [
                  input({type: "radio", value: "No"}, []),
                  "No"
                ])
              ])
            ]),

            div({className: "col-sm-4 alert alert-info col-sm-offset-1", style: styles.alertPadding}, [
              "Selecting No Restriction ", strong({},["[NRES]"]),
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

          div({className: "row"},[
            div({className: "col-sm-7"},[
              label({}, [
                "Data is available for future general research use [", abbr({}, ["GRU"]), "]"
              ]),
              div({className: "pull-right"}, [
                label({className: "radio-inline"}, [
                  input({type: "radio", value: "Yes"}, []),
                  "Yes"
                ]),
                label({className: "radio-inline"}, [
                  input({type: "radio", value: "No"}, []),
                  "No"
                ])
              ])
            ]),

            div({className: "col-sm-4 alert alert-info col-sm-offset-1", style: styles.alertPadding}, [
              "Selecting General Use ", strong({},["[GRU]"]),
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

          div({className: "row"},[
            div({className: "col-sm-7"},[
              label({}, [
                "Data is limited for health/medical/biomedical research [", abbr({}, ["HMB"]), "]"
              ]),
              div({className: "pull-right"}, [
                label({className: "radio-inline"}, [
                  input({type: "radio", value: "Yes"}, []),
                  "Yes"
                ]),
                label({className: "radio-inline"}, [
                  input({type: "radio", value: "No"}, []),
                  "No"
                ])
              ])
            ]),

            div({className: "col-sm-4 alert alert-info col-sm-offset-1", style: styles.alertPadding}, [
              "Selecting Health, Medical, Biomedical ", strong({},["[DS]"]),
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

          div({className: "row"},[
            div({className: "col-sm-7"},[
              label({}, [
                "Future use is limited to research involving the following disease area(s) [", abbr({}, ["DS"]), "] ",
                span({className: "badge addDiseaseRestriction"}, [
                  span({className: "glyphicon glyphicon-plus"}, [])
                ])
              ]),
              InputFieldText({
                label: "",
                disabled: false
              })
            ]),

            div({className: "col-sm-4 alert alert-info col-sm-offset-1", style: styles.alertPadding}, [
              "Choosing a disease restriction ", strong({},["[DS]"]),
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
      
        div({ style: styles.borderedContainer },[
          label({}, ["Future use of population origins or ancestry is prohibited [POA]"]),
          div({className: "pull-right"}, [
            label({className: "radio-inline"}, [
              input({type: "radio", value: "Yes"}, []),
              "Yes"
            ]),
            label({className: "radio-inline"}, [
              input({type: "radio", value: "No"}, []),
              "No"
            ])
          ])
        ]),
        div({ style: styles.borderedContainer },[
          label({}, ["Future commercial use is prohibited ", abbr({}, ["[NCU]"])]),
          div({className: "pull-right"}, [
            label({className: "radio-inline"}, [
              input({type: "radio", value: "Yes"}, []),
              "Yes"
            ]),
            label({className: "radio-inline"}, [
              input({type: "radio", value: "No"}, []),
              "No"
            ])
          ])
        ]),
        div({ style: styles.borderedContainer },[
          label({}, ["Future use for methods research (analytic/software/technology development) is prohibited [NMDS]"]),
          div({className: "pull-right"}, [
            label({className: "radio-inline"}, [
              input({type: "radio", value: "Yes"}, []),
              "Yes"
            ]),
            label({className: "radio-inline"}, [
              input({type: "radio", value: "No"}, []),
              "No"
            ])
          ])
        ]),
        div({ style: styles.borderedContainer },[
          label({}, ["Future use of aggregate-level data for general research purposes is prohibited [NAGR]"]),
          div({className: "pull-right"}, [
            label({className: "radio-inline"}, [
              input({type: "radio", value: "Yes"}, []),
              "Yes"
            ]),
            label({className: "radio-inline"}, [
              input({type: "radio", value: "No"}, []),
              "No"
            ])
          ])
        ]),
        div({ style: styles.borderedContainer },[
          label({}, ["Future as a control set for diseases other than those specified is prohibited [CTRL]"]),
          div({className: "pull-right"}, [
            label({className: "radio-inline"}, [
              input({type: "radio", value: "Yes"}, []),
              "Yes"
            ]),
            label({className: "radio-inline"}, [
              input({type: "radio", value: "No"}, []),
              "No"
            ])
          ])
        ]),
        div({ style: styles.borderedContainer },[
          label({}, ["Future use is limited to research involving a particular gender [RS-M] / [RS-FM]"]),
          div({className: "pull-right"}, [
            label({className: "radio-inline"}, [
              input({type: "radio", value: "Male"}, []),
              "Male"
            ]),
            label({className: "radio-inline"}, [
              input({type: "radio", value: "Female"}, []),
              "Female"
            ]),
            label({className: "radio-inline"}, [
              input({type: "radio", value: "N/A"}, []),
              "N/A"
            ])
          ])
        ]),
        div({ style: styles.borderedContainer },[
          label({}, ["Future use is limited to pediatric research [RS-PD]"]),
          div({className: "pull-right"}, [
            label({className: "radio-inline"}, [
              input({type: "radio", value: "Yes"}, []),
              "Yes"
            ]),
            label({className: "radio-inline"}, [
              input({type: "radio", value: "No"}, []),
              "No"
            ])
          ])
        ]),
        div({ style: styles.borderedContainer },[
          label({}, ["Future use is limited to research involving a specific population [RS-POP] ",
            span({className: "badge addPopulationRestriction"}, [
              span({className: "glyphicon glyphicon-plus"}, [])
            ])
          ]),
        ]),
        h2({}, ['Terms of Use']),
        div({ style: styles.borderedContainer },[
          label({}, ["Did participants consent to the use of their genomic and phenotypic data for future research and broad sharing?"]),
          div({className: "pull-right"}, [
            label({className: "radio-inline"}, [
              input({type: "radio", value: "Yes"}, []),
              "Yes"
            ]),
            label({className: "radio-inline"}, [
              input({type: "radio", value: "No"}, []),
              "No"
            ]),
            label({className: "radio-inline"}, [
              input({type: "radio", value: "Unspecified"}, []),
              "Unspecified"
            ])
          ])
        ]),
        div({ style: styles.borderedContainer },[
          div({style: styles.inputGroup}, [
            label({}, ["Collaboration with the primary study investigators required [COL-XX]"]),
            div({className: "pull-right"}, [
              label({className: "radio-inline"}, [
                input({type: "radio", value: "Yes"}, []),
                "Yes"
              ]),
              label({className: "radio-inline"}, [
                input({type: "radio", value: "No"}, []),
                "No"
              ])
            ])
          ]),
          hr({},[]),
          div({style: styles.inputGroup}, [
            label({}, ["Ethics committee approval required?"]),
            div({className: "pull-right"}, [
              label({className: "radio-inline"}, [
                input({type: "radio", value: "Yes"}, []),
                "Yes"
              ]),
              label({className: "radio-inline"}, [
                input({type: "radio", value: "No"}, []),
                "No"
              ])
            ])
          ]),
          hr({},[]),
          div({style: styles.inputGroup}, [
            label({}, ["Publication of results of studies using the data is required [PUB]"]),
            div({className: "pull-right"}, [
              label({className: "radio-inline"}, [
                input({type: "radio", value: "Yes"}, []),
                "Yes"
              ]),
              label({className: "radio-inline"}, [
                input({type: "radio", value: "No"}, []),
                "No"
              ])
            ])
          ]),
          hr({},[]),
          div({style: styles.inputGroup}, [
            label({}, ["Are the genomic summary results (GSR) from this study to be made available only through controlled-access?"]),
            div({className: "pull-right"}, [
              label({className: "radio-inline"}, [
                input({type: "radio", value: "Yes"}, []),
                "Yes"
              ]),
              label({className: "radio-inline"}, [
                input({type: "radio", value: "No"}, []),
                "No"
              ])
            ])
          ]),
          hr({},[]),
          div({style: styles.inputGroup}, [
            label({}, ["Geographical restrictions?"]),
            InputFieldText({
              disabled: false,
              value: ""
            })
          ]),
          hr({},[]),
          div({style: styles.inputGroup}, [
            label({}, ["Other terms of use?"]),
            InputFieldTextArea({
              disabled: false,
              value: ""
            })
          ]),
          div({}, [
            label({}, ["Future use of this data requires manual review"]),
            div({className: "pull-right"}, [
              label({className: "radio-inline"}, [
                input({type: "radio", value: "Yes"}, []),
                "Yes"
              ]),
              label({className: "radio-inline"}, [
                input({type: "radio", value: "No"}, []),
                "No"
              ])
            ])
          ])
        ]),
        div({ style: styles.borderedContainer }, [
          label({}, ["Comments (ORSP Use Only)"]),
          InputFieldTextArea({
            disabled: false,
            value: ""
          })
        ]),
        div({className: "modal-footer", style: {'marginTop' : '15px'}}, [
          button({className: "btn btn-default"}, ["Reset"]),
          button({className: "btn btn-primary"}, ["Save"])
        ])
      ])
    )
  }
});
export default DataUseRestrictionEdit;
