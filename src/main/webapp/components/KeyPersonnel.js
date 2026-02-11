import { Component, Fragment } from 'react'
import { input, hh, h, div, p, hr, small, label, span } from 'react-hyperscript-helpers';
import { InputFieldText } from './InputFieldText';
import { InputFieldSelect } from './InputFieldSelect';
import { Btn } from './Btn';
import { AsyncMultiSelect } from './AsyncMultiSelect';
import { Search } from '../util/ajax';
import { isEmpty, getDateString } from "../util/Utils";
import { TableComponent } from './TableComponent';

const roleOptions = [
  { value: 'co_investigaator', label: 'Co-Investigator' },
  { value: 'project_manager', label: 'Project/Account Manager' },
  { value: 'coordinator', label: 'Coordinator' },
  { value: 'post_doc', label: 'Post-Doc' },
  { value: 'data_manager', label: 'Data Analyst/Manager' },
  { value: 'lab_tech', label: 'Lab Tech' },  
  { value: 'other', label: 'Other' }
]

const defaultSorted = [{
  dataField: 'date',
  order: 'desc',
  editable: false
}];

const columns = [
  {
    dataField: 'name',
    text: 'Name',
    sort: true,
    editable: false  
  },
  {
    dataField: 'role',
    text: 'Role',
    sort: true,
    editable: false 
  }, 
  {
    dataField: 'dateAdded',
    text: 'Date',
    sort: true,
    editable: false 
  }
];

