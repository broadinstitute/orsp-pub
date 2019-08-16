import React, { Component } from 'react';
import { h1, div, hh,h2, strong, ul, li, label, abbr, input } from 'react-hyperscript-helpers';
import { InputFieldText } from "../components/InputFieldText";

const styles = {
  borderedContainer: {
    border: '1px solid #e3e3e3',
    padding: '19px',
    borderRadius: '4px',
    marginBottom: '20px'
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

            div({className: "col-sm-4 alert alert-info"}, [
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
          ])
        ]),
      ])
    )
  }
});
export default DataUseRestrictionEdit;
