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
      unauthorized: false,
      notFound: false
    };

    this.props.history.listen((location, action) => {
      if (this.state.hasError) {
        this.setState({
          hasError: false,
          unauthorized: false,
          notFound: false
        });
      }
    });
  }
 
  componentDidCatch(error, info) {
    console.error(error);
    let unauthorized = false;
    let notFound = false;
    if(!_.isEmpty(error.message) && error.message.includes("401")) {
      unauthorized = true;
    }
    if(!_.isEmpty(error.response.data.error)
      && !_.isEmpty(error.message)
      && (error.response.data.error.includes("Project not found") ||
      error.response.data.error.includes("Consent Group not found"))
      && error.message.includes("404")) {
      notFound = true;
    }
    this.setState({ 
      hasError: true,
      unauthorized: unauthorized,
      notFound: notFound
    })
  }

  render() {
    return this.state.hasError ?
     div({},[
       div({isRendered: !this.state.unauthorized && !this.state.notFound}, [
         h1({ style: styles.errorTitle }, ['Something went wrong. Please try again.'])
       ]),
       div({isRendered: this.state.notFound}, [
        h1({ style: styles.errorTitle }, ['That project number does not exist.']),
      ]),
       div({isRendered: this.state.unauthorized}, [
         h1({ style: styles.errorTitle }, ['Your session has expired, please sign in again.']),
       ]),
       h3({isRendered: !this.state.unauthorized && !this.state.notFound, style: styles.errorText }, [
         'If problem persists, please contact support: ',
         a({ href: "orsp-portal@broadinstitute.org", className: "link" }, 'orsp-portal@broadinstitute.org')
       ]),
       h3({isRendered: this.state.notFound, style: styles.errorText }, [
        'Please contact ',
        a({ href: "orsp-portal@broadinstitute.org", className: "link" }, 'orsp-portal@broadinstitute.org'),
        ' if you need assistance.'
      ])
     ]) : this.props.children
   }
 }
