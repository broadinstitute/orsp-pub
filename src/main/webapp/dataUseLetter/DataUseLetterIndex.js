import React, { Fragment } from 'react';
import { Component } from 'react';
import { div, h } from 'react-hyperscript-helpers';
import DataUseLetter from './DataUseLetter';
import DataUseLetterMessage from './DataUseLetterMessage';
import '../index.css';
import { DUL } from "../util/ajax";
import { isEmpty } from "../util/Utils";

class DataUseLetterIndex extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: '',
      dul: {}
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.init();
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  init() {
    const uuid = window.location.href.split('id=')[1];
    DUL.getDULInfo(uuid).then(resp => {
      if (this._isMounted) {
        this.setState(prev => {
          prev.dul = resp.data.dul;
          prev.error = resp.data.error;
          prev.isLoading = false;
          return prev;
        });
      }
    });
  }

  displayUseLetter = () => {
    let dul = '';
    if (isEmpty(this.state.error)) {
      dul =  h(Fragment, {}, [
        DataUseLetter({
          showSpinner: this.props.showSpinner,
          hideSpinner: this.props.hideSpinner,
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
