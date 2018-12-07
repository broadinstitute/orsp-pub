import { Component } from 'react';
import { input, hh } from 'react-hyperscript-helpers';
import { InputField } from './InputField';

export const InputFieldFile = hh(class InputFieldFile extends Component {

  render() {

    return (
      InputField({ label: this.props.label }, [
        input({ type: 'file', onChange: this.props.callback})
      ])
    )
  }
});

// export default InputFieldText;
