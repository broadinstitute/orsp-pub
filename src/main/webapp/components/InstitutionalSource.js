import { Component, Fragment } from 'react';
import { div, h, hh, hr, label } from 'react-hyperscript-helpers';
import { InputFieldText } from './InputFieldText';
import { Btn } from './Btn';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

export const InstitutionalSource = hh(class InstitutionalSource extends Component {

  constructor(props) {
    super(props);
    this.addInstitutionalSources = this.addInstitutionalSources.bind(this);
    this.removeInstitutionalSources = this.removeInstitutionalSources.bind(this);
    this.state = {
      institutionalSources: [{ country: '' }]
    };
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.edit && nextProps.institutionalSources !== prevState.institutionalSources) {
      return { institutionalSources: nextProps.institutionalSources};
    } else {
      return null
    }
  }

  checkEmptySrc(elementPostition) {
    return (get(this.props.institutionalSources[elementPostition], 'future.name') !== '' && get(this.props.institutionalSources[elementPostition], 'future.country') !== '')
      || (!isEmpty(this.props.institutionalSources[elementPostition].current.name) && !isEmpty(this.props.institutionalSources[elementPostition].current.country));
  }

  addInstitutionalSources() {
    if (this.props.edit) {
      if (!isEmpty(this.props.institutionalSources) && this.checkEmptySrc(0)) {
        this.setState(prev => {
          let institutionalSources = this.props.institutionalSources;
          institutionalSources.splice(0, 0, {
            current: { country: null },
            future: { country: '' }
          });
          prev.institutionalSources = institutionalSources;
          this.props.error && this.props.edit ? this.props.errorHandler() : prev.error = false;
          return prev;
        }, () => {
          this.props.updateInstitutionalSource(this.state.institutionalSources)
        });
      } else if (this.checkEmptySrc(0) && this.checkEmptySrc(1)) {
        this.props.updateInstitutionalSource([{
          current: { country: null },
          future: { country: '' }
        }])
      }
    } else {
      // For new Projects
      if (this.props.institutionalSources !== undefined && this.props.institutionalSources[0].country !== '') {
        this.setState(prev => {
          let institutionalSources = this.state.institutionalSources;
          institutionalSources.splice(0, 0, { country: '' });
          prev.institutionalSources = institutionalSources;
          prev.error = false;
          return prev
        }, () => this.props.updateInstitutionalSource(this.state.institutionalSources));
      }
    }
  }

  removeInstitutionalSources = (index) => {
    if (this.props.edit) {
      // Only for edit / review
      let institutionalSources = this.props.institutionalSources;
      if (this.isEmpty(this.props.institutionalSources[index].current.name)) {
        institutionalSources.splice(index, 1);
      } else {
        institutionalSources[index].future = { name: '', country: '' }
      }
      this.setState(prev => {
        prev.institutionalSources = institutionalSources;
        return prev
        }, () => this.props.updateInstitutionalSource(this.state.institutionalSources)
      );
    } else {
      // For new Projects
      if (this.props.institutionalSources.length > 1) {
        this.setState(prev => {
          let institutionalSources = prev.institutionalSources;
          institutionalSources.splice(index, 1);
          prev.institutionalSources = institutionalSources;
          return prev;
        }, () => this.props.updateInstitutionalSource(this.state.institutionalSources));
      }
    }
  };

  handleInstitutionalChange = (e) => {
    if (this.props.edit) {
      let institutionalSources = this.props.institutionalSources;
      const field = e.target.name;
      const value = e.target.value;
      const index = e.target.getAttribute('index');
      institutionalSources[index].future[field] = value;
      this.setState(prev => {
        prev.institutionalSources = institutionalSources;
        return prev;
        }, () => this.props.updateInstitutionalSource(this.state.institutionalSources)
      );
    } else {
      let institutionalSources = this.props.institutionalSources;
      const field = e.target.name;
      const value = e.target.value;
      const index = e.target.getAttribute('index');
      institutionalSources[index][field] = value;
      this.setState(prev => {
        prev.institutionalSources = institutionalSources;
        return prev;
      }, () => {
        this.props.updateInstitutionalSource(this.state.institutionalSources, field)
      });
    }
  };

  isEmpty(value) {
    return value === "" || value === null || value === undefined;
  }

  getError(index, field) {
    if (field === "name") {
      return this.props.error === true ? this.props.institutionalNameErrorIndex.includes(index) : false;
    } else {
      return this.props.error === true ? this.props.institutionalCountryErrorIndex.includes(index) : false;
    }
  }

  render() {
    return (
      h(Fragment, {}, [
        div({ className: "row " + (this.props.readOnly ? 'inputFieldReadOnly' : '') }, [
          div({ className: "col-lg-11 col-md-10 col-sm-10 col-9" }, [
            div({ className: "row" }, [
              div({ className: "col-lg-11 col-md-10 col-sm-10 col-9" }, [
                label({ className: "inputFieldLabel noMargin" }, ["Country"])
              ])
            ])
          ]),
          div({ className: "col-lg-1 col-md-2 col-sm-2 col-3" }, [
            Btn({
              action: { labelClass: "glyphicon glyphicon-plus", handler: this.addInstitutionalSources },
              disabled: false,
              isRendered: !this.props.readOnly
            }),
          ])
        ]),

        hr({ className: "fullWidth" }),
        this.props.institutionalSources.map((rd, index) => {
          return h(Fragment, { key: index }, [
            div({ className: "row" }, [
              div({ className: "col-lg-11 col-md-10 col-sm-10 col-9" }, [
                div({ className: "row" }, [
                  div({ className: "col-lg-11 col-md-10 col-sm-10 col-9" }, [
                    InputFieldText({
                      id: index + "country",
                      index: index,
                      name: "country",
                      value: this.props.edit ? rd.future.country : rd.country,
                      currentValue: this.props.edit ? rd.current.country : rd.country,
                      required: true,
                      onChange: this.handleInstitutionalChange,
                      error: this.props.edit ? this.getError(index, "country") : this.props.errorCountry && index === 0 && this.isEmpty(rd.country),
                      disabled: (index > 0) && !this.props.edit,
                      errorMessage: this.props.errorMessage,
                      readOnly: this.props.readOnly
                    })
                  ])
                ])
              ]),
              div({ className: "col-lg-1 col-md-2 col-sm-2 col-3", style: { "paddingTop": "12px" } }, [
                Btn({
                  action: { labelClass: "glyphicon glyphicon-remove", handler: (e) => this.removeInstitutionalSources(index) },
                  disabled: this.props.institutionalSources.length === 1,
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
