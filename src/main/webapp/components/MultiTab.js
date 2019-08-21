import React, { Component } from 'react';
import { hh, h } from 'react-hyperscript-helpers';
import { Tabs, Tab } from 'react-bootstrap';
import { isEmpty } from "../util/Utils";

export const MultiTab = hh(class MultiTab extends Component {

  constructor(props) {
    super(props);

    this.state = {
      key: "",
      defaultActive: ""
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(key) {
    this.setState({ key: key });
  }

  componentDidMount() {
    this.setState({key: this.props.defaultActive, defaultActive: this.props.defaultActive});
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.defaultActive && nextProps.defaultActive !== prevState.defaultActive){
      return { key: nextProps.defaultActive, defaultActive: nextProps.defaultActive};
    }
    else return null;
  }

  render() {
    return (
      h(
        Tabs,{
          activeKey: this.state.key,
          id: "noanim-tab-example",
          animation: false,
          onSelect: this.handleSelect,
        }, [
          this.props.children.map((child, idx) => {
            return h(
              Tab, {
                className: "tabContent",
                key: idx,
                eventKey: child.key,
                title: child.props.title,
                isRendered: isEmpty(child.props.hide) ? true : !child.props.hide },
              [child.props.children]
            )
          }),
        ]
      )
    )
  }
});
