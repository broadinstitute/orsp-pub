import { Component } from 'react';
import { div, hh, h1, h3, span } from 'react-hyperscript-helpers';
import './Panel.css';
import { Btn } from '../components/Btn';

export const Panel = hh(class Panel extends Component {

  state = {};

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    return (
      div({ className: "panelContainer" }, [
        div({ className: "panelHeader" }, [
          h3({ className: 'panelTitle' }, [
            this.props.title,
            span({ className: "panelTitleMoreInfo" }, [this.props.moreInfo]),
            Btn({ isRendered: this.props.tooltipLabel !== undefined, action: { label: this.props.tooltipLabel } })
          ])
        ]),
        div({ className: "panelContent" }, [
          this.props.children
        ])
      ])
    )
  }
});

// export default Panel;