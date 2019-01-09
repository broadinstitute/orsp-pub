import { Component, Fragment } from 'react';
import { input, hh, h, div, p, hr, small } from 'react-hyperscript-helpers';
import { InputFieldText } from './InputFieldText';
import { Btn } from './Btn';

export const InstitutionalSource = hh(class InstitutionalSource extends Component {

  constructor(props) {
    super(props);
    this.addInstitutionalSources = this.addInstitutionalSources.bind(this);
    this.removeInstitutionalSources = this.removeInstitutionalSources.bind(this);
  }

  state = {
    institutionalSources: this.props.institutionalSources,
  };

  addInstitutionalSources() {
    if (this.state.institutionalSources[0].name !== '') {
      this.setState(prev => {
        let institutionalSources = prev.institutionalSources;
        institutionalSources.splice(0, 0, { name: '', country: '' });
        prev.institutionalSources = institutionalSources;
        prev.error = false;
        return prev;
      });
    }
  }

  removeInstitutionalSources = (index) => (e) => {
    if (this.state.institutionalSources.length > 1) {
      this.setState(prev => {
        let institutionalSources = prev.institutionalSources;
        institutionalSources.splice(index, 1);
        prev.institutionalSources = institutionalSources;
        return prev;
      });
    }
  };

  handleInstitutionalChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const index = e.target.getAttribute('index');
    this.setState(prev => {
      prev.institutionalSources[index][field] = value;
      return prev;
    }, () => this.props.updateInstitutionalSource(this.state.institutionalSources, field));
  };

  render() {

    return (
      h(Fragment, {}, [
        div({ className: "row" }, [
          div({ className: "col-lg-11 col-md-10 col-sm-10 col-9" }, [
            div({ className: "row" }, [
              div({ className: "col-lg-6 col-md-6 col-sm-6 col-12" }, [
                p({ className: "noMargin" }, ["Name"])
              ]),
              div({ className: "col-lg-6 col-md-6 col-sm-6 col-12" }, [
                p({ className: "noMargin" }, ["Country"])
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

        this.state.institutionalSources.map((rd, index) => {
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
                      value: this.state.institutionalSources[index].name,
                      disabled: index > 0,
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
                      value: this.state.institutionalSources[index].country,
                      disabled: index > 0,
                      required: true,
                      onChange: this.handleInstitutionalChange,
                      error: this.props.errorCountry && index === 0,
                      errorMessage: this.props.errorMessage
                    })
                  ])
                ])
              ]),
              div({ className: "col-lg-1 col-md-2 col-sm-2 col-3", style: { "paddingTop": "12px" } }, [
                Btn({ action: { labelClass: "glyphicon glyphicon-remove", handler: this.removeInstitutionalSources(index) },
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
