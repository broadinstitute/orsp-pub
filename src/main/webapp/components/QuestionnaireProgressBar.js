import { Component } from 'react';
import { hh, div, h, p } from 'react-hyperscript-helpers';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';

export const QuestionnaireProgressBar = hh(class QuestionnaireProgressBar extends Component {

  render() {
    return (
      div({className: "questionContainer"}, [
        h(ProgressBar, { now: this.props.progress, className: (this.props.progress === 100 ? 'complete' : '') }, []),
        p({className: "questionTitle internationlCohortsTitle"}, ["International Questions Answered:"])
      ])
    )
  }
});
