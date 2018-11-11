import React from "react";
import { div, h3, ul, li } from 'react-hyperscript-helpers'

export default class ResponseView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isError: this.props.isError // Visible state for testing
    }
  }

  render() {
    return (
      div({className: "well", style: this.props.style}, [
        h3(this.props.title),
        this.formatContent()])
    )
  }

  formatContent() {
    const style = {width: 'max-content', padding: '.25rem', borderRadius: '3px', margin: '.25rem'}
    let rendered = ''
    const stringContent = JSON.stringify(this.props.content, null, 2)
    let firstCharacter = stringContent[0]
    switch (firstCharacter) {
      case '<':
        rendered = div({className: this.props.className, style: style}, stringContent)
        break;
      case '"':
        rendered = ul([li({className: this.props.className, style: style}, JSON.parse(stringContent))])
        break;
      case '[':
        const arr = JSON.parse(stringContent)
        rendered = ul(arr.map(el => li({className: this.props.className, style: style}, el)))
        break;
      case '{':
        rendered = div({className: this.props.className, style: style}, stringContent)
        break;
      default:
        rendered = div({className: this.props.className, style: style}, stringContent)
    }
    return rendered
  }

}
