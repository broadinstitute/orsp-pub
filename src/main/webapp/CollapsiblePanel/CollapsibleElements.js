import React, { Component, Fragment } from 'react';
import { div, hh, h, h1, p } from 'react-hyperscript-helpers';
import Collapse, { Panel } from 'rc-collapse';
import 'rc-collapse/assets/index.css';
const text = 'HOLISSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSs';
const arrowPath = 'M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88' +
  '.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.' +
  '6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-0.7 5.' +
  '2-2L869 536.2c14.7-12.8 14.7-35.6 0-48.4z';
const test = {
  title: "VERO"
};

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

  // content = () => {
  //   return this.props.data.map((element, idx) => {
  //     return h(Fragment, { key: idx }, [
  //       div({ className: "row", style: {'marginBottom': '15px'} }, [
  //         h(Panel, { header: element.projectKey}, ['this is panel content'])
  //       ])
  //     ])
  //   })
  // };

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
            return  h(Panel, { header: element.projectKey}, [
              this.props.body({},["Summary => " + element.summary])
            ])
          })
        ])
      ])
    );
  }
});


// ,h(Panel,{ header: `This is panel header `}, [
//   p({},[text])
// ]),
// h(Panel, { header: 'hello', headerClass:"my-header-class"}, ['this is panel content']),
// h(Panel, { header: 'hello2'}, ['this is panel content2 or other'])