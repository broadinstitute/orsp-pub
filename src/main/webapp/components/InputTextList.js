import { Component, Fragment } from 'react';
import { hh, h, div, label } from 'react-hyperscript-helpers';
import { Btn } from "./Btn";
import { InputFieldText } from "./InputFieldText";

export const InputTextList = hh(class InputTextList extends Component {

  render() {
    return (
      h(Fragment, {}, [
        div({ className: "row", style: { 'marginTop': '15px' } }, [
          div({ className: "col-lg-5 col-md-6 col-sm-10 col-9" }, [
            label({ className: "noMargin" }, ["Investigator degree(s)"])
          ]),
          div({ className: "col-lg-1 col-md-2 col-sm-2 col-3" }, [
            Btn({
              action: { labelClass: "glyphicon glyphicon-plus", handler: this.props.add },
              disabled: false,
              isRendered: !this.props.readOnly
            })
          ])
        ]),

        this.props.degrees.map((rd, idx) => {
          return h(Fragment, { key: idx }, [
            div({ className: "row" }, [
              div({ className: "col-lg-5 col-md-6 col-sm-10 col-9" }, [
                InputFieldText({
                  key: idx,
                  id: "degrees",
                  name: "degrees",
                  label: '',
                  readOnly: this.props.isReadOnly,
                  value: this.props.degrees[idx],
                  onChange: this.props.textHandler(idx)
                })
              ]),
              div({ className: "col-lg-1 col-md-2 col-sm-2 col-3", style: { "paddingTop": "12px" } }, [
                Btn({
                  action: { labelClass: "glyphicon glyphicon-remove", handler: () => this.props.removeDegree(idx) },
                })
              ])
            ])
          ])
        })
      ])
    )
  }
});
