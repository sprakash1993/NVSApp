import React, {Component} from 'react';
import {InputGroupAddon, FormGroup, Input, InputGroup, Button, ButtonGroup} from 'reactstrap';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';


class FilterComponent extends Component {
  constructor(props){
    super(props);
    this.state = this.initializeState();
  }

  handleColumnChange(newValue) {
    let col = newValue;
    let tableObj = this.props.tableObj;
    let dataType = '';
    if (tableObj && col!= 'select') {
      dataType = tableObj.schemaSpec.columns.find(obj => obj.name == col).sqlType;
    }
    const isNumeric = dataType.startsWith('int') || dataType.startsWith('double') || dataType.startsWith('float');
    const isDate = dataType == 'date';

    this.setState({
      selectValue: newValue,
      dataType,
      isDate,
      isNumeric
    });
    this.props.isFilterableField(isDate|| isNumeric);
    this.props.setParentField('filterColumn', newValue);
  }

  initializeState() {
    let columns = this.props.tableObj.schemaSpec.columns
      .filter(function(obj) { return obj.sqlType == 'date' || obj.type[0] == 'Integer';})
      .map(obj => obj.name);
    return {
      columns: columns,
      isDate: false,
      isNumeric:false,
      rtl: false,
      selectValue: ''
    };
  }

  onChangeMaxDate(event) {
    console.log(event.target.value);
    this.props.setParentField('dateMax', event.target.value);
  }

  onChangeMinDate(event) {
    console.log(event.target.name);
    this.props.setParentField('dateMin', event.target.value);
  }

  onChangeMaxVal(event) {
    console.log(event.target.value);
    this.props.setParentField('numberMax', event.target.value);
  }

  onChangeMinVal(event) {
    console.log(event.target.value);
    this.props.setParentField('numberMin', event.target.value);
  }

  render() {
    let space = '  ';
    return (
      <FormGroup>
        <InputGroup className="mb-3">
          <div style={{width: '65%'}} >
            <Select
              id="columnsFilter"
              name="columnsFilter"
              clearable={false}
              options={this.state.columns.map(function(column) { return {value: column, label: column}; })}
              onChange={this.handleColumnChange.bind(this)}
              value={this.state.selectValue}
              placeholder="Select column"
              simpleValue
              autoFocus
              rtl={this.state.rtl}
              menuContainerStyle={{'zIndex': 999}}
            />
          </div>
          <InputGroupAddon id="dataType" style={{width: '35%'}}>{this.state.dataType || 'Data Type'}</InputGroupAddon>
        </InputGroup>
        <InputGroup className="mb-3" hidden={!this.state.isDate}>
          <Input id="minDate" name="minDate" type="date" onChange={this.onChangeMinDate.bind(this)}/>
          <InputGroupAddon id="minDateLabel" style={{width: '20%'}}>Min Date</InputGroupAddon>
          <Input id="maxDate" name="maxDate" type="date" onChange={this.onChangeMaxDate.bind(this)}/>
          <InputGroupAddon id="maxDateLabel" style={{width: '20%'}}>Max Date</InputGroupAddon>
        </InputGroup>
        <InputGroup className="mb-3" hidden={!this.state.isNumeric} >
          <Input id="minVal" name="minVal" type="number" onChange={this.onChangeMinVal.bind(this)}/>
          <InputGroupAddon id="minDateLabel" style={{width: '20%'}}>Min Value</InputGroupAddon>
          <Input id="maxVal" name="maxVal" type="number" onChange={this.onChangeMaxVal.bind(this)}/>
          <InputGroupAddon id="maxDateLabel" style={{width: '20%'}}>Max Value</InputGroupAddon>
        </InputGroup>
      </FormGroup>
    );
  }
}

FilterComponent.propTypes = {
  tableObj: PropTypes.object,
  columns: PropTypes.array,
  dataType: PropTypes.string,
  isFilterableField: PropTypes.function,
  setParentField: PropTypes.function
};

export default FilterComponent;
