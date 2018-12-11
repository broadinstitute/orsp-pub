import { Component } from 'react';
import { React } from 'react';
import { hh, textarea } from 'react-hyperscript-helpers';
import { InputField } from './InputField';

export const InputFieldTextArea = hh(class InputFieldTextArea extends Component {

  render() {

    return (
      InputField({ label: this.props.label }, [
       textarea({ name: 'description', id: "txt_description", rows: "5" }),
      ])
    )
  }
});
