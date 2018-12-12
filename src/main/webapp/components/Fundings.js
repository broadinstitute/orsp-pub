import { Component, Fragment } from 'react';
import { input, hh, h, div, p, hr } from 'react-hyperscript-helpers';
import { InputFieldText } from './InputFieldText';
import { InputFieldSelect } from './InputFieldSelect';
import { Btn } from './Btn';

const fundingOptions = [
  { value: 'federal_prime', label: 'Federal Prime' },
  { value: 'internal_broad', label: 'Internal Broad' }
]


export const Fundings = hh(class Fundings extends Component {

  constructor(props) {
    super(props);
    this.addFundings = this.addFundings.bind(this);
    this.removeFundings = this.removeFundings.bind(this);
  }

  state = {
    fundings: [{ source: '', sponsor: '', identifier: '' }]
  };

  addFundings() {
    console.log("add");
    this.setState(prev => {
      let fundings = prev.fundings;
      fundings.push({ source: '', sponsor: '', identifier: '' });
      prev.fundings = fundings;
      return prev;
    });
  }

  removeFundings = (e) => (Index) => {
    if (this.state.fundings.length > 1) {
      this.setState(prev => {
        let fundings = prev.fundings;
        fundings.splice(Index, 1);
        prev.fundings = fundings;
        return prev;
      });
    }
  }

  render() {

    return (
      h(Fragment, {}, [
        div({ className: "row" }, [
          div({ className: "col-lg-11" }, [
            div({ className: "row" }, [
              div({ className: "col-lg-4" }, [
                p({ className: "noMargin" }, ["Funding Source"])
              ]),
              div({ className: "col-lg-4" }, [
                p({ className: "noMargin" }, ["Prime Sponsor Name"])
              ]),
              div({ className: "col-lg-4" }, [
                p({ className: "noMargin" }, ["Award Number/Identifier"])
              ])
            ])
          ]),
          div({ className: "col-lg-1" }, [
            Btn({ action: { labelClass: "glyphicon glyphicon-plus", handler: this.addFundings }, disabled: false }),
          ])
        ]),

        hr({ className: "fullWidth" }),

        this.props.fundings.map((rd, Index) => {
          return h(Fragment, { key: Index }, [

            div({ className: "row" }, [
              div({ className: "col-lg-11" }, [
                div({ className: "row" }, [
                  div({ className: "col-lg-4" }, [
                    InputFieldSelect({ options: fundingOptions, value: rd.source })
                  ]),
                  div({ className: "col-lg-4" }, [
                    InputFieldText({ value: rd.sponsor })
                  ]),
                  div({ className: "col-lg-4" }, [
                    InputFieldText({ value: rd.identifier })
                  ])
                ])
              ]),
              div({ className: "col-lg-1", style: { "paddingTop": "12px" } }, [
                Btn({ action: { labelClass: "glyphicon glyphicon-remove", handler: this.removeFundings(Index) }, disabled: !this.state.fundings.length > 1 }),
              ])
            ])
          ]);
        })
      ])
    )
  }
});