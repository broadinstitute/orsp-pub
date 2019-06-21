import { Component, React } from 'react';
import { h1, div, h3, a } from 'react-hyperscript-helpers';


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
    super(props)
    this.state = { 
      hasError: false,
    }
  }
 
  componentDidCatch(error, info) {
    console.error(error, info);
    this.setState({ 
      hasError: true
    })
  }

  render() {
   return this.state.hasError ?  
    div({},[
      h1({ style: styles.errorTitle }, ['Something went wrong. Please try again.']),
      h3({ style: styles.errorText }, [
        'If problem persists, please contact support: ',
        a({ href: "orsp-portal@broadinstitute.org", className: "link" }, 'orsp-portal@broadinstitute.org')
      ])
    ]) : this.props.children
  }
}
