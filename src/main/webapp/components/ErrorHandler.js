import { Component, React } from 'react';
import { h1 } from 'react-hyperscript-helpers';

export default class ErrorHandler extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true })
  }

  render() {
    return this.state.hasError ?  h1({}, ["Something went wrong Vero!."]) : this.props.children
  }
}
