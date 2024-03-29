import React, { Component, Fragment } from 'react';
import { h, hh, div } from 'react-hyperscript-helpers';
import SampleCollectionLinks from './SampleCollectionLinks';
import DataUseRestriction from './DataUseRestriction';
import { LoginText } from '../util/ajax';
import { PortalMessage } from '../components/PortalMessage';

const DataUseRestrictionIndex = hh(class DataUseRestrictionIndex extends Component {

  constructor(props) {
    super(props);
    this.state = {
      defaultValueForAbout: 'default'
    }
  }

  componentDidMount() {
    this.checkDefault();
  }


  async checkDefault() {
    await LoginText.getLoginText().then(loginText => {
      let data = loginText.data[0];
      if(data[3] === 'default') {
        this.setState({
          defaultValueForAbout: 'default'
        })
      } else {
        this.setState({
          defaultValueForAbout: ''
        })
      }
    })
  }

  render() {
     return (
      div({}, [
        PortalMessage({}),
        h( Fragment, {},[
          h(DataUseRestriction, {}),
          h(SampleCollectionLinks,{}),
        ])
      ])
     )
  }
});

export default DataUseRestrictionIndex;
