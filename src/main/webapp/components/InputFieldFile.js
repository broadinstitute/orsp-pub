import { Component } from 'react';
import { input, hh, p } from 'react-hyperscript-helpers';
import { InputField } from './InputField';

export const InputFieldFile = hh(class InputFieldFile extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      InputField({ label: this.props.label }, [
        input({ type: 'file', onChange: this.props.callback}),
        p({}, [this.props.nameFiles !== undefined ? this.props.nameFiles.fileData.name : ''])

      ])
    )
  }
});
