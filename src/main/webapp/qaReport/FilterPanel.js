import { Component } from 'react';
import { h, button, div, p } from 'react-hyperscript-helpers';
import { Panel } from "../components/Panel";
import { InputFieldDatePicker } from "../components/InputFieldDatePicker";
import Select from 'react-select';

const projectTypes = [
  { value: 'all', label: 'All' },
  { value: 'irb', label: 'IRB Project' },
  { value: 'ne', label: "'Not Engaged' Project" },
  { value: 'nhsr', label: 'NHSR Project' },
  { value: 'ex', label: 'Exempt Project' }
];

const selectWithLabels = {
  groupHeading: (provided, state) => ({
    color:'#666666',
    cursor:'default',
    display: 'block',
    fontWeight: '500',
    marginBottom: '7px',
    padding: '19px 12px 7px 12px',
    textTransform: 'uppercase',
    fontSize: '14px !important',
    borderBottom: '1px solid #DDDDDD',
  }),
};

class FilterPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
      div({
      },[
        Panel({ title: "Filter Projects" }, [
          div({className: "row"}, [
            div({className: "col-xs-12 col-sm-6"}, [
              InputFieldDatePicker({
                selected: this.props.afterDate,
                name: "afterDate",
                label: "Created After",
                onChange:  (e) => this.props.handleDatePicker(e, name),
                disabled: false
              })
            ]),
            div({className: "col-xs-12 col-sm-6"}, [
              InputFieldDatePicker({
                selected: this.props.beforeDate,
                name: "beforeDate",
                label: "Created Before",
                onChange: (e) => this.props.handleDatePicker(e, name),
                disabled: false
              })
            ])
          ]),
          p({ style: {color: '#286090', fontWeight: '700', fontSize: '1rem', marginBottom: '3px', marginTop: '20px'} }, [
            'Project Type'
          ]),
          h(Select, {
            name: 'projectType',
            value: this.props.projectType,
            className: "inputFieldSelect",
            onChange: this.props.handleSelectProjectType,
            options: projectTypes,
            isDisabled: false,
            isMulti: false,
            isClearable: false,
            isLoading: false,
            styles: selectWithLabels,
          }),
          button({
            className: "btn buttonPrimary",
            style: { marginTop: '20px', marginRight: '10px' },
            onClick: this.props.applyFilterPanel
          }, ['Filter']),
          button({
            className: "btn buttonSecondary",
            style: { marginTop: '20px' },
            onClick: this.props.clearFilterPanel
          }, ['Clear'])
        ])
      ])
    )
  }
}
export default FilterPanel;
