import React, { useState } from 'react';
import { div, img } from 'react-hyperscript-helpers';
import { context } from '../util/UrlConstants';

function LoadingWrapper(WrappedComponent, fixed = false) {
  const baseStyle = {
    'left': '0',
    'width': '100%',
    'height': '100%',
    'background': 'rgba(255, 255, 255, 0.5)',
  };

  const containerStyleFixed = {
    'position': 'fixed',
    'top': '0',
    'zIndex': '1041'
  };
  
  const containerStyleFixedTop = {
    'position': 'fixed',
    'top': '62px',
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

    const getStyle = () => {
      let style = {};
      if (fixed) {
        style = {...baseStyle, ...containerStyleFixed }
      } else {
        style = {...baseStyle, ...containerStyleFixedTop }
      }
      return style;
    };

    return (
      div({ style: (loading ? {'position': 'relative'} : {}) },[
        div({isRendered: loading, style: getStyle()}, [
          div({style: spinnerStyle}, [
            img({src: context + "/assets/loading-indicator.svg", alt: 'spinner'})
          ])
        ]),
        WrappedComponent({showSpinner, hideSpinner, ...props}, [])
      ])
    );
  }
}

export default LoadingWrapper;
