import { Component } from 'react';
import { hh, div, h } from 'react-hyperscript-helpers';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';

export const QuestionnaireProgressBar = hh(class QuestionnaireProgressBar extends Component {

  render() {

    return (
      h(ProgressBar, { now: this.props.progress }, [])
    )
  }
});
