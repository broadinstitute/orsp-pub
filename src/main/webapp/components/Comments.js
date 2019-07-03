import { Component, Fragment } from 'react';
import { div, hh, h, br } from 'react-hyperscript-helpers';
import { TextEditor } from "../main/TextEditor";

export const Comments = hh(class Comments extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      h(Fragment, {}, [
        TextEditor({
          updateContent: this.props.updateContent
        }),
        br({}),
        div({dangerouslySetInnerHTML: { __html: this.props.commentsContent } },[])
      ])
    )
  }
});
