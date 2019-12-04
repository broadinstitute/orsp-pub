import { Component, React } from 'react';
import { h1, div, h3, a } from 'react-hyperscript-helpers';
import _ from 'lodash';


const styles = {
  errorTitle: {
    marginTop: '50px'
  },
  errorText: {
    marginBottom: '200px'
  }
};

export default class ErrorHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      unauthorized: false
    };

    this.props.history.listen((location, action) => {
      if (this.state.hasError) {
        this.setState({
          hasError: false,
          unauthorized: false
        });
      }
    });
  }
 
  componentDidCatch(error, info) {
    console.error(error);
    let unauthorized = false;
    if(!_.isEmpty(error.message) && error.message.includes("401")) {
      unauthorized = true;
    }
    this.setState({ 
      hasError: true,
      unauthorized: unauthorized
    })
  }

  render() {
    return this.state.hasError ?
     div({},[
       div({isRendered: !this.state.unauthorized}, [
         h1({ style: styles.errorTitle }, ['Something went wrong. Please try again.'])
       ]),
       div({isRendered: this.state.unauthorized}, [
         h1({ style: styles.errorTitle }, ['Your session has expired, please sign in again.']),
       ]),
       h3({isRendered: !this.state.unauthorized, style: styles.errorText }, [
         'If problem persists, please contact support: ',
         a({ href: "orsp-portal@broadinstitute.org", className: "link" }, 'orsp-portal@broadinstitute.org')
       ])
     ]) : this.props.children
   }
 }
