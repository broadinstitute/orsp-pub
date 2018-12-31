import { Component, Fragment } from 'react';
import { input, hh, h, div, p, hr, small } from 'react-hyperscript-helpers';
import { InputFieldText } from './InputFieldText';
import { InputFieldSelect } from './InputFieldSelect';
import { Btn } from './Btn';

const fundingOptions = [
  { value: 'federal_prime', label: 'Federal Prime' },
  { value: 'federal_sub_award', label: 'Federal Sub-award' },
  { value: 'internal_broad', label: 'Internal Broad' },
  { value: 'purchase_order', label: 'Purchase Order' },
  { value: 'corporate_funding', label: 'Corporate Funding' },
  { value: 'foundation', label: 'Foundation' },
  { value: 'philanthropy', label: 'Philanthropy' },
  { value: 'other', label: 'Other' },
  { value: 'none', label: 'None' }
]


export const Fundings = hh(class Fundings extends Component {

  constructor(props) {
    super(props);
    this.addFundings = this.addFundings.bind(this);
    this.removeFundings = this.removeFundings.bind(this);
    this.handleFundingSelect = this.handleFundingSelect.bind(this);
    this.state = {
      fundings: this.props.fundings
    };
  }

  addFundings() {
    if (this.state.fundings[0].source !== '') {
      this.setState(prev => {
        let fundings = prev.fundings;
        fundings.splice(0, 0, { source: '', sponsor: '', identifier: '' });
        prev.fundings = fundings;
        prev.error = false;
        return prev;
      });
    }
  }

  removeFundings = (index) => {
    if (this.state.fundings.length > 1) {
      this.setState(prev => {
        let fundings = prev.fundings;
        fundings.splice(index, 1);
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
      prev.fundings[id][field] = value;
      return prev;
    }, () => this.props.updateFundings(this.state.fundings));
  };

  handleFundingSelect = (id) => (selectedOption) => {
    this.setState(prev => {
      prev.fundings[id].source = selectedOption;
      return prev;
    }, () => this.props.updateFundings(this.state.fundings)
    )
  }

  render() {
    return (
      h(Fragment, {}, [
        div({ className: "row" }, [
          div({ className: "col-lg-11 col-md-10 col-sm-10 col-9" }, [
            div({ className: "row" }, [
              div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                p({ className: "noMargin" }, ["Funding Source"])
              ]),
              div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                p({ className: "noMargin" }, ["Prime Sponsor Name"])
              ]),
              div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                p({ className: "noMargin" }, ["Award Number/Identifier"])
              ])
            ])
          ]),
          div({ className: "col-lg-1 col-md-2 col-sm-2 col-3" }, [
            Btn({ action: { labelClass: "glyphicon glyphicon-plus", handler: this.addFundings }, disabled: false }),
          ])
        ]),

        hr({ className: "fullWidth" }),

        this.props.fundings.map((rd, idx) => {
          return h(Fragment, { key: idx }, [

            div({ className: "row" }, [
              div({ className: "col-lg-11 col-md-10 col-sm-10 col-9" }, [
                div({ className: "row" }, [
                  div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                    InputFieldSelect({
                      label: "",
                      id: idx,
                      name: "source",
                      options: fundingOptions,
                      value: this.state.fundings[idx].source,
                      onChange: this.handleFundingSelect,
                      error: this.props.error && idx === 0,
                      errorMessage: this.props.errorMessage
                    })
                  ]),
                  div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                    InputFieldText({
                      id: idx,
                      name: "sponsor",
                      label: "",
                      value: this.state.fundings[idx].sponsor,
                      disabled: false,
                      required: false,
                      onChange: this.handleFundingChange
                    })
                  ]),
                  div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                    InputFieldText({
                      id: idx,
                      name: "identifier",
                      label: "",
                      value: this.state.fundings[idx].identifier,
                      disabled: false,
                      required: false,
                      onChange: this.handleFundingChange
                    })
                  ])
                ])
              ]),
              div({ className: "col-lg-1 col-md-2 col-sm-2 col-3", style: { "paddingTop": "12px" } }, [
                Btn({ action: { labelClass: "glyphicon glyphicon-remove", handler: (e) => this.removeFundings(idx) }, disabled: !this.state.fundings.length > 1 }),
              ])
            ]),
          ]);
        })
      ])
    )
  } 
});
