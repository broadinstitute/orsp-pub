import { Component } from 'react';
import { div, hh, h1, h3, span, a } from 'react-hyperscript-helpers';
import './Panel.css';
import { Btn } from '../components/Btn';
import { AlertMessage } from './AlertMessage';

export const Panel = hh(class Panel extends Component {

  state = {
    tooltipShown: false,
    hasError: false
  };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  tooltipBtnHandler = () => {
    this.setState(prev => ({
      tooltipShown: !prev.tooltipShown
    }));
  }

  dismissHandler = () => {
    this.setState({ tooltipShown: false });
  }

  renderHeaderTitle() {
    const {
      title,
      collapsible,
      panelId,
      accordionParentId,
      defaultOpen
    } = this.props;

    if (!collapsible) {
      return title;
    }

    return a({
      href: `#${panelId}`,
      'data-toggle': 'collapse',
      ...(accordionParentId && {
        'data-parent': `#${accordionParentId}`
      }),
      role: 'button',
      className: defaultOpen ? '' : 'collapsed',
      style: { cursor: 'pointer', display: 'block' }
    }, [
      span({ className: 'panelTitleText' }, title),
      span({ className: 'pull-right panelChevron' }, [
        span({ className: 'glyphicon glyphicon-chevron-down' })
      ])
    ]);
  }

  render() {

    if (this.state.hasError) {
      return h1({}, ['Something went wrong.']);
    }

    const {
      collapsible,
      defaultOpen,
      panelId
    } = this.props;

    return (
      div({ className: 'panelContainer panel panel-default' }, [

        div({ className: 'panelHeader panel-heading' }, [
          h3({ className: 'panelTitle panel-title' }, [
            this.renderHeaderTitle(),
            span({ className: 'panelTitleMoreInfo' }, [this.props.moreInfo]),
            Btn({
              isRendered: this.props.tooltipLabel !== undefined,
              action: {
                label: this.props.tooltipLabel,
                handler: this.tooltipBtnHandler
              }
            })
          ]),

          AlertMessage({
            type: 'info',
            msg: this.props.tooltipMsg,
            show: this.state.tooltipShown,
            dismissHandler: this.dismissHandler
          })
        ]),

        collapsible
          ? div(
              {
                id: panelId,
                className: `panel-collapse collapse${defaultOpen ? ' in' : ''}`
              },
              [
                div({ className: 'panel-body panelContent' }, [
                  this.props.children
                ])
              ]
            )
          : div({ className: 'panelContent' }, [
              this.props.children
            ])
      ])
    );
  }
});
