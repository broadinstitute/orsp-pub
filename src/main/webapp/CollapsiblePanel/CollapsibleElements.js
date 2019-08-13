import React, { Component } from 'react';
import { div, hh, h } from 'react-hyperscript-helpers';
import Collapse, { Panel } from 'rc-collapse';
import 'rc-collapse/assets/index.css';
import '../components/Btn.css';

export const CollapsibleElements = hh(class CollapsibleElements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accordion: false,
      activeKey: []
    }
  }

  onChange = (activeKey) => {
    this.setState(prev => {
      prev.activeKey = activeKey;
      return activeKey;
    });
  };

  render() {
    return(
      div({},[
        h(Collapse,{
          accordion: this.props.accordion,
          onItemClick: false
        }, [
          this.props.data.map((element, idx) => {
            return h(Panel, {
              key: idx,
              className: 'collapsible',
              style: { pointerEvents: 'none' },
              header: this.props.header({
                extraData: this.props.extraData,
                element: element
              },[]),
              showArrow: false
            }, [
              this.props.body(element ,[])
            ])
          })
        ])
      ])
    );
  }
});
