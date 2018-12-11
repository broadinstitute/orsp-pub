import { Component, Fragment } from 'react';
import { input, hh, h } from 'react-hyperscript-helpers';
import { InputFieldText } from './InputFieldText';
import { InputFieldSelect } from './InputFieldSelect';

export const Funding = hh(class Funding extends Component {

  render() {
    return h(Fragment, { key: this.props.id }, [
      InputFieldSelect({ options: this.props.options, label: this.props.sourceLabel, value: this.props.source }),
      InputFieldText({ label: this.props.sponsorLabel, value: this.props.sponsor }),
      InputFieldText({ label: this.props.identifierLabel, value: this.props.identifier })
    ]
    )
  }
});