import { Component } from 'react';
import { div, hh } from 'react-hyperscript-helpers';

export const History = hh(class History extends Component {

  constructor(props) {
    super(props);
  }



  render() {
    return (
      div({dangerouslySetInnerHTML: { __html: this.props.historyContent } },[])
    )
  }
});