export const KeyPersonnel = hh(class KeyPersonnel extends Component {
  constructor(props) {
    super(props);
    this.addKeyPersonnel = this.addKeyPersonnel.bind(this);
    this.removeKeyPersonnel = this.removeKeyPersonnel.bind(this);
    this.handleRoleSelect = this.handleRoleSelect.bind(this);
    this.loadUsersOptions = this.loadUsersOptions.bind(this);
    this.createUiKey = this.createUiKey.bind(this);
    this.ensureUiKey = this.ensureUiKey.bind(this);

    this.state = {
      future: [],
      keyPersons: []
    };
  }

  createUiKey() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  ensureUiKey(item) {
    if (!item) return this.createUiKey();
    if (!item._uiKey) item._uiKey = this.createUiKey();
    return item._uiKey;
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
      if (this.props.keyPersons[0].name !== null || (this.props.keyPersons[0].role && this.props.keyPersons[0].role.value !== '')) {
        this.setState(prev => {
          let keyPersons = this.props.keyPersons;
          keyPersons.splice(0, 0, { _uiKey: this.createUiKey(), name: null, role: '', otherRole: '' });
          prev.keyPersons = keyPersons;
          prev.error = false;
          return prev
        }, () => this.props.updateKeyPersons(this.state.keyPersons));
      }
    } else {
      // Only for edit / review
      if (this.props.keyPersons[0] === undefined || 
          this.props.keyPersons[0].future.name !== null || 
          (this.props.keyPersons[0].future.role && this.props.keyPersons[0].future.role.value !== '')) {
        this.setState(prev => {
          let future = this.props.keyPersons;
          future.splice(0, 0, {
            _uiKey: this.createUiKey(),
            current: { name: null, role: '', otherRole: '', updatedDate:'' },
            future: { name: null, role: '', otherRole: '', updatedDate:'' }
          });
          prev.future = future;
          this.props.error && this.props.edit ? this.props.setError() : prev.error = false;
          return prev;
        }, () => this.props.updateKeyPersons(this.state.future));
      }
    }
  }

  removeKeyPersonnel = (index) => {
    if (!this.props.edit) {
      // For new Projects
      this.setState(prev => {
        if (this.props.keyPersons.length > 1) {
          let keyPersons = this.props.keyPersons;
          keyPersons.splice(index, 1);
          prev.keyPersons = keyPersons;
          return prev;
        }
      }, () => this.props.updateKeyPersons(this.state.keyPersons));

    } else {
      // Only for edit / review
      this.setState(prev => {
        let future = this.props.keyPersons;
        if (future[index].current.name === null) {
          future.splice(index, 1);
        } else {
          future[index].future = { name: null, role: '', otherRole: '' }
        }
        prev.future = future;
        return prev
      }, () => this.props.updateKeyPersons(this.state.future));
    }
  };

  handleKeyPersonnelChange = (e) => {
    if (!this.props.edit) {
      let keyPersons = [...this.props.keyPersons];
      const field = e.target.name;
      const value = e.target.value;
      const index = parseInt(e.target.getAttribute('index'));
      keyPersons[index] = { ...keyPersons[index] };
      keyPersons[index][field] = value;
      this.setState(prev => {
        prev.keyPersons = keyPersons;
        return prev;
      }, () => {
        this.props.updateKeyPersons(this.state.keyPersons)
      });
    } else {
      let keyPersons = [...this.props.keyPersons];
      const field = e.target.name;
      const value = e.target.value;
      const index = parseInt(e.target.getAttribute('index'));
      keyPersons[index] = { 
        ...keyPersons[index],
        future: { ...keyPersons[index].future }
      };
      keyPersons[index].future[field] = value;
      this.setState(prev => {
        prev.future = keyPersons;
        return prev;
      }, () => this.props.updateKeyPersons(this.state.future));
    }
  };

  handleNameChange = (index) => (data, action) => {
    if (!this.props.edit) {
      let keyPersons = [...this.props.keyPersons];
      keyPersons[index] = { ...keyPersons[index] };
      keyPersons[index].name = data;
      // If Name is cleared, also clear Role + otherRole to avoid stale selections.
      const isNameCleared =
        data === null ||
        data === undefined ||
        (Array.isArray(data) && data.length === 0);
      if (isNameCleared) {
        keyPersons[index].role = '';
        keyPersons[index].otherRole = '';
      }
      this.setState(prev => {
        prev.keyPersons = keyPersons;
        return prev;
      }, () => {
        this.props.updateKeyPersons(this.state.keyPersons, index)
      });
    } else {
      let keyPersons = [...this.props.keyPersons];
      keyPersons[index] = { 
        ...keyPersons[index],
        future: { ...keyPersons[index].future }
      };
      keyPersons[index].future.name = data;
      // If Name is cleared, also clear Role + otherRole to avoid stale selections.
      const isNameCleared =
        data === null ||
        data === undefined ||
        (Array.isArray(data) && data.length === 0);
      if (isNameCleared) {
        keyPersons[index].future.role = '';
        keyPersons[index].future.otherRole = '';
      }
      this.setState(prev => {
        prev.future = keyPersons;
        if (this.props.error && this.props.setError) this.props.setError();
        return prev;
      }, () => this.props.updateKeyPersons(this.state.future));
    }
  };

  handleRoleSelect = (index) => (selectedOption) => {
    if (!this.props.edit) {
      let keyPersons = [...this.props.keyPersons];
      keyPersons[index] = { ...keyPersons[index] };
      keyPersons[index].role = selectedOption;
      // Clear otherRole if not "other"
      if (!selectedOption || selectedOption.value !== "other") {
        keyPersons[index].otherRole = '';
      }
      this.setState(prev => {
        prev.keyPersons = keyPersons;
        return prev;
      }, () => this.props.updateKeyPersons(this.state.keyPersons)
      )
    } else {
      let keyPersons = [...this.props.keyPersons];
      keyPersons[index] = { 
        ...keyPersons[index],
        future: { ...keyPersons[index].future }
      };
      keyPersons[index].future.role = selectedOption;
      // Clear otherRole if not "other"
      if (!selectedOption || selectedOption.value !== "other") {
        keyPersons[index].future.otherRole = '';
      }
      this.setState(prev => {
        prev.future = keyPersons;
        if (this.props.error && this.props.setError) this.props.setError();
        return prev;
      }, () => this.props.updateKeyPersons(this.state.future)
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
    const kp = this.props.keyPersons[index];
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
    const kp = this.props.keyPersons[index];
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
    const kp = this.props.keyPersons[index];
    const isOther = this.props.edit 
      ? (kp.future.role && kp.future.role.value === "other")
      : (kp.role && kp.role.value === "other");
    
    if (isOther) {
      const otherRole = this.props.edit ? kp.future.otherRole : kp.otherRole;
      if (this.props.edit === true) {
        hasError = this.props.error && this.props.errorIndex && this.props.errorIndex.includes(index) && isEmpty(otherRole);
      } else {
        hasError = this.props.error && index === 0 && isEmpty(otherRole);
      }
    }
    return hasError
  };

  handleKeypersonFieldAlignment = (isOtherRole, kp) => {
    if (!this.props.edit && !this.props.readOnly) {
      // creation
      return isOtherRole ? 'col-lg-4 col-md-4 col-sm-4 col-12' : 'col-lg-6 col-md-6 col-sm-6 col-12'
    }

    if(this.props.edit && !this.props.readOnly){
      const isOtherRole = kp.future && kp.future.role && kp.future.role.value === "other"
      return isOtherRole ? 'col-lg-4 col-md-4 col-sm-4 col-12' : 'col-lg-6 col-md-6 col-sm-6 col-12'
    }

    if(this.props.edit && this.props.readOnly){
      const isOtherRole = kp.future && kp.future.role && kp.future.role.value === "other"
      return isOtherRole ? 'col-lg-3 col-md- col-sm-3 col-12' : 'col-lg-4 col-md-4 col-sm-4 col-12'
    }

    if(this.props.comparisonView){
      const isOtherRole = kp && kp.role === "Other"
      return isOtherRole ? 'col-lg-3 col-md- col-sm-3 col-12' : 'col-lg-4 col-md-4 col-sm-4 col-12'
    }

  }

  formatKeyPersons = (keyPersons) => {
  
  if(this.props.comparisonView){
    return keyPersons.map((keyperson, index)=>{
      const roleValue = keyperson.role && keyperson.role.toLowerCase() === 'other'?
       keyperson.otherRole : keyperson.role;
      return {
      id:index,
      name: keyperson.name,
      role: roleValue,
      dateAdded: getDateString(keyperson.updatedDate, 'mmddyyyy'),}
    })
  }  
  return keyPersons.map((kp,index) => {
    
    const roleValue =
      kp.future && kp.future.role && kp.future.role.value.toLowerCase() === 'other'
        ? kp.future && kp.future.otherRole
        : kp.future && kp.future.role && kp.future.role.label;
 
    return {
      id:index,
      name: kp.future && kp.future.name && kp.future.name.value,
      role: roleValue,
      dateAdded: getDateString(kp.future && kp.future.updatedDate, 'mmddyyyy'),
    };
  });
}

normalize = (kp) => {
  if (!kp) {
    return { name: null, role: null, otherRole: "" };
  }

  return {
    name: kp.name && kp.name.value ? kp.name.value : null,
    role: kp.role && kp.role.value ? kp.role.value : null,
    otherRole: kp.otherRole ? kp.otherRole : ""
  };
};

isSameKeyPerson = (kp) => {
  if (!kp || !kp.current || !kp.future) return true;

  const current = this.normalize(kp.current);
  const future = this.normalize(kp.future);

  return (
    current.name === future.name &&
    current.role === future.role &&
    current.otherRole === future.otherRole
  );
};

isCurrentAndFuctureSame = (arr) => {
  if (!arr || arr.length === 0) return true;

  for (let i = 0; i < arr.length; i++) {
    if (!this.isSameKeyPerson(arr[i])) {
      return false;
    }
  }

  return true;
};

  render() {    
    let {
      keyPersons = [],
      current = []
    } = this.props;
    const showTable = this.isCurrentAndFuctureSame(this.props.current);
    return (
      h(Fragment, {}, [
        div({ className: "row" }, [
          div({ className: "col-lg-11 col-md-10 col-sm-10 col-9" }, [
          ]),
          div({ className: "col-lg-1 col-md-2 col-sm-2 col-3 floatRight" }, [
            Btn({
              action: { labelClass: "glyphicon glyphicon-plus", handler: this.addKeyPersonnel },
              disabled: false,
              isRendered: !this.props.readOnly,
            }),
          ])
        ]),

        hr({ className: "fullWidth" }),
        keyPersons.map((kp, idx) => {
          const isOther = this.props.edit 
            ? (kp.future.role && kp.future.role.value === "other")
            : (kp.role && kp.role.value === "other");
          const kpState = this.state.keyPersons[idx];
          const isOtherRole =
            kpState &&
            kpState.role &&
            kpState.role.value === 'other'
          const colClass = this.handleKeypersonFieldAlignment(isOtherRole, kp)
          return h(Fragment, { key: this.ensureUiKey(kp) }, [
            div({ className: "row", style: { 'marginBottom': '15px' }, 
              isRendered: !((this.props.readOnly === true && this.props.edit === true && showTable) || this.props.comparisonView) 
            }, [
              div({ className: "col-lg-11 col-md-10 col-sm-10 col-9" }, [
                div({ className: "row" }, [
                  div({ className: colClass }, [
                    AsyncMultiSelect({
                      id: idx + "-name",
                      index: idx,
                      label:'Name',
                      isDisabled: kp && kp.future && kp.future.role && kp.future.role.value === 'legacy',
                      loadOptions: this.loadUsersOptions,
                      handleChange: this.handleNameChange(idx),
                      value: this.props.edit ? kp.future.name : kp.name,
                      currentValue: this.props.edit ? (current[idx] && current[idx].current ? current[idx].current.name : null) : null,
                      placeholder: "Start typing the Name",
                      isMulti: false,
                      error: this.getNameError(idx),
                      readOnly: this.props.readOnly,
                      showCurrentValueOnEdit: this.props.edit ? true : false
                    })
                  ]),
                  div({ className: colClass }, [
                    InputFieldSelect({
                      label: "",
                      id: idx + "-role",
                      index: idx,
                      name: "role",
                      label:'Role',
                      options: roleOptions,
                      value: this.props.edit ? kp.future.role : kp.role,
                      currentValue: this.props.edit ? current[idx] && current[idx].current.role : kp.role,
                      onChange: this.handleRoleSelect,
                      error: this.getRoleError(idx),
                      errorMessage: this.props.errorMessage,
                      readOnly: this.props.readOnly || !!(kp && kp.future && kp.future.role && kp.future.role.value === 'legacy'),
                      edited: this.props.readOnly,
                      edit: this.props.edit,
                      placeholder: "Choose a role..."
                    })
                  ]),
                  div({ className: colClass,
                     isRendered: !!((this.state.keyPersons[idx] && this.state.keyPersons[idx].role && this.state.keyPersons[idx].role.value === 'other')|| 
                     (kp.future && kp.future.role && kp.future.role.value === "other") || (kp.role === "Other"))}, 
                     [
                    InputFieldText({
                      isRendered: !!((this.state.keyPersons[idx] && this.state.keyPersons[idx].role && this.state.keyPersons[idx].role.value === 'other')|| (kp.future && kp.future.role && kp.future.role.value === "other") || (kp.role === "Other")),
                      id: idx + "-otherRole",
                      index: idx,
                      name: "otherRole",
                      label: "Role (Other)",
                      value: this.props.edit ? kp.future.otherRole : kp.otherRole,
                      currentValue: this.props.edit ? current[idx] && current[idx].current.otherRole : kp.otherRole,
                      required: false,
                      onChange: this.handleKeyPersonnelChange,
                      readOnly: this.props.readOnly,
                      edit: this.props.edit,
                      error: isOther && this.getRoleOtherError(idx),
                      errorMessage: this.props.errorMessage
                    })
                  ]),
                  div({classNames:colClass,
                    isRendered: this.props.readOnly && !!(kp.future && kp.future.updatedDate|| this.props.comparisonView) },[
                    div({style:{display:"inline-block", "padding-left":"5px"}},[
                      label({className: 'inputFieldLabel'}, ["Added Date"]),
                      // p({style:{margin:'10px 0 0 0'}},[this.props.edit || this.props.readOnly ? getDateString(kp.future.updatedDate,'mmddyyyy') : getDateString(kp.updatedDate,'mmddyyyy')])
                      p({ style: { margin: '10px 0 0 0' } }, [(this.props.readOnly && this.props.comparisonView)
                        ? getDateString(kp.updatedDate, 'mmddyyyy')
                        : (this.props.edit || this.props.readOnly)
                          ? getDateString(kp.future.updatedDate, 'mmddyyyy')
                          : getDateString(kp.updatedDate, 'mmddyyyy')])
                    ])
                  ]),
                ])
              ]),
              div({ className: "col-lg-1 col-md-2 col-sm-2 col-3", style:{padding:'30px 0 0 5px'} }, [
                Btn({
                  action: { labelClass: "glyphicon glyphicon-remove", handler: (e) => this.removeKeyPersonnel(idx) },
                  disabled: keyPersons.length === 1 || kp && kp.future && kp.future.role && kp.future.role.value === 'legacy',
                  isRendered: !this.props.readOnly
                }),
              ])
            ]),
          ],);
        }),
        h(Fragment, {}, [
                TableComponent({             
                  isRendered: ((this.props.readOnly === true && this.props.edit === true && showTable)|| this.props.comparisonView),
                  data: this.props.readOnly ? this.formatKeyPersons(this.props.keyPersons) : [], 
                  columns: columns,
                  keyField: 'dateAdded',              
                  fileName: 'ORSP'              
                })
              ])
      ])
    )
  }
});
