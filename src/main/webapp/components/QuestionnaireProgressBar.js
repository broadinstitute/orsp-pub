import { Component } from 'react';
import { hh, div, h } from 'react-hyperscript-helpers';
import ProgressBar from 'react-bootstrap/ProgressBar';

export const QuestionnaireProgressBar = hh(class QuestionnaireProgressBar extends Component {

  render() {

    return (
      h(ProgressBar, { now: this.props.progress, className: (this.props.progress === 100 ? 'complete' : '') }, [])
    )
  }
});
