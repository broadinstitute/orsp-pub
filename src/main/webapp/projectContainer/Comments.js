import { Component } from 'react';
import { div, hh } from 'react-hyperscript-helpers';
import { ProjectMigration } from '../util/ajax';

export const Comments = hh(class Comments extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      div({dangerouslySetInnerHTML: { __html: this.props.commentsContent } },[])
    )
  }
});
