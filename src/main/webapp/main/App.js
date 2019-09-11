import React from 'react';
import Routes from "./Routes";
import WithLoading from "../components/WithLoading";

const AppWithLoading = WithLoading(Routes);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  showSpinner = () => {
    this.setState({
      isLoading: true
    });
  };

  hideSpinner = () => {
    this.setState({
      isLoading: false
    });
  };

  render() {
    return (
      AppWithLoading({
        isLoading: this.state.isLoading,
        showSpinner: this.showSpinner,
        hideSpinner: this.hideSpinner
      })
    )
  }
}
export default App;
