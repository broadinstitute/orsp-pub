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
      currentAuxiliar: [{ source: '', sponsor: '', identifier: '' }],
      valueEdited: false

    };
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      currentAuxiliar: nextProps.currentAuxiliar
    }
  }

  addFundings() {
    if (this.props.fundings[0].source !== '') {
      this.setState(prev => {
        let fundings = this.props.fundings;
        fundings.splice(0, 0, { source: '', sponsor: '', identifier: '' });

        if (this.props.edit) {
          let current = prev.currentAuxiliar;
          current.splice(0, 0, { source: '', sponsor: null, identifier: null });
          prev.currentAuxiliar = current;
        }

        prev.fundings = fundings;
        this.props.error && this.props.edit ? this.props.setError() : prev.error = false;
        return prev;
      }, () => {
        this.props.updateFundings(this.state.fundings)
      });
    } else {
      if (!this.props.error && this.props.edit) this.props.setError();
    }
  }

  removeFundings = (index) => {
    this.setState(prev => {
      let fundings = this.props.fundings;
      let current = prev.currentAuxiliar;

      if (!this.props.edit && this.props.fundings.length > 1) {
        fundings.splice(index, 1);
      }

      else if (this.props.edit) {
        let diff =  fundings.length - this.props.currentOriginal.length;
        if (index - diff < 0) { // determines if element to delete is within the original array or the originalTemporal
          fundings.splice(index, 1);
          current.splice(index, 1);
        } else {
          fundings[index] = { source: '', sponsor: '', identifier:  '' };
        }
        prev.currentAuxiliar = current;
      }
      prev.fundings = fundings;
      return prev;
    }, () => {
      this.props.updateFundings(this.state.fundings)
    });

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
      if (this.props.error && this.props.edit)  this.props.setError();
      return prev;
    }, () => this.props.updateFundings(this.state.fundings)
    )
  };

  // When adding a new funding, we use currentAuxiliar to correspond indexes by adding empty objects.
  getCurrentValue(fundings, currentOriginal, idx, rd, field) {
    let currentValue = '';
    if (fundings.length < currentOriginal.length && currentOriginal[idx][field] !== undefined) {
      currentValue = currentOriginal[idx][field];
    } else if (this.props.currentAuxiliar !== undefined && this.props.currentAuxiliar[idx] !== undefined) {
      currentValue = this.props.currentAuxiliar[idx][field];
    } else {
      currentValue = rd[field];
    }

    return currentValue;
  }

  render() {
    const { fundings = [] } = this.props;
    const { currentOriginal = [] } = this.props;
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
                      currentValue: this.getCurrentValue(fundings, currentOriginal, idx, rd, "source"),
                      onChange: this.handleFundingSelect,
                      error: this.props.edit === true  && this.props.errorIndex !== null? this.props.error && this.props.errorIndex.includes(idx) : this.props.error && idx === 0,
                      errorMessage: this.props.errorMessage,
                      readOnly: this.props.readOnly,
                      edited: this.props.readOnly,
                      edit: this.props.edit
                    })
                  ]),
                  div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                    InputFieldText({
                      id: idx + "-sponsor",
                      index: idx,
                      name: "sponsor",
                      label: "",
                      value: rd.sponsor,
                      currentValue: this.getCurrentValue(fundings, currentOriginal, idx, rd, "sponsor"),
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
                      currentValue: this.getCurrentValue(fundings, currentOriginal, idx, rd, "identifier"),
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
