import React, { Component, Fragment } from 'react';
import { div, hh, h, h1, p, button } from 'react-hyperscript-helpers';
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

expandIcon = ( {isActive} ) => {
    return (
      <button className= { "btn buttonSecondary pull-right" } style= {{ marginRight:'15px' }}>
        <i className= { "glyphicon glyphicon-chevron-down" }></i>
      </button>
  )};

  onChange = (activeKey) => {
    this.setState(prev => {
      prev.activeKey = activeKey;
      return activeKey;
    });
  };

  render() {
    const accordion = this.state.accordion;
    const btn = accordion ? 'Mode: accordion' : 'Mode: collapse';
    const activeKey = this.state.activeKey;
    return(
      div({},[
        p({},["Elemento fuera de map de collapsibleElements"]),
        this.props.data.map((element, idx) => {
          return h(Collapse,{
            accordion: this.props.accordion,
            onChange: this.onChange,
            activeKey: activeKey,
            onItemClick: false
            // expandIcon: this.expandIcon
          }, [
            h(Panel, {
              key: idx,
              style: { pointerEvents: 'none' },
              header: this.props.header({
                currentKey: idx,
                element: element
              },[]),
              showArrow: false
              // extra:[button({onClick: ()=> console.log("EXTRAAA")},["EXTRA"])]
            }, [
              this.props.body(element ,[])
            ])
          ])
        })
      ])
    );
  }
});
