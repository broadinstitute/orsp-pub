import { Component, Fragment } from 'react'
import { input, hh, h, div, p, hr, small, label } from 'react-hyperscript-helpers';
import { InputFieldText } from './InputFieldText';
import { InputFieldSelect } from './InputFieldSelect';
import { Btn } from './Btn';
import { AsyncMultiSelect } from './AsyncMultiSelect';
import { Search } from '../util/ajax';
import { isEmpty } from "../util/Utils";

const roleOptions = [
  { value: 'co_investigaator', label: 'Co-Investigator' },
  { value: 'project_manager', label: 'Project/Account Manager' },
  { value: 'coordinator', label: 'Coordinator' },
  { value: 'post_doc', label: 'Post-Doc' },
  { value: 'data_manager', label: 'Data Analyst/Manager' },
  { value: 'lab_tech', label: 'Lab Tech' },  
  { value: 'other', label: 'Other' }
]

export const KeyPersonnel = hh(class KeyPersonnel extends Component {
  constructor(props) {
    super(props);
    this.addKeyPersonnel = this.addKeyPersonnel.bind(this);
    this.removeKeyPersonnel = this.removeKeyPersonnel.bind(this);
    this.handleRoleSelect = this.handleRoleSelect.bind(this);
    this.loadUsersOptions = this.loadUsersOptions.bind(this);

    this.state = {
      future: [],
      keyPersonnel: []
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.edit && nextProps.current !== prevState.current) {
      return { current: nextProps.current, future: nextProps.future };
    }
    else return null;
  }

  addKeyPersonnel() {
    if (!this.props.edit) {
      // For new Projects
      if (this.props.keyPersonnel[0].name !== null || (this.props.keyPersonnel[0].role && this.props.keyPersonnel[0].role.value !== '')) {
        this.setState(prev => {
          let keyPersonnel = this.props.keyPersonnel;
          keyPersonnel.splice(0, 0, { name: null, role: '', roleOther: '' });
          prev.keyPersonnel = keyPersonnel;
          prev.error = false;
          return prev
        }, () => this.props.updateKeyPersonnel(this.state.keyPersonnel));
      }
    } else {
      // Only for edit / review
      if (this.props.keyPersonnel[0] === undefined || 
          this.props.keyPersonnel[0].future.name !== null || 
          (this.props.keyPersonnel[0].future.role && this.props.keyPersonnel[0].future.role.value !== '')) {
        this.setState(prev => {
          let future = this.props.keyPersonnel;
          future.splice(0, 0, {
            current: { name: null, role: '', roleOther: '' },
            future: { name: null, role: '', roleOther: '' }
          });
          prev.future = future;
          this.props.error && this.props.edit ? this.props.setError() : prev.error = false;
          return prev;
        }, () => this.props.updateKeyPersonnel(this.state.future));
      }
    }
  }

  removeKeyPersonnel = (index) => {
    if (!this.props.edit) {
      // For new Projects
      this.setState(prev => {
        if (this.props.keyPersonnel.length > 1) {
          let keyPersonnel = this.props.keyPersonnel;
          keyPersonnel.splice(index, 1);
          prev.keyPersonnel = keyPersonnel;
          return prev;
        }
      }, () => this.props.updateKeyPersonnel(this.state.keyPersonnel));

    } else {
      // Only for edit / review
      this.setState(prev => {
        let future = this.props.keyPersonnel;
        if (future[index].current.name === null) {
          future.splice(index, 1);
        } else {
          future[index].future = { name: null, role: '', roleOther: '' }
        }
        prev.future = future;
        return prev
      }, () => this.props.updateKeyPersonnel(this.state.future));
    }
  };

  handleKeyPersonnelChange = (e) => {
    if (!this.props.edit) {
      let keyPersonnel = [...this.props.keyPersonnel];
      const field = e.target.name;
      const value = e.target.value;
      const index = parseInt(e.target.getAttribute('index'));
      keyPersonnel[index] = { ...keyPersonnel[index] };
      keyPersonnel[index][field] = value;
      this.setState(prev => {
        prev.keyPersonnel = keyPersonnel;
        return prev;
      }, () => {
        this.props.updateKeyPersonnel(this.state.keyPersonnel)
      });
    } else {
      let keyPersonnel = [...this.props.keyPersonnel];
      const field = e.target.name;
      const value = e.target.value;
      const index = parseInt(e.target.getAttribute('index'));
      keyPersonnel[index] = { 
        ...keyPersonnel[index],
        future: { ...keyPersonnel[index].future }
      };
      keyPersonnel[index].future[field] = value;
      this.setState(prev => {
        prev.future = keyPersonnel;
        return prev;
      }, () => this.props.updateKeyPersonnel(this.state.future));
    }
  };

  handleNameChange = (index) => (data, action) => {
    if (!this.props.edit) {
      let keyPersonnel = [...this.props.keyPersonnel];
      keyPersonnel[index] = { ...keyPersonnel[index] };
      keyPersonnel[index].name = data;
      this.setState(prev => {
        prev.keyPersonnel = keyPersonnel;
        return prev;
      }, () => {
        this.props.updateKeyPersonnel(this.state.keyPersonnel)
      });
    } else {
      let keyPersonnel = [...this.props.keyPersonnel];
      keyPersonnel[index] = { 
        ...keyPersonnel[index],
        future: { ...keyPersonnel[index].future }
      };
      keyPersonnel[index].future.name = data;
      this.setState(prev => {
        prev.future = keyPersonnel;
        if (this.props.error && this.props.setError) this.props.setError();
        return prev;
      }, () => this.props.updateKeyPersonnel(this.state.future));
    }
  };

  handleRoleSelect = (index) => (selectedOption) => {
    if (!this.props.edit) {
      let keyPersonnel = [...this.props.keyPersonnel];
      keyPersonnel[index] = { ...keyPersonnel[index] };
      keyPersonnel[index].role = selectedOption;
      // Clear roleOther if not "other"
      if (!selectedOption || selectedOption.value !== "other") {
        keyPersonnel[index].roleOther = '';
      }
      this.setState(prev => {
        prev.keyPersonnel = keyPersonnel;
        return prev;
      }, () => this.props.updateKeyPersonnel(this.state.keyPersonnel)
      )
    } else {
      let keyPersonnel = [...this.props.keyPersonnel];
      keyPersonnel[index] = { 
        ...keyPersonnel[index],
        future: { ...keyPersonnel[index].future }
      };
      keyPersonnel[index].future.role = selectedOption;
      // Clear roleOther if not "other"
      if (!selectedOption || selectedOption.value !== "other") {
        keyPersonnel[index].future.roleOther = '';
      }
      this.setState(prev => {
        prev.future = keyPersonnel;
        if (this.props.error && this.props.setError) this.props.setError();
        return prev;
      }, () => this.props.updateKeyPersonnel(this.state.future)
      )
    }
  };

  loadUsersOptions(query, callback) {
    if (query.length > 2) {
      Search.getMatchingQuery(query).then(response => {
        if (this._isMounted) {
          let options = response.data.map(function (item) {
            return {
              key: item.id,
              value: item.value,
              label: item.label
            };
          });
          callback(options);
        }
      }).catch(error => {
        this.setState(() => { throw error; });
      });
    }
  };

  // In edit mode we use an array of indexes, indicating which row has an error.
  // this.props.error is used to hide error highlights on change, and validating again on submit.
  getNameError = (index) => {
    let hasError = false;
    const kp = this.props.keyPersonnel[index];
    if (!kp) return false;
    
    const name = this.props.edit ? kp.future.name : kp.name;
    const isNameEmpty = name === null || name === undefined || (Array.isArray(name) && name.length === 0);
    
    if (this.props.edit === true) {
      hasError = this.props.error && this.props.errorIndex && this.props.errorIndex.includes(index) && isNameEmpty;
    } else {
      hasError = this.props.error && index === 0 && isNameEmpty;
    }
    return hasError
  };

  getRoleError = (index) => {
    let hasError = false;
    const kp = this.props.keyPersonnel[index];
    if (!kp) return false;
    
    const role = this.props.edit ? kp.future.role : kp.role;
    const isRoleEmpty = !role || isEmpty(role.value);
    
    if (this.props.edit === true) {
      hasError = this.props.error && this.props.errorIndex && this.props.errorIndex.includes(index) && isRoleEmpty;
    } else {
      hasError = this.props.error && index === 0 && isRoleEmpty;
    }
    return hasError
  };

  getRoleOtherError = (index) => {
    let hasError = false;
    const kp = this.props.keyPersonnel[index];
    const isOther = this.props.edit 
      ? (kp.future.role && kp.future.role.value === "other")
      : (kp.role && kp.role.value === "other");
    
    if (isOther) {
      const roleOther = this.props.edit ? kp.future.roleOther : kp.roleOther;
      if (this.props.edit === true) {
        hasError = this.props.error && this.props.errorIndex && this.props.errorIndex.includes(index) && isEmpty(roleOther);
      } else {
        hasError = this.props.error && index === 0 && isEmpty(roleOther);
      }
    }
    return hasError
  };

  render() {
    let {
      keyPersonnel = [],
      current = []
    } = this.props;
    
    return (
      h(Fragment, {}, [
        div({ className: "row" }, [
          div({ className: "col-lg-11 col-md-10 col-sm-10 col-9" }, [
            div({ className: "row " + (this.props.readOnly ? 'inputFieldReadOnly' : '') }, [
              div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                label({ className: "inputFieldLabel noMargin" }, ["Name"])
              ]),
              div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                label({ className: "inputFieldLabel noMargin" }, ["Role"])
              ]),
              div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                label({ className: "inputFieldLabel noMargin" }, ["Role (Other)"])
              ])
            ])
          ]),
          div({ className: "col-lg-1 col-md-2 col-sm-2 col-3" }, [
            Btn({
              action: { labelClass: "glyphicon glyphicon-plus", handler: this.addKeyPersonnel },
              disabled: false,
              isRendered: !this.props.readOnly
            }),
          ])
        ]),

        hr({ className: "fullWidth" }),
        keyPersonnel.map((kp, idx) => {
          const isOther = this.props.edit 
            ? (kp.future.role && kp.future.role.value === "other")
            : (kp.role && kp.role.value === "other");
          
          return h(Fragment, { key: idx }, [
            div({ className: "row", style: { 'marginBottom': '15px' } }, [
              div({ className: "col-lg-11 col-md-10 col-sm-10 col-9" }, [
                div({ className: "row" }, [
                  div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                    AsyncMultiSelect({
                      id: idx + "-name",
                      index: idx,
                      isDisabled: false,
                      loadOptions: this.loadUsersOptions,
                      handleChange: this.handleNameChange(idx),
                      value: this.props.edit ? kp.future.name : kp.name,
                      currentValue: [],
                      placeholder: "Start typing the Name",
                      isMulti: false,
                      error: this.getNameError(idx),
                      readOnly: this.props.readOnly
                    })
                  ]),
                  div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                    InputFieldSelect({
                      label: "",
                      id: idx + "-role",
                      index: idx,
                      name: "role",
                      options: roleOptions,
                      value: this.props.edit ? kp.future.role : kp.role,
                      currentValue: [],
                      onChange: this.handleRoleSelect,
                      error: this.getRoleError(idx),
                      errorMessage: this.props.errorMessage,
                      readOnly: this.props.readOnly,
                      edited: this.props.readOnly,
                      edit: this.props.edit,
                      placeholder: "Choose a role..."
                    })
                  ]),
                  div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                    InputFieldText({
                      id: idx + "-roleOther",
                      index: idx,
                      name: "roleOther",
                      label: "",
                      value: this.props.edit ? kp.future.roleOther : kp.roleOther,
                      currentValue: this.props.edit ? current[idx] && current[idx].current.roleOther : kp.roleOther,
                      disabled: !isOther,
                      required: false,
                      onChange: this.handleKeyPersonnelChange,
                      readOnly: this.props.readOnly,
                      edit: this.props.edit,
                      error: isOther && this.getRoleOtherError(idx),
                      errorMessage: this.props.errorMessage
                    })
                  ])
                ])
              ]),
              div({ className: "col-lg-1 col-md-2 col-sm-2 col-3", style: { "paddingTop": "12px" } }, [
                Btn({
                  action: { labelClass: "glyphicon glyphicon-remove", handler: (e) => this.removeKeyPersonnel(idx) },
                  disabled: keyPersonnel.length === 1,
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
