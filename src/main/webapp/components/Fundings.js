import { Component, Fragment } from 'react';
import { input, hh, h, div, p, hr, small, label } from 'react-hyperscript-helpers';
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
      fundings: [{ source: '', sponsor: '', identifier: '' }],
      current: [{ source: '', sponsor: '', identifier: '' }]
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const copyCurrent = nextProps.currentValue;

    return {
      current: copyCurrent
    }
  }

  addFundings() {
    if (this.props.fundings[0].source !== '') {
      this.setState(prev => {
        let fundings = this.props.fundings;
          fundings.splice(0, 0, { source: '', sponsor: '', identifier: '' });
        if (this.props.edit) {
          let current = prev.current;
          current.splice(0, 0, {source: '', sponsor: '', identifier: ''});
          prev.current = current;
        }
        prev.fundings = fundings;
        if (this.props.error) this.props.setError();
        return prev;
      }, () => {
        this.props.updateFundings(this.state.fundings)
      });
    } else {
      if (!this.props.error) this.props.setError();
    }
  }

  removeFundings = (index) => {
    if (this.props.fundings.length > 1) {
      this.setState(prev => {
        let fundings = this.props.fundings;
        let current = prev.current;
        if (!this.props.edit) {
          fundings.splice(index, 1);
        } else {
          let diff =  fundings.length - this.props.copy.length;
          if (index - diff < 0) {
            fundings.splice(index, 1);
            current.splice(index, 1);
          } else {
            fundings[index] = { source: '', sponsor: '', identifier: '' };
          }
          prev.current = current;
        }
        prev.fundings = fundings;
        return prev;
      });
    }
  };

  handleFundingChange = (e) => {
    let funding = this.props.fundings;
    const field = e.target.name;
    const value = e.target.value;
    const index = e.target.getAttribute('index');
    funding[index][field] = value;
    this.setState(prev => {
      prev.fundings = funding;
      return prev;
    }, () => {
      this.props.updateFundings(this.state.fundings)
    });
  };

  handleFundingSelect = (index) => (selectedOption) => {
    let select = this.props.fundings;
    select[index].source = selectedOption;
    this.setState(prev => {
      prev.fundings = select;
      if (this.props.error)  this.props.setError();
      return prev;
    }, () => this.props.updateFundings(this.state.fundings)
    )
  };

  render() {
    const { fundings = [] } = this.props;
    const { copy = [] } = this.props;
    return (
      h(Fragment, {}, [
        div({ className: "row" }, [
          div({ className: "col-lg-11 col-md-10 col-sm-10 col-9" }, [
            div({ className: "row " + (this.props.readOnly ? 'inputFieldReadOnly' : '') }, [
              div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                label({ className: "noMargin" }, ["Funding Source"])
              ]),
              div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                label({ className: "noMargin" }, ["Prime Sponsor Name"])
              ]),
              div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                label({ className: "noMargin" }, ["Award Number/Identifier"])
              ])
            ])
          ]),
          div({ className: "col-lg-1 col-md-2 col-sm-2 col-3" }, [
            Btn({
              action: { labelClass: "glyphicon glyphicon-plus", handler: this.addFundings },
              disabled: false,
              isRendered: !this.props.readOnly
            }),
          ])
        ]),

        hr({ className: "fullWidth" }),

        fundings.map((rd, idx) => {
          return h(Fragment, { key: idx }, [

            div({ className: "row" }, [
              div({ className: "col-lg-11 col-md-10 col-sm-10 col-9" }, [
                div({ className: "row" }, [
                  div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                    InputFieldSelect({
                      label: "",
                      id: idx + "-source",
                      index: idx,
                      name: "source",
                      options: fundingOptions,
                      value: rd.source,
                      currentValue: fundings.length <= copy.length  && copy[idx].source !== undefined ?
                        copy[idx].source : this.props.currentValue !== undefined && this.props.currentValue[idx] !== undefined ? this.props.currentValue[idx].source : rd.source,
                      onChange: this.handleFundingSelect,
                      error: this.props.error && idx === 0,
                      errorMessage: this.props.errorMessage,
                      readOnly: this.props.readOnly,
                      edited: this.props.readOnly
                    })
                  ]),
                  div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                    InputFieldText({
                      id: idx + "-sponsor",
                      index: idx,
                      name: "sponsor",
                      label: "",
                      value: rd.sponsor,
                      currentValue: fundings.length < copy.length  && copy[idx].sponsor !== undefined ?
                                    copy[idx].sponsor : this.props.currentValue !== undefined && this.props.currentValue[idx] !== undefined ? this.props.currentValue[idx].sponsor : rd.sponsor,
                      disabled: false,
                      required: false,
                      onChange: this.handleFundingChange,
                      readOnly: this.props.readOnly
                    })
                  ]),
                  div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                    InputFieldText({
                      id: idx + "-identifier",
                      index: idx,
                      name: "identifier",
                      label: "",
                      value: rd.identifier,
                      currentValue: fundings.length < copy.length && copy[idx].identifier !== undefined ?
                        copy[idx].identifier : this.props.currentValue !== undefined && this.props.currentValue[idx] !==  undefined ? this.props.currentValue[idx].identifier : rd.identifier,
                      disabled: false,
                      required: false,
                      onChange: this.handleFundingChange,
                      readOnly: this.props.readOnly
                    })
                  ])
                ])
              ]),
              div({ className: "col-lg-1 col-md-2 col-sm-2 col-3", style: { "paddingTop": "12px" } }, [
                Btn({
                  action: { labelClass: "glyphicon glyphicon-remove", handler: (e) => this.removeFundings(idx) },
                  disabled: !this.state.fundings.length > 1,
                  isRendered: !this.props.readOnly
                }),
              ])
            ]),
          ]);
        })
      ])
    )
  }
});
