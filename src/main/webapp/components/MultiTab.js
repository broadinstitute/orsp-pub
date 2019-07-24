import React, { Component } from 'react';
import { hh, h, span } from 'react-hyperscript-helpers';
import { Tabs, Tab } from 'react-bootstrap';


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
            return h(
              Tab,
              { className: "tabContent", key: idx, eventKey: child.key, title: child.props.title },
              [child.props.children]
            )
          }),
        ])
    )
  }
});
