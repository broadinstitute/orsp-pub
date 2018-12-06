import { Component } from 'react';
import { div, hh } from 'react-hyperscript-helpers';

export const Panel = hh(class Panel extends Component {

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  render() {

    return (
      div({ style: { "margin":"3px", "padding":"2px", "border": "solid 1px green" } }, [
        div({style: {"margin":"3px", "padding":"2px", "backgroundColor":"green", "color":"white" }}, ["(panel) " + this.props.title]),
        this.props.children
      ])
    )
  }
});

// export default Panel;