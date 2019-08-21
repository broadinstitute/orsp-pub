import React, { Component } from 'react';
import { CancelToken } from 'axios';

const CancelRequest = (WrappedComponent) => {
  let cancel = new CancelToken();

  return class extends Component {
    constructor(props) {
      super(props);
    }

    componentWillUnmount() {
      cancel();
    }

    render() {
      return (
        <WrappedComponent {...this.props}/>
      )
    }
  }
};
