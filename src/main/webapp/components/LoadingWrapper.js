import React from 'react';
import { Fragment } from 'react';
import { h, div, img } from 'react-hyperscript-helpers';
import { context } from "../util/UrlConstants";

function LoadingWrapper(WrappedComponent) {
  let containerStyle = { 'position': 'fixed', 'top': '0', 'left': '0', 'width': '100%', 'height': '100%', 'background': 'rgba(255, 255, 255, 0.3)', 'zIndex': '9000' };
  let spinnerStyle = { 'position': 'fixed', 'top': '30vh', 'left': '50vw', 'marginLeft': '-30px', 'zIndex': '10000' };
  return function WithLoadingComponent({ isLoading, showSpinner, hideSpinner, ...props }) {

    return (
      h(Fragment, {}, [
        div({ isRendered: isLoading, style: containerStyle }, [
          div({ style: spinnerStyle }, [
            img({ src: context + "/assets/loading-indicator.svg", alt:'spinner' })
          ])
        ]),
        WrappedComponent({showSpinner, hideSpinner, ...props}, [])
        ]
      )
    );
  }
}
export default LoadingWrapper;
