import { Component, Fragment } from 'react';
import { input, hh, h, div, p, hr } from 'react-hyperscript-helpers';
import { InputFieldText } from './InputFieldText';
import { InputFieldSelect } from './InputFieldSelect';
import { Btn } from './Btn';

const fundingOptions = [
  { value: 'federal_prime', label: 'Federal Prime'},
  { value: 'federal_sub_award', label: 'Federal Sub-award'},
  { value: 'internal_broad', label: 'Internal Broad'},
  { value: 'purchase_order', label: 'Purchase Order'},
  { value: 'corporate_funding', label: 'Corporate Funding'},
  { value: 'foundation', label: 'Foundation'},
  { value: 'philanthropy', label: 'Philanthropy'},
  { value: 'other', label:  'Other'},
  { value: 'none', label: 'None'}
]


export const Fundings = hh(class Fundings extends Component {

  constructor(props) {
    super(props);
    this.addFundings = this.addFundings.bind(this);
    this.removeFundings = this.removeFundings.bind(this);
    this.handleFundingSelect = this.handleFundingSelect.bind(this);
    this.state = {
      fundings: [{ source: '', sponsor: '', identifier: '' }]
    };
  }

  addFundings() {
    this.setState(prev => {
      let fundings = prev.fundings;
      fundings.splice(0, 0, { source: '', sponsor: '', identifier: '' });
      prev.fundings = fundings;
      return prev;
    }, () => this.props.updateFundings(this.state.fundings));
  }

  removeFundings = (e) => (Index) => {
    if (this.state.fundings.length > 1) {
      this.setState(prev => {
        let fundings = prev.fundings;
        fundings.splice(Index, 1);
        prev.fundings = fundings;
        return prev;
      }, () => this.props.updateFundings(this.state.fundings));
    }
  }

  handleFundingChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const id = e.target.id;
    this.setState(prev => {
      prev.fundings[id][field]= value;
      return prev;
    }, () => this.props.updateFundings(this.state.fundings));
  };

  handleFundingSelect = (id) => (selectedOption) => {
    this.setState(prev => {
      prev.fundings[id].source = selectedOption;
      return prev;
    }, ()=> this.props.updateFundings(this.state.fundings)
    )
  }

  render() {
    return (
      h(Fragment, {}, [
        p({isRendered: this.props.error}[this.props.errorMessage]),
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

        this.state.fundings.map((rd, Index) => {
          return h(Fragment, { key: Index }, [

            div({ className: "row" }, [
              div({ className: "col-lg-11" }, [
                div({ className: "row" }, [
                  div({ className: "col-lg-4" }, [
                    InputFieldSelect({ label: "",
                                       id: Index,
                                       name: "source",
                                       options: fundingOptions,
                                       value: this.state.fundings[Index].source,
                                       onChange: this.handleFundingSelect
                                       })
                  ]),
                  div({ className: "col-lg-4" }, [
                    InputFieldText({ id: Index,
                                     name: "sponsor",
                                     label: "",
                                     value: this.state.fundings[Index].sponsor,
                                     disabled: false,
                                     required: false,
                                     onChange: this.handleFundingChange
                                     })
                  ]),
                  div({ className: "col-lg-4" }, [
                    InputFieldText({ id: Index,
                                     name: "identifier",
                                     label: "",
                                     value: this.state.fundings[Index].identifier,
                                     disabled: false,
                                     required: false,
                                     onChange: this.handleFundingChange })
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