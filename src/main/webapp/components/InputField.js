import { Component } from 'react';
import { div, hh, p } from 'react-hyperscript-helpers';
import './InputField.css';

export const InputField = hh(class InputField extends Component {

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  render() {

    return (
      div({ className: "inputField" }, [
        p({ className: "inputFieldLabel" }, [this.props.label]),
        this.props.children
      ])
    )
  }
});

