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
      future: [],
      institutionalSources: []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log("PROPS ", nextProps);
    if (nextProps.edit && nextProps.current !== prevState.current) {
      return { current: nextProps.current, future: nextProps.future};
    } else {
      return null
    }
  }

  addInstitutionalSources() {
    if (!this.props.edit) {
      // For new Projects
      if (this.state.institutionalSources[0].name !== '' && this.state.institutionalSources[0].country !== '') {
        this.setState(prev => {
          let institutionalSources = this.state.institutionalSources;
          institutionalSources.splice(0, 0, { name: '', country: '' });
          prev.institutionalSources = institutionalSources;
          prev.error = false;
          return prev
        }, () => this.props.updateInstitutionalSource(this.state.institutionalSources));
      }
    } else {
      // Only for edit / review
      if ((this.props.institutionalSources[0].future.name !== '' && this.props.institutionalSources[0].future.country !== '')
        || this.props.institutionalSources[0].current.name && this.props.institutionalSources[0].current.country ) {
        this.setState(prev => {
          let institutionalSources = this.props.institutionalSources;
          institutionalSources.splice(0, 0, {
            current: { name: '', country: '' },
            future: { name: '', country: '' }
          });
          prev.institutionalSources = institutionalSources;
          this.props.error && this.props.edit ? this.props.errorHandler() : prev.error = false;
          return prev;
        }, () => {
          this.props.updateInstitutionalSource(this.state.institutionalSources)
      });
      } else {
        this.validate();
      }
    }
  }

  removeInstitutionalSources = (index) => {
    console.log("REMOVE");
    if (!this.props.edit) {
      // For new Projects
      if (this.props.institutionalSources.length > 1) {
        this.setState(prev => {
          let institutionalSources = prev.institutionalSources;
          institutionalSources.splice(index, 1);
          prev.institutionalSources = institutionalSources;
          return prev;
        }, () => this.props.updateInstitutionalSource(this.state.institutionalSources));
      }
    } else {
      // Only for edit / review
        let institutionalSources = this.props.institutionalSources;
      // if (institutionalSources.filter( element => !this.isEmpty(element.future.name) && !this.isEmpty(element.future.country)).length > 0) {
        if (this.isEmpty(this.props.institutionalSources[index].current.name)) {
          institutionalSources.splice(index, 1);
        } else {
          institutionalSources[index].future = { name: '', country: '' }
        }

      this.setState(prev => {
        prev.institutionalSources = institutionalSources;
        return prev
      }, () => this.props.updateInstitutionalSource(this.state.institutionalSources));
    }
  };

  handleInstitutionalChange = (e) => {
    let institutionalSources = this.state.institutionalSources;
    const field = e.target.name;
    const value = e.target.value;
    const index = e.target.getAttribute('index');
    institutionalSources[index].future[field] = value;
    this.setState({ institutionalSources: institutionalSources, error: false, institutionalNameErrorIndex: [], institutionalCountryErrorIndex: [] });
    // this.validate();
    this.props.updateInstitutionalSource(this.state.institutionalSources, field);
  };


  handleInstitutionalChange = (e) => {
    if (!this.props.edit) {
      let institutionalSources = this.props.institutionalSources;
      const field = e.target.name;
      const value = e.target.value;
      const index = e.target.getAttribute('index');
      institutionalSources[index][field] = value;
      this.setState(prev => {
        prev.institutionalSources = institutionalSources;
        return prev;
      }, () => {
        this.props.updateInstitutionalSource(this.state.institutionalSources)
      });
    } else {
      let institutionalSources = this.props.institutionalSources;
      const field = e.target.name;
      const value = e.target.value;
      const index = e.target.getAttribute('index');
      institutionalSources[index].future[field] = value;
      this.setState(prev => {
        prev.institutionalSources = institutionalSources;
        return prev;
      }, () => this.props.updateInstitutionalSource(this.state.institutionalSources));
    }
  };

  isEmpty(value) {
    return value === "" || value === null || value === undefined;
  }

  validate = (action, indexToRemove) => {
    let institutionalNameErrorIndex = [];
    let institutionalCountryErrorIndex = [];
    let institutionalError = this.state.institutionalSources.filter((obj, idx) => {
      let response = false;
      if (this.isEmpty(obj.current.name) && this.isEmpty(obj.future.name)
      || this.isEmpty(obj.future.name) && !this.isEmpty(obj.future.country)
      ) {
        institutionalNameErrorIndex.push(idx);
        response = true;
      }
      if (this.isEmpty(obj.future.country) && this.isEmpty(obj.current.country)
        || this.isEmpty(obj.future.country) && !this.isEmpty(obj.future.name)
      ) {
        institutionalCountryErrorIndex.push(idx);
        response = true;
      }
      if (action === "remove" && !this.state.institutionalSources.filter(element => !this.isEmpty(element.future.name) && !this.isEmpty(element.future.country)).length > 0) {
        institutionalNameErrorIndex.push(indexToRemove);
        institutionalCountryErrorIndex.push(indexToRemove);
        response = true;
      }
      this.props.errorHandler(response);
      return response;
    }).length > 0;

    // console.log("error index name ", institutionalNameErrorIndex);
    // console.log("error index country ", institutionalCountryErrorIndex);
    console.log("error institutionalError ", institutionalError);
    this.setState(prev => {
      prev.institutionalNameErrorIndex = institutionalNameErrorIndex;
      prev.institutionalCountryErrorIndex = institutionalCountryErrorIndex;
      prev.error = institutionalError;
      return prev;
    }, () => {
      this.props.errorHandler(this.state.error);
    });
  };

  getError(index, field) {
    if (field === "name") {
      return this.props.error === true ? this.props.institutionalNameErrorIndex.includes(index) : false;
    } else {
      return this.props.error === true ? this.props.institutionalCountryErrorIndex.includes(index) : false;
    }
  }

  render() {
    let { institutionalSources = [],
          currentValue = [] } = this.props;

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
            // console.log("value??? ", this.props.edit ? rd.future.name : rd.name),
            div({ className: "row" }, [
              div({ className: "col-lg-11 col-md-10 col-sm-10 col-9" }, [
                div({ className: "row" }, [
                  div({ className: "col-lg-6 col-md-6 col-sm-6 col-12" }, [
                    InputFieldText({
                      index: index,
                      id: index + "name",
                      name: "name",
                      label: "",
                      value: this.props.edit ? rd.future.name : rd.name,
                      currentValue: this.props.edit ? currentValue[index].current.name : rd.name,
                      required: true,
                      onChange: this.handleInstitutionalChange,
                      error: this.getError(index, "name"),
                      errorMessage: this.props.errorMessage,
                      readOnly: this.props.readOnly,
                      edited: this.props.readOnly,
                      edit: this.props.edit
                    })
                  ]),
                  div({ className: "col-lg-6 col-md-6 col-sm-6 col-12" }, [
                    InputFieldText({
                      id: index + "country",
                      index: index,
                      name: "country",
                      value: this.props.edit ? rd.future.country : rd.country,
                      currentValue: this.props.edit ? currentValue[index].current.country : rd.country,
                      required: true,
                      onChange: this.handleInstitutionalChange,
                      error: this.getError(index, "country"),
                      // error: this.props.errorCountry || this.state.error ? this.state.institutionalCountryErrorIndex.includes(index) : index === 0,
                      errorMessage: this.props.errorMessage,
                      readOnly: this.props.readOnly
                    })
                  ])
                ])
              ]),
              div({ className: "col-lg-1 col-md-2 col-sm-2 col-3", style: { "paddingTop": "12px" } }, [
                Btn({
                  action: { labelClass: "glyphicon glyphicon-remove", handler: (e) => this.removeInstitutionalSources(index) },
                  disabled: institutionalSources.length === 1,
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
