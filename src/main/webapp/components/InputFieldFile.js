import { Component } from 'react';
import { input, hh, p } from 'react-hyperscript-helpers';
import { InputField } from './InputField';
import './InputField.css';

export const InputFieldFile = hh(class InputFieldFile extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      InputField({ label: this.props.label, aclaration: this.props.aclaration }, [
        input({ type: 'file', onChange: this.props.callback, className: "form-control inputFieldText" }),
        p({}, [this.props.nameFiles !== undefined ? this.props.nameFiles.fileData.name : ''])
      ])
    )
  }
});
