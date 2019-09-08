import React from 'react';
import { h } from 'react-hyperscript-helpers';
import { Tabs, Tab } from 'react-bootstrap'
import { isEmpty } from "../util/Utils";

export default function MultiTab(props) {

  const handleSelect = (key) => {
    if (props.handleSelect != null) {
      props.handleSelect(key);
    }
  };

  return (
    h(
      Tabs, {
        activeKey: props.activeKey,
        id: "noanim-tab-example",
        animation: false,
        onSelect: handleSelect,
      }, [
        props.children.map((child, idx) => {
          return h(
            Tab, {
              className: "tabContent",
              key: idx,
              eventKey: child.key,
              title: child.props.title,
              isRendered: isEmpty(child.props.hide) ? true : !child.props.hide
            },
            [child.props.children]
          )
        })
      ]
    )
  )
}
