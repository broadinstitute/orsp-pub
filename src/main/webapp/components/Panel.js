import { Component } from 'react';
import { div, hh, hr } from 'react-hyperscript-helpers';

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
      return <h1>Something went wrong.</h1>;
    }

    return (
      div({ style: { "margin":"3px", "padding":"2px", "border": "solid 1px black", "borderRadius":"4px", "color":"#333" } }, [
        div({style: {"margin":"2px", "padding":"2px", "backgroundColor":"gray", "color":"white" }}, [this.props.title + " (panel)"]),
        hr(),
        this.props.children
      ])
    )
  }
});

// export default Panel;