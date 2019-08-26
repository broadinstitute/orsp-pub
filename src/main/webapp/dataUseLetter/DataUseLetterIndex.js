import React, { Fragment } from 'react';
import { Component } from 'react';
import { div, h } from 'react-hyperscript-helpers';
import DataUseLetter from './DataUseLetter';
import DataUseLetterMessage from './DataUseLetterMessage';
import '../index.css';
import { DUL, requestTokens } from "../util/ajax";
import { isEmpty } from "../util/Utils";

class DataUseLetterIndex extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: '',
      dul: {}
    };
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    requestTokens.cancelRequests();
  }

  init() {
    const uuid = window.location.href.split('id=')[1];
    DUL.getDULInfo(uuid).then(resp => {
      this.setState(prev => {
        prev.dul = resp.data.dul;
        prev.error = resp.data.error;
        prev.isLoading = false;
        return prev;
      });
    });
  }

  displayUseLetter = () => {
    let dul = '';
    if (isEmpty(this.state.error)) {
      dul =  h(Fragment, {}, [
        DataUseLetter({
          dul: this.state.dul
        })
      ])
    }
    else {
      dul =  h(Fragment, {}, [
        DataUseLetterMessage({
          error: this.state.error
        })
      ])      
    }
    return dul;
  };

  render() {
    let dUL = ''
    if (!this.state.isLoading) {
      dUL = this.displayUseLetter();
    }   
    return (
      div({}, [
        dUL
      ])
    )
  }
} export default DataUseLetterIndex;
