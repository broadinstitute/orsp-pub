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
    institutionalSources: [{ name: '', country: '' }]
  };

  addInstitutionalSources() {
    console.log("add");
    this.setState(prev => {
      let institutionalSources = prev.institutionalSources;
      institutionalSources.push({ name: '', country: '' });
      prev.institutionalSources = institutionalSources;
      return prev;
    });
  }

  removeInstitutionalSources = (e) => (Index) => {
    if (this.state.institutionalSources.length > 1) {
      this.setState(prev => {
        let institutionalSources = prev.institutionalSources;
        institutionalSources.splice(Index, 1);
        prev.institutionalSources = institutionalSources;
        return prev;
      });
    }
  }

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
            Btn({ action: { labelClass: "glyphicon glyphicon-plus", handler: this.addInstitutionalSources }, disabled: false }),
          ])
        ]),

        hr({ className: "fullWidth" }),

        this.props.institutionalSources.map((rd, Index) => {
          return h(Fragment, { key: Index }, [

            div({ className: "row" }, [
              div({ className: "col-lg-11 col-md-10 col-sm-10 col-9" }, [
                div({ className: "row" }, [
                  div({ className: "col-lg-6 col-md-6 col-sm-6 col-12" }, [
                    InputFieldText({ value: rd.name })
                  ]),
                  div({ className: "col-lg-6 col-md-6 col-sm-6 col-12" }, [
                    InputFieldText({ value: rd.country })
                  ])
                ])
              ]),
              div({ className: "col-lg-1 col-md-2 col-sm-2 col-3", style: { "paddingTop": "12px" } }, [
                Btn({ action: { labelClass: "glyphicon glyphicon-remove", handler: this.removeInstitutionalSources(Index) }, disabled: !this.state.institutionalSources.length > 1 }),
              ])
            ]),
            small({ isRendered: this.props.error, className: "inputFieldErrorMessage" }, [this.props.errorMessage])
          ]);
        })
      ])
    )
  }
});