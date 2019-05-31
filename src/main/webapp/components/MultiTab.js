import React, { Component } from 'react';
import { hh, h } from 'react-hyperscript-helpers';
import { Tabs, Tab } from 'react-bootstrap';


export const MultiTab = hh(class MultiTab extends Component {
  /**
   *
   * Example:
   MultiTab({defaultActive: "second"},
   [
   div({
            id: "1",
            key: "first",
            title: "First",
          }, [
   p({}, ["First Lorem ipsum"])
   ]),
   div({
            id: "2",
            key: "second",
            title: "Second",
          }, ["Second Lorem ipsum"]),
   div({
            id: "3",
            key: "third",
            title: "Third",
          }, ["Third Lorem ipsum"]),
   ]),
   * @param props
   */

  constructor(props) {
    super(props);

    this.state = {
      key: ""
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

 handleSelect(key) {
    this.setState({ key: key });
  }

  componentDidMount() {
    this.setState({key: this.props.defaultActive});
  }

  render() {
    return (
      h(
        Tabs,{
          className: "tabContent",
          activeKey: this.state.key,
          id: "noanim-tab-example",
          animation: false,
          onSelect: this.handleSelect,
        }, [
          this.props.children.map((child, idx) => {
            return h(
              Tab,
              { className: "noName", key: idx, eventKey: child.key, title: child.props.title },
              [child.props.children]
            )
          }),
        ])
    )
  }
});
