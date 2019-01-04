import { Component } from 'react';
import { input, hh, p, div, small, a } from 'react-hyperscript-helpers';
import { InputField } from './InputField';
import './InputField.css';

export const InputFieldFile = hh(class InputFieldFile extends Component {

  render() {

    return (
      div({ className: "inputFileContainer" }, [
        InputField({ label: this.props.label, moreInfo: this.props.moreInfo, error: this.props.error, errorMessage: this.props.errorMessage }, [
          div({ className: "col-lg-2 col-md-3 col-sm-3 col-12 btn buttonSecondary buttonUpload" }, [
            "Select File",
            input({ type: 'file', onChange: this.props.callback, className: "inputFieldFile" + (this.props.readOnly ? " readOnly" : "") })
          ]),
          div({ className: "fileNameContainer col-lg-10 col-md-9 col-sm-9 col-12" }, [
            p({ className: "fileName" }, [this.props.fileName != null ? this.props.fileName : '']),
            a({ className: "fileNameClear glyphicon glyphicon-remove", onClick: this.props.removeHandler }, [])
          ])
        ])
      ])
    )
  }
});
