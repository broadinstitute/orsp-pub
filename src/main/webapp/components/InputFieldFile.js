import { Component } from 'react';
import { input, hh, p, div } from 'react-hyperscript-helpers';
import { InputField } from './InputField';
import './InputField.css';

export const InputFieldFile = hh(class InputFieldFile extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      div({ className: "inputFileContainer" }, [
        InputField({ label: this.props.label, aclaration: this.props.aclaration }, [
          div({ className: "col-lg-2 col-md-3 col-sm-3 col-12 btn buttonSecondary buttonUpload" }, [
            "Select File",
            input({ type: 'file', onChange: this.props.callback, className: "inputFieldFile" })
          ])
        ]),
        div({ className: "fileNameContainer col-lg-10 col-md-9 col-sm-9 col-12" }, [
          p({ className: "fileName" }, [this.props.nameFiles !== undefined ? this.props.nameFiles.fileData.name : ''])
        ])
      ])
    )
  }
});
