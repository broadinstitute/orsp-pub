import { Component, Fragment } from 'react';
import { input, hh, h, div, p, hr, small, label } from 'react-hyperscript-helpers';
import { InputFieldText } from './InputFieldText';
import { InputFieldSelect } from './InputFieldSelect';
import { Btn } from './Btn';
import { isEmpty } from "../util/Utils";

const fundingOptions = [
  { value: 'federal_prime', label: 'Federal Prime' },
  { value: 'federal_sub-award', label: 'Federal Sub-award' },
  { value: 'internal_broad', label: 'Broad Institutional Award' },
  { value: 'purchase_order', label: 'Purchase Order' },
  { value: 'corporate_funding', label: 'Corporate Funding' },
  { value: 'foundation', label: 'Foundation' },
  { value: 'philanthropy', label: 'Philanthropy' },
  { value: 'other', label: 'Other' },
  { value: 'none', label: 'None' }
]

// Todo: unify logic for edit and creation without changing funding's structure
export const Fundings = hh(class Fundings extends Component {

  constructor(props) {
    super(props);
    this.addFundings = this.addFundings.bind(this);
    this.removeFundings = this.removeFundings.bind(this);
    this.handleFundingSelect = this.handleFundingSelect.bind(this);

    this.state = {
      future: [],
      fundings: []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.edit && nextProps.current !== prevState.current){
      return { current: nextProps.current, future: nextProps.future};
    }
    else return null;
  }

  addFundings() {
    if (!this.props.edit) {
      // For new Projects
      if (this.props.fundings[0].source !== '') {
        this.setState(prev => {
          let fundings = this.props.fundings;
          fundings.splice(0, 0, {source: '', sponsor: '', identifier: ''});
          prev.fundings = fundings;
          prev.error = false;
          return prev
        }, () => this.props.updateFundings(this.state.fundings));
      }
    } else {
      // Only for edit / review
      if (this.props.fundings[0] === undefined || this.props.fundings[0].future.source !== '' || this.props.fundings[0].current.source !== '') {
        this.setState(prev => {
          let future = this.props.fundings;
          future.splice(0, 0, {
            current: { source: '', sponsor: null, identifier: null },
            future: { source: '', sponsor: '', identifier: '' }
          });
          prev.future = future;
          this.props.error && this.props.edit ? this.props.setError() : prev.error = false;
          return prev;
        }, () => this.props.updateFundings(this.state.future));
      }
    }
  }

  removeFundings = (index) => {
    if (!this.props.edit) {
      // For new Projects
      this.setState(prev => {
        if (this.props.fundings.length > 1) {
          let fundings = this.props.fundings;
          fundings.splice(index, 1);
          prev.fundings = fundings;
          return prev;
        }
      }, () => this.props.updateFundings(this.state.fundings));

    } else {
    // Only for edit / review
      this.setState(prev => {
        let future = this.props.fundings;
        if (future[index].current.source === '') {
          future.splice(index, 1);
        } else {
          future[index].future = { source: '', sponsor: '', identifier: '' }
        }
        prev.future = future;
        return prev
      }, () => this.props.updateFundings(this.state.future));
    }
  };

  handleFundingChange = (e) => {
    if (!this.props.edit) {
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
    } else {
      let future = this.props.fundings;
      const field = e.target.name;
      const value = e.target.value;
      const index = e.target.getAttribute('index');
      future[index].future[field] = value;
      this.setState(prev => {
        prev.future = future;
        return prev;
      }, () => this.props.updateFundings(this.state.future));
    }
  };

  handleFundingSelect = (index) => (selectedOption) => {
    if (!this.props.edit) {
      let select = this.props.fundings;
      select[index].source = selectedOption;
      this.setState(prev => {
          prev.fundings = select;
          return prev;
        }, () => this.props.updateFundings(this.state.fundings)
      )
    } else {
      let select = this.props.fundings;
      select[index].future.source = selectedOption;
      this.setState(prev => {
          prev.future = select;
          if (this.props.error)  this.props.setError();
          return prev;
        }, () => this.props.updateFundings(this.state.future)
      )
    }
  };


  // In edit mode we use an array of indexes, indicating which row has an error.
  // this.props.error is used to hide error highlights on change, and validating again on submit.
  getSourceError = (index) => {
    let hasError = false;
    if (this.props.edit === true) {
      hasError = this.props.error && this.props.errorIndex.includes(index)
    } else {
      hasError = this.props.error && index === 0
    }
    return hasError
  };

  getIdentifierError = (element) => {
    let identifierHasError = false;
    const source = this.props.edit ? element.future.source : element.source;
    if (this.props.fundingAwardNumberError && source.value === 'federal_prime') {
      identifierHasError = this.props.edit ? isEmpty(element.future.identifier): isEmpty(element.identifier)
    }
    return identifierHasError;
  };

  render() {
    let {
      fundings = [],
      current = []
    } = this.props;
    return (
      h(Fragment, {}, [
        div({ className: "row" }, [
          div({ className: "col-lg-11 col-md-10 col-sm-10 col-9" }, [
            div({ className: "row " + (this.props.readOnly ? 'inputFieldReadOnly' : '') }, [
              div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                label({ className: "inputFieldLabel noMargin" }, ["Funding Source"])
              ]),
              div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                label({ className: "inputFieldLabel noMargin" }, ["Sponsor Name/Payer"])
              ]),
              div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                label({ className: "inputFieldLabel noMargin" }, ["Award Number/Identifier"])
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
            div({ className: "row", style: {'marginBottom': '15px'} }, [
              div({ className: "col-lg-11 col-md-10 col-sm-10 col-9" }, [
                div({ className: "row" }, [
                  div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                    InputFieldSelect({
                      label: "",
                      id: idx + "-source",
                      index: idx,
                      name: "source",
                      options: fundingOptions,
                      value: this.props.edit ? rd.future.source : rd.source,
                      currentValue: this.props.edit ? current[idx].current.source : rd.source,
                      onChange: this.handleFundingSelect,
                      error: this.getSourceError(idx),
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
                      value: this.props.edit ? rd.future.sponsor : rd.sponsor,
                      currentValue: this.props.edit ? current[idx].current.sponsor : rd.sponsor,
                      disabled: false,
                      required: true,
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
                      error: this.getIdentifierError(rd),
                      errorMessage: this.props.errorMessage,
                      value: this.props.edit ? rd.future.identifier: rd.identifier,
                      currentValue: this.props.edit ? current[idx].current.identifier : rd.identifier,
                      disabled: false,
                      required: (rd.source.value === 'federal_prime' || rd.source.value === 'federal_sub-award'),
                      onChange: this.handleFundingChange,
                      readOnly: this.props.readOnly
                    })
                  ])
                ])
              ]),
              div({ className: "col-lg-1 col-md-2 col-sm-2 col-3", style: { "paddingTop": "12px" } }, [
                Btn({
                  action: { labelClass: "glyphicon glyphicon-remove", handler: (e) => this.removeFundings(idx) },
                  disabled: fundings.length === 1,
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
