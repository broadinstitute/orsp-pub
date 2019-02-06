import { Component, Fragment } from 'react';
import { input, hh, h, div, p, hr, small, label } from 'react-hyperscript-helpers';
import { InputFieldText } from './InputFieldText';
import { Btn } from './Btn';

export const InstitutionalSource = hh(class InstitutionalSource extends Component {

  constructor(props) {
    super(props);
    this.addInstitutionalSources = this.addInstitutionalSources.bind(this);
    this.removeInstitutionalSources = this.removeInstitutionalSources.bind(this);
    this.state = {
      institutionalSources: [{ name: '', country: '' }],
      currentAuxiliar: [{ source: '', sponsor: '', identifier: '' }]
    };
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      currentAuxiliar: nextProps.currentAuxiliar
    }
  }

  addInstitutionalSources() {
    if (this.props.institutionalSources[0].name !== '') {
      this.setState(prev => {
        let institutionalSources = prev.institutionalSources;
        institutionalSources.splice(0, 0, { name: '', country: '' });

        if (this.props.edit) {
          let current = prev.currentAuxiliar;
          current.splice(0, 0, { name: null, country: null });
          this.props.error && this.props.edit ? this.props.setError() : prev.error = false;
        }

        prev.institutionalSources = institutionalSources;
        prev.error = false;
        return prev;
      });
    } else {
      if (!this.props.error && this.props.edit) this.props.setError();
    }
  }

  removeInstitutionalSources = (index) => (e) => {

    this.setState(prev => {
      let institutionalSources = this.props.institutionalSources;
      let current = prev.currentAuxiliar;

      if (!this.props.edit && institutionalSources.length > 1) {
        institutionalSources.splice(index, 1);
      } else if (this.props.edit) {
        let diff =  institutionalSources.length - this.props.currentOriginal.length;
        if (index - diff < 0) { // determines if element to delete is within the original array or the originalTemporal
          institutionalSources.splice(index, 1);
          current.splice(index, 1);
        } else {
          institutionalSources[index] = { source: '', sponsor: '', identifier:  '' };
        }
        prev.currentAuxiliar = current;
      }
      prev.institutionalSources = institutionalSources;
      return prev;
    });

  };

  handleInstitutionalChange = (e) => {
    let institutionalSources = this.props.institutionalSources;
    const field = e.target.name;
    const value = e.target.value;
    const index = e.target.getAttribute('index');
    institutionalSources[index][field] = value;
    this.setState(prev => {
      prev.institutionalSources = value;
      return prev;
    }, () =>
        this.props.updateInstitutionalSource(this.state.institutionalSources, field));
  };

  getCurrentValue(institutionalSources, currentOriginal, idx, rd, field) {
    let currentValue = '';
    if (institutionalSources.length < currentOriginal.length && currentOriginal[idx][field] !== undefined) {
      currentValue = currentOriginal[idx][field];
    } else if (this.props.currentAuxiliar !== undefined && this.props.currentAuxiliar[idx] !== undefined) {
      currentValue = this.props.currentAuxiliar[idx][field];
    } else {
      currentValue = rd[field];
    }
    return currentValue;
  }


  render() {
    const { institutionalSources = [] } = this.props;
    const { currentOriginal = [] } = this.props;
    return (
      h(Fragment, {}, [
        div({ className: "row " + (this.props.readOnly ? 'inputFieldReadOnly' : '') }, [
          div({ className: "col-lg-11 col-md-10 col-sm-10 col-9" }, [
            div({ className: "row" }, [
              div({ className: "col-lg-6 col-md-6 col-sm-6 col-12" }, [
                label({ className: "noMargin" }, ["Name"])
              ]),
              div({ className: "col-lg-6 col-md-6 col-sm-6 col-12" }, [
                label({ className: "noMargin" }, ["Country"])
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

        institutionalSources.map((rd, index) => {

          return h(Fragment, { key: index }, [

            div({ className: "row" }, [
              div({ className: "col-lg-11 col-md-10 col-sm-10 col-9" }, [
                div({ className: "row" }, [
                  div({ className: "col-lg-6 col-md-6 col-sm-6 col-12" }, [
                    InputFieldText({
                      index: index,
                      id: index + "name",
                      name: "name",
                      label: "",
                      value: rd.name,
                      currentValue: this.getCurrentValue(institutionalSources, currentOriginal, index, rd, "name"),
                      disabled: (index > 0) && !this.props.readOnly,
                      required: true,
                      onChange: this.handleInstitutionalChange,
                      error: this.props.errorName && index === 0,
                      errorMessage: this.props.errorMessage,
                      readOnly: this.props.readOnly
                    })
                  ]),
                  div({ className: "col-lg-6 col-md-6 col-sm-6 col-12" }, [
                    InputFieldText({
                      id: index + "country",
                      index: index,
                      name: "country",
                      value: rd.country,
                      currentValue: this.getCurrentValue(institutionalSources, currentOriginal, index, rd, "country"),
                      disabled: (index > 0) && !this.props.readOnly,
                      required: true,
                      onChange: this.handleInstitutionalChange,
                      error: this.props.errorCountry && index === 0,
                      errorMessage: this.props.errorMessage,
                      readOnly: this.props.readOnly
                    })
                  ])
                ])
              ]),
              div({ className: "col-lg-1 col-md-2 col-sm-2 col-3", style: { "paddingTop": "12px" } }, [
                Btn({
                  action: { labelClass: "glyphicon glyphicon-remove", handler: this.removeInstitutionalSources(index) },
                  disabled: !this.state.institutionalSources.length > 1,
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
