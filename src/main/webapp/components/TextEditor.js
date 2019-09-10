import React from 'react';
import { Component } from 'react';
import { div, hh, h, label, button } from 'react-hyperscript-helpers';
import './Wizard.css';
import { Editor } from "@tinymce/tinymce-react";
import { Review } from "../util/ajax";
import { spinnerService } from "../util/spinner-service";
import { Spinner } from "../components/Spinner";
import { AlertMessage } from "../components/AlertMessage";
import '../components/Btn.css';
import { isEmpty } from "../util/Utils";

const TEXT_EDITOR_SPINNER = 'textEditorSpinner';

export const TextEditor = hh(class TextEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comment : '',
      showError: false
    };
    this.handleEditorChange = this.handleEditorChange.bind(this);
  }

  componentWillUnmount() {
    spinnerService._unregister(TEXT_EDITOR_SPINNER);
  }

  handleEditorChange = (comment, editor) => {
    this.setState(prev => {
      prev.comment =  comment;
      return prev;
    });
  };

  addComment = () => {
    spinnerService.show(TEXT_EDITOR_SPINNER);
    Review.addComments(this.props.id, this.state.comment).then(
      response => {
        spinnerService.hide(TEXT_EDITOR_SPINNER);
        this.setState(prev => {
          prev.comment = '';
          return prev;
        });
        this.props.loadComments();
      }
    ).catch(error =>
      this.setState(prev => {
        prev.showError = true;
      },()=> spinnerService.hide(TEXT_EDITOR_SPINNER))
    )
  };

  closeAlertHandler = () => {
    this.setState(prev => {
      prev.showError = false;
      return prev;
    })
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
        button({
          className: "btn btn-primary",
          style: {marginTop:"15px"},
          isRendered: true,
          onClick: this.addComment,
          disabled: isEmpty(this.state.comment)
        }, ["Add"]),
        div({
          style: {marginTop:"15px"}
          },[
          AlertMessage({
            msg: 'Error trying to save comments, please try again later.',
            show: this.state.showError,
            type: 'danger',
            closeable: true,
            closeAlertHandler: this.closeAlertHandler
          })
        ]),
        h(Spinner, {
          name: TEXT_EDITOR_SPINNER, group: "orsp", loadingImage: component.loadingImage
        })
      ])
    );
  }
});
