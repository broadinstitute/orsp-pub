import React, { Component } from 'react';
import { div } from 'react-hyperscript-helpers';
import DataUseLetter from './DataUseLetter';
import DataUseLetterMessage from './DataUseLetterMessage';
import '../index.css';
import { DUL } from "../util/ajax";
import { isEmpty } from "../util/Utils";

class DataUseLetterIndex extends Component {

  constructor(props) {
    super(props);
    this.state = {
      status: {
        error: '',
        dul: {}
      }
    };
  }

  componentDidMount() {
    this.init();
  }

  init() {
    const uuid = window.location.href.split('id=')[1];
    DUL.getDULInfo(uuid).then(resp => {
      this.setState(prev => {
        prev.dul = resp.data.dul;
        prev.error = resp.data.error;
        return prev;
      });
    });
  }
  render() {
    return (
      div({}, [
        DataUseLetterMessage({
          isRendered: !isEmpty(this.state.error),
          error: this.state.error
        }),
        DataUseLetter({
          isRendered: isEmpty(this.state.error),
          dul: this.state.dul
        })
      ])
    )
  }
} export default DataUseLetterIndex;
