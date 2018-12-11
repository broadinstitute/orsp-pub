import { Component } from 'react';
import { input, hh, div, label } from 'react-hyperscript-helpers';
import { InputField } from './InputField';

export const InputYesNo = hh(class InputYesNo extends Component {

  state = {answer: ""};

  render() {
    return (
      InputField({ label: this.props.label }, [
        div({ className: "radio" }, [
          label({}, [
            input({ type: "radio", value: "yes", checked: this.state.answer === "yes", onChange: this.props.handleChange }),
            'Yes',
          ])
        ]),
        div({ className: "radio" }, [
          label({}, [
            input({ type: "radio", value: "no", checked: this.state.answer === "no", onChange: this.props.handleChange }),
            'No'
          ])
        ])
      ])
    )
  }
});

/*
InputField({ label: this.props.label }, [
        div({ className: "radio" }, [
          label({}, [
            input({ type: "radio",
                    value: "yes",
                    checked: this.state.answer === "yes",
                    onChange: this.props.handleChange() }),
            'Yes',
          ])
        ]),
        div({ className: "radio" }, [
          label({}, [
            input({ type: "radio",
                    value: "no",
                    checked: this.state.answer === "no",
                    onChange: this.props.handleChange() }),
            'No'
          ])
        ])
      ])
*/