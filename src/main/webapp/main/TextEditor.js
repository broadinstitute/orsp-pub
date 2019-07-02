import React from 'react';
import { Component, Fragment } from 'react';
import { div, hh, h, label } from 'react-hyperscript-helpers';
import '../components/Wizard.css';

import { Editor } from "@tinymce/tinymce-react";
import { Btn } from "../components/Btn";

export const TextEditor = hh(class Prueba extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content : ''
    };
    this.handleEditorChange = this.handleEditorChange.bind(this);

  }

  handleEditorChange(content, editor) {
    this.setState(prev => {
      prev.content =  content;
      return prev;
    });
  }

  render() {
    return (
      div({},[
        label({},["Add comment"]),
        h(Editor, {
          init: {
            selector: 'textarea',
            width: '100%',
            menubar: false,
            statusbar: false,
            plugins: "paste",
            paste_data_images: false
          },
          value: this.state.content,
          onEditorChange: this.handleEditorChange
        }, []),
        Btn({
          isRendered: true,
          action: { label: "Go", handler: () => console.log("CLICK!"), disabled: false }
        }),
      ])
    );
  }
});
