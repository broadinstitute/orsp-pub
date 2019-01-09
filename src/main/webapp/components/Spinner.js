import * as React from 'react';
import { spinnerService } from '../util/spinner-service';

export class Spinner extends React.Component {

  constructor(props, context) {
    super(props, context);

    if (!this.props.name) {
      throw new Error('Spinner components must have a name prop.');
    }

    if (!this.props.loadingImage && !this.props.children) {
      throw new Error('Spinner components must have either a loadingImage prop or children to display.');
    }

    this.state = {
      show: this.props.hasOwnProperty('show') ? this.props.show : false
    };

    if (this.props.hasOwnProperty('spinnerService')) {
      this.spinnerService = this.props.spinnerService;
    } else {
      this.spinnerService = spinnerService;
    }

    this.spinnerService._register(this);
  }

  get name() {
    return this.props.name;
  }

  get group() {
    return this.props.group;
  }

  get show() {
    return this.state.show;
  }

  set show(show) {
    this.setState({ show });
  }

  render() {
    let containerStyle = { 'position': 'fixed', 'top': '0', 'left': '0', 'width': '100%', 'height': '100%', 'background': 'rgba(255, 255, 255, 0.3)', 'zIndex': '9000' };
    let spinnerStyle = { 'position': 'fixed', 'top': '30vh', 'left': '50vw', 'marginLeft': '-30px', 'zIndex': '10000' };
    if (this.state.show) {
      const { loadingImage } = this.props;
      return (
        <div style={containerStyle}>
          <div style={spinnerStyle}>
            {loadingImage && <img src={loadingImage} alt='spinner' />}
            {this.props.children}
          </div>
        </div>
    );
    }
    return null;
  }
}
