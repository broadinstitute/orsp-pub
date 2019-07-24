import { Component } from 'react';
import { div, hh, h1, h3, span } from 'react-hyperscript-helpers';
import './Panel.css';
import { Btn } from '../components/Btn';
import { AlertMessage } from './AlertMessage';

export const Panel = hh(class Panel extends Component {

  state = {
    tooltipShown: false
  };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  tooltipBtnHandler = (e) => {
    this.setState(prev => {
      prev.tooltipShown = !prev.tooltipShown;
      return prev;
    }, () => {
    });
  }

  dismissHandler = () => {
    this.setState({
      tooltipShown: false
    });
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
            span({ className: this.props.submissionsCount !== undefined ? "badge badge-dark" : "panelTitleMoreInfo" }, [
              this.props.submissionsCount !== undefined ? this.props.moreInfo : this.props.submissionsCount
            ]),
            Btn({ isRendered: this.props.tooltipLabel !== undefined, action: { label: this.props.tooltipLabel, handler: this.tooltipBtnHandler } })
          ]),
          AlertMessage({
            type: "info",
            msg: this.props.tooltipMsg,
            show: this.state.tooltipShown,
            dismissHandler: this.dismissHandler
          })
        ]),
        div({ className: "panelContent" }, [this.props.children])
      ])
    )
  }
});
