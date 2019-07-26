import React, { Component, Fragment } from 'react';
import { div, hh, h, h1, p } from 'react-hyperscript-helpers';
import Collapse, { Panel } from 'rc-collapse';
import 'rc-collapse/assets/index.css';

export const CollapsibleElements = hh(class CollapsibleElements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accordion: false,
      activeKey: ['4']
    }
  }

  expandIcon = ( {isActive} ) => {
    return (
      <button className= { "btn buttonSecondary pull-right" } style= {{ marginRight:'15px' }}>
        <i className= { "glyphicon glyphicon-chevron-down" }></i>
      </button>
  )};

  onChange = (activeKey) => {
    this.setState({
      activeKey,
    });
  };

  toggle = () => {
    this.setState({
      accordion: !this.state.accordion,
    });
  };

  render() {
    const accordion = this.state.accordion;
    const btn = accordion ? 'Mode: accordion' : 'Mode: collapse';
    const activeKey = this.state.activeKey;
    return(
      div({},[
        h(Collapse,{
          accordion: this.props.accordion,
          onChange: this.onChange,
          activeKey: activeKey,
          expandIcon: this.expandIcon
        }, [
          this.props.data.map((element, idx) => {
            return  h(Panel, { key: idx,
              header: this.props.header({},[element.data.projectKey])
            }, [
              this.props.body(element,["Summary => " + element.data.summary])
            ])
          })
        ])
      ])
    );
  }
});
/*
* TableComponent({
          remoteProp: false,
          data: this.state.comments,
          columns: columns,
          keyField: 'id',
          search: true,
          fileName: 'ORSP',
          showPrintButton: false,
          printComments: this.printComments,
          defaultSorted: defaultSorted
        })
* */

// ,h(Panel,{ header: `This is panel header `}, [
//   p({},[text])
// ]),
// h(Panel, { header: 'hello', headerClass:"my-header-class"}, ['this is panel content']),
// h(Panel, { header: 'hello2'}, ['this is panel content2 or other'])