import React from 'react';
import { Component, Fragment } from 'react';
import { div, hh, h, label } from 'react-hyperscript-helpers';
import '../components/Wizard.css';

import { Editor } from "@tinymce/tinymce-react";
import { Btn } from "../components/Btn";
import { Review } from "../util/ajax";

export const TextEditor = hh(class TextEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comment : ''
    };
    this.handleEditorChange = this.handleEditorChange.bind(this);
  }

  handleEditorChange = (comment, editor) => {
    this.setState(prev => {
      prev.comment =  comment;
      return prev;
    });
  };

  addComment = () => {

    Review.addComments(component.projectKey, this.state.comment).then(
      response => {
        console.log("FULLFILLED");
        this.setState(prev => {
          prev.comment = '';
        });
        this.props.updateContent();
      }
    ).catch(error =>
      this.setState(() => { throw error })
    )
  };

  render() {
    return (
      div({className: "well"},[
        label({},["Add comment"]),
        h(Editor, {
          init: {
            width: '100%',
            menubar: false,
            statusbar: false,
            plugins: "paste",
            paste_data_images: false
          },
          value: this.state.comment,
          onEditorChange: this.handleEditorChange
        }, []),
        Btn({
          isRendered: true,
          action: {
            label: "Add",
            handler: this.addComment,
            disabled: false
          }
        }),
      ])
    );
  }
});
