import { Component } from 'react';
import { hh, div } from 'react-hyperscript-helper';


export const MultiTab = hh(class MultiTab extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (

      div({ className: "headerBoxContainer" }, [
        div({ className: "containerBox" }, [
          div({ className: "tabContainer" }, [
            this.props.children.map((child, idx) => {
              return h(Fragment, { key: idx }, [
                div({ className: "tabStep " + (idx === currentStepIndex ? "active" : ""), onClick: this.goStep(idx)}, [child.props.title])
              ])
            })

          ])
        ])
      ])
    )
  }
});
