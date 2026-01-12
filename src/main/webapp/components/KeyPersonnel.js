import { Component, Fragment } from 'react'
import { input, hh, h, div, p, hr, small, label } from 'react-hyperscript-helpers';
import { InputFieldText } from './InputFieldText';
import { InputFieldSelect } from './InputFieldSelect';
import { Btn } from './Btn';
import { AsyncMultiSelect } from './AsyncMultiSelect';
import { Search } from '../util/ajax';

const roleOptions = [
  { value: 'co_investigaator', label: 'Co-Investigator' },
  { value: 'project_manager', label: 'Project/Account Manager' },
  { value: 'coordinator', label: 'Coordinator' },
  { value: 'post_doc', label: 'Post-Doc' },
  { value: 'data_manager', label: 'Data Analyst/Manager' },
  { value: 'lab_tech', label: 'Lab Tech' },  
  { value: 'other', label: 'Other' }  ]

export const KeyPersonnel = hh(class KeyPersonnel extends Component {
    constructor(props) {
        super(props);
        this.loadUsersOptions = this.loadUsersOptions.bind(this);
        this.state = {
            future: [],
            fundings: [],
            formData: {        
        role: '',
        roleOther: '',
      //  name: '',
        name: [],        
      }
        };
    }
    
  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
    handleInputChange = (e) => { console.log(e,'value input');
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    });
  };

    addKeyPersonnel = () => {

    }
    handleRoleSelect = (field) => () => (selectedOption) => {
    this.setState(prev => {
        prev.formData[field] = selectedOption;
        return prev;
      }
    )
    }
    handleFundingChange =(e) => { 
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    });
  };
  loadUsersOptions(query, callback) {
      if (query.length > 2) {
        Search.getMatchingQuery(query).then(response => {
          if (this._isMounted) {console.log(query,'Dropdown data in load 1');
            let options = response.data.map(function (item) {
              return {
                key: item.id,
                value: item.value,
                label: item.label
              };
            });console.log(options,'Dropdown data in load');
            callback(options);
          }
        }).catch(error => {
          this.setState(() => { throw error; });
        });
      }
    };
    handlePMChange = (data, action) => {
    if (data !== null && !Array.isArray(data)) {
      data = [data];
    }
    this.setState(prev => {console.log(data,'Dropdown data');
      prev.formData.name = data;
      return prev;
    }
    );
    };
    removeKeyPersonnel = () => {

    }

    render() {
      const isOther =
      this.state.formData.role &&
      this.state.formData.role.value === "other";
        let {
            keyPersonnel = [],
            current = []
        } = this.props;
        return (
            h(Fragment, {}, [
                div({ className: "row" }, [
                    div({ className: "col-lg-11 col-md-10 col-sm-10 col-9" }, [
                        div({ className: "row " }, [                            
                            div({ className: isOther
      ? "col-lg-4 col-md-4 col-sm-4 col-12"
      : "col-lg-6 col-md-6 col-sm-6 col-12" }, [
                                label({ className: "inputFieldLabel noMargin" }, ["Name"])
                            ]),
                            div({ className: isOther
      ? "col-lg-4 col-md-4 col-sm-4 col-12"
      : "col-lg-6 col-md-6 col-sm-6 col-12" }, [
                                label({ className: "inputFieldLabel noMargin" }, ["Role"])
                            ]),isOther &&
                             div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                                 label({ className: "inputFieldLabel noMargin" }, ["Role(Other)"])
                             ])
                        ])
                    ]),
                    div({ className: "col-lg-1 col-md-2 col-sm-2 col-3" }, [
                        Btn({
                            action: { labelClass: "glyphicon glyphicon-plus", handler: this.addKeyPersonnel },
                            disabled: false,
                            isRendered: true
                        }),
                    ])
                ]),
                hr({ className: "fullWidth" }),
              //  keyPersonnel.map((keyPersonnel, index) => {
               //     return h(Fragment, { key: idx }, [
                        div({ className: "row", style: { 'marginBottom': '15px' } }, [
                            div({ className: "col-lg-11 col-md-10 col-sm-10 col-9" }, [
                                div({ className: "row" }, [
                                  div({ className: isOther
      ? "col-lg-4 col-md-4 col-sm-4 col-12"
      : "col-lg-6 col-md-6 col-sm-6 col-12" }, [
                                        AsyncMultiSelect({
                                                id: 1 + "-name",
                                                index: 1,
                                                isDisabled: false,
                                                loadOptions: this.loadUsersOptions,
                                                handleChange: this.handlePMChange,
                                                value: this.state.formData.name,
                                                placeholder: "Start typing the Name",
                                                isMulti: false
                                            //    error: this.props.errors.KeyStudyContact
                                              }),
                                    //      InputFieldText({
                                    //         id: 1 + "-name",
                                    //          index: 1,
                                    //         name: "name",                                            
                                    //    //      error: this.getSponsorError(rd),
                                    //     //     errorMessage: this.props.errorMessage,
                                    //          value: this.state.formData.name,
                                    //      //    currentValue: this.props.edit ? current[idx].current.sponsor : rd.sponsor,
                                    //        loadOptions: this.loadUsersOptions,
                                    //        handleChange: this.handlePMChange, 
                                    //        disabled: false,
                                    //         required: false,
                                    //         onChange: this.handleFundingChange
                                    //     //     readOnly: this.props.readOnly
                                    //      })
                                     ]),
                                    div({ className: isOther
      ? "col-lg-4 col-md-4 col-sm-4 col-12"
      : "col-lg-6 col-md-6 col-sm-6 col-12" }, [
                                        InputFieldSelect({
                                            label: "",
                                            id: 1 + "-role",
                                            index: 1,
                                            name: "role",
                                            options: roleOptions,
                                            value: this.state.formData.role,                                            
                                       //     currentValue: this.props.edit ? current[idx].current.source : rd.source,
                                            onChange: this.handleRoleSelect("role"),
                                            placeholder: "Choose a role...",
                                            readOnly: false,
                                        //    error: this.getSourceError(idx),
                                        //    errorMessage: this.props.errorMessage,
                                        //    readOnly: this.props.readOnly,
                                        //    edited: this.props.readOnly,
                                        //    edit: this.props.edit
                                        })
                                    ]),                                    
                                    isOther &&                                     
                                     div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                                     InputFieldText({
                                    //    isRendered: this.state.formData.role.value === "other",
                                        id: "roleOther",
                                        name: "roleOther",
                                    //    label: "Primary Investigator Other Affiliation ",
                                        value: this.state.formData.roleOther,
                                        disabled: false,
                                        required: false,
                                        onChange: this.handleInputChange,
                                        edit: false
                                    })
                                    ]),
                                    
                                     //small({ isRendered: this.props.errors.KeyStudyContact, className: "errorMessage" }, ['Required field']),         
                                    // div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                                    //     InputFieldText({
                                    //         id: idx + "-identifier",
                                    //         index: idx,
                                    //         name: "identifier",
                                    //         label: "",
                                    //         error: this.props.readOnly ? false : this.getIdentifierError(rd),
                                    //         errorMessage: this.props.errorMessage,
                                    //         value: this.props.edit ? rd.future.identifier : rd.identifier,
                                    //         currentValue: this.props.edit ? current[idx].current.identifier : rd.identifier,
                                    //         disabled: false,
                                    //         required: false,
                                    //         onChange: this.handleFundingChange,
                                    //         readOnly: this.props.readOnly
                                    //     })
                                    // ])
                                ])
                            ]),
                            // div({ className: "col-lg-1 col-md-2 col-sm-2 col-3", style: { "paddingTop": "12px" } }, [
                            //     Btn({
                            //         action: { labelClass: "glyphicon glyphicon-remove", handler: (e) => this.removeFundings(idx) },
                            //         disabled: fundings.length === 1,
                            //         isRendered: !this.props.readOnly
                            //     }),
                            // ])
                        ]),
              //      ]);
              //  })
            ])
        )
    }
});
