import { Component } from 'react';
import { button, hh } from 'react-hyperscript-helpers';

export const Btn = hh(class Btn extends Component {

  render() {

    return (
      button({ id: "btn", onClick: this.props.action.handler, disabled: this.props.disabled }, [this.props.action.label])
    )
  }
});
