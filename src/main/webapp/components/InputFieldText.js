import { Component } from 'react';
import { input, hh } from 'react-hyperscript-helpers';
import { InputField } from './InputField';

export const InputFieldText = hh(class InputFieldText extends Component {

  render() {

    return (
      InputField({ label: this.props.label }, [
        input({ type: 'text' })
      ])
    )
  }
});

// export default InputFieldText;
