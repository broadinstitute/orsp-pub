import { Component } from 'react';
import { React } from 'react';
import { hh, textarea } from 'react-hyperscript-helpers';
import { InputField } from './InputField';
import './InputField.css';

export const InputFieldTextArea = hh(class InputFieldTextArea extends Component {

  render() {

    return (
      InputField({ label: this.props.label, aclaration: this.props.aclaration }, [
        textarea({ name: 'description', id: "txt_description", rows: "5", className: "form-control inputFieldTextarea" }),
      ])
    )
  }
});
