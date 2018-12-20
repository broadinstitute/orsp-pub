import { Component } from 'react';
import { div, hh, h1, h3, span } from 'react-hyperscript-helpers';
import './Panel.css';
import { Btn } from '../components/Btn';
import { AlertMessage } from './AlertMessage';

export const Panel = hh(class Panel extends Component {

  state = {
    tooltipShown: false
  };

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

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
            span({ className: "panelTitleMoreInfo" }, [this.props.moreInfo]),
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

// export default Panel;