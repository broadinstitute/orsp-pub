import React, { Fragment, useState } from 'react';
import { h, div, img } from 'react-hyperscript-helpers';
import { context } from "../util/UrlConstants";

function LoadingWrapper(WrappedComponent, modal = false) {
  const baseStyle = {
    'left': '0',
    'width': '100%',
    'height': '100%',
    'background': 'rgba(255, 255, 255, 0.5)',
  };

  const containerStyle = {
    'position': 'absolute',
    'top': '51',
    'zIndex': '1029'
  };
  const containerStyleFixed = {
    'position': 'fixed',
    'top': '0',
    'zIndex': '1041'
  };

  const spinnerStyle = {
    'position': 'absolute',
    'top': '30%',
    'left': '50%',
    'margin': '-30px 0 0 -30px',
    'zIndex': '9999'
  };



  return function WithLoadingComponent({...props}) {

    const [loading, setLoading] = useState(false);

    const showSpinner = () => {
      setLoading(true);
    };

    const hideSpinner = () => {
      setLoading(false);
    };
    return (
      h(Fragment, {},[
        div({ style: (loading ? {'position': 'relative'} : {}) },[
          div({isRendered: loading, style: modal ? {...baseStyle, ...containerStyleFixed } : {...baseStyle, ...containerStyle}}, [
            div({style: spinnerStyle}, [
              img({src: context + "/assets/loading-indicator.svg", alt: 'spinner'})
            ])
          ]),
          WrappedComponent({showSpinner, hideSpinner, ...props}, [])
        ])
      ])
    );
  }
}

export default LoadingWrapper;
