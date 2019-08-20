import React, { Component } from 'react';
import { hh, h } from 'react-hyperscript-helpers';
import { Tabs, Tab } from 'react-bootstrap';
import { isEmpty } from "../util/Utils";

export const MultiTab = hh(class MultiTab extends Component {

  constructor(props) {
    super(props);

    this.state = {
      key: ""
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(key) {
    this.setState({ key: key });
    if (this.props.handleSelect !== undefined)
      this.props.handleSelect(key);
  }

  componentDidMount() {
    this.setState({key: this.props.defaultActive});
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
            console.log("child.props.isRendered => ", child.props);
            return h(
              Tab,
              { className: "tabContent", key: idx, eventKey: child.key, title: child.props.title, isRendered: isEmpty(child.props.hide) ? true : !child.props.hide },
              [child.props.children]
            )
          }),
        ]
      )
    )
  }
});
