import { Component, Fragment } from 'react';
import { hh, h, div } from 'react-hyperscript-helpers';
import { Btn } from "./Btn";
import { InputFieldText } from "./InputFieldText";

export const InputTextList = hh(class InputTextList extends Component {

  render() {
    return (
      h(Fragment, {}, [
        div({ className: "col-lg-1 col-md-2 col-sm-2 col-3" }, [
          Btn({
            action: { labelClass: "glyphicon glyphicon-plus", handler: this.props.add },
            disabled: false
          }),
        ]),
        this.props.degrees.map((rd, idx) => {
          return h(Fragment, { key: idx }, [
            div({ className: "row" }, [
              div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                InputFieldText({
                  key: idx,
                  id: "degrees",
                  name: "degrees",
                  label: "Investigator degree(s)",
                  readOnly: this.props.isReadOnly,
                  value: this.props.degrees[idx],
                  onChange: this.props.textHandler(idx)
                })
              ])
            ]),
            div({ className: "col-lg-1 col-md-2 col-sm-2 col-3" }, [
              Btn({
                action: { labelClass: "glyphicon glyphicon-remove", handler: () => this.props.removeDegree(idx) },
              }),
            ])
          ])
        })
      ])
    )
  }
});
