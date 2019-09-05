import React from 'react';
import { div, img } from 'react-hyperscript-helpers';

function WithLoading(WrappedComponent) {
  let containerStyle = { 'position': 'fixed', 'top': '0', 'left': '0', 'width': '100%', 'height': '100%', 'background': 'rgba(255, 255, 255, 0.3)', 'zIndex': '9000' };
  let spinnerStyle = { 'position': 'fixed', 'top': '30vh', 'left': '50vw', 'marginLeft': '-30px', 'zIndex': '10000' };
  return function WithLoadingComponent({ isLoading, showSpinner, hideSpinner, ...props }) {
    return (
      div({}, [
        div({ isRendered: isLoading, style: containerStyle }, [
          div({ style: spinnerStyle }, [
            img({ src: "../assets/loading-indicator.svg", alt:'spinner' })
          ])
        ]),
        WrappedComponent({showSpinner, hideSpinner, ...props}, [])
      ])
    );
  }
}
export default WithLoading;
