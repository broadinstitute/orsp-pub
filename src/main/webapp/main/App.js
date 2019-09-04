import React from 'react';
import Routes from "./Routes";
import WithLoading from "../components/WithLoading";

const AppWithLoading = WithLoading(Routes);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  showSpinner = () => {
    this.setState({
      loading: true
    });
  };

  hideSpinner = () => {
    this.setState({
      loading: false
    });
  };

  render() {
    return (
      AppWithLoading({
        isLoading: this.state.loading,
        showSpinner: this.showSpinner,
        hideSpinner: this.hideSpinner
      })
    )
  }
}
export default App;
