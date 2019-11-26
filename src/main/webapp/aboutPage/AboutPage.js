import { Component } from 'react';
import { About } from '../components/About';

class AboutPage extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
        About({
            showAccessDetails : true,
            showWarning: true
        })
    );
  }
}

export default AboutPage;
