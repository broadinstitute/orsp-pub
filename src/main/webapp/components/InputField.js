import { Component } from 'react';
import { div, hh } from 'react-hyperscript-helpers';

export const InputField = hh(class InputField extends Component {

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  render() {

    return (
      div({ style: {"margin":"3px", "padding":"2px 2px 2px 5px", "border": "solid 1px gray" } }, [
        div({}, [this.props.label]),
        this.props.children
      ])
    )
  }
});

// export default InputField;
