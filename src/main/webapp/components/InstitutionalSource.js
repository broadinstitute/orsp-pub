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
    error: false,
    errorMessage: 'Requiered field'
  };

  addInstitutionalSources() {
    if (this.state.institutionalSources[0].name !== '') {
      this.setState(prev => {
        let institutionalSources = prev.institutionalSources;
        institutionalSources.splice(0, 0, { name: '', country: '' });
        prev.institutionalSources = institutionalSources;
        prev.error = false;
        return prev;
      }, () => this.props.updateInstitutionalSource(this.state.institutionalSources));
    }
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
  };

  handleInstitutionalChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const id = e.target.id;
    this.setState(prev => {
      prev.institutionalSources[id][field] = value;
      return prev;
    }, () => this.props.updateInstitutionalSource(this.state.institutionalSources));
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
            Btn({ action: { labelClass: "glyphicon glyphicon-plus", handler: this.addInstitutionalSources }, disabled: false }),
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
                      id: index,
                      name: "name",
                      label: "",
                      value: this.state.institutionalSources[index].name,
                      disabled: false,
                      required: true,
                      onChange: this.handleInstitutionalChange
                    })
                  ]),
                  div({ className: "col-lg-6 col-md-6 col-sm-6 col-12" }, [
                    InputFieldText({
                      id: index,
                      name: "country",
                      value: this.state.institutionalSources[index].country,
                      disabled: false,
                      required: false,
                      onChange: this.handleInstitutionalChange
                    })
                  ])
                ])
              ]),
              div({ className: "col-lg-1 col-md-2 col-sm-2 col-3", style: { "paddingTop": "12px" } }, [
                Btn({ action: { labelClass: "glyphicon glyphicon-remove", handler: (e) => this.removeInstitutionalSources(index) }, disabled: !this.state.institutionalSources.length > 1 }),
              ])
            ]),
            small({ isRendered: this.props.error && index === 0, className: "errorMessage" }, [this.props.errorMessage])
          ]);
        })
      ])
    )
  }
});
