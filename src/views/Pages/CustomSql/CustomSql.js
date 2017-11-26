import React, {Component} from 'react';
import {Container, Row, Col, CardGroup, Card, Table, CardBody, Button, Form, FormGroup, Label} from 'reactstrap';
import Select from 'react-select';
//import 'react-select/dist/react-select.css';
import squel from 'squel';
import {UnControlled as CodeMirror} from 'react-codemirror2';
require('codemirror/mode/xml/xml');
require('codemirror/mode/sql/sql');
require('codemirror/mode/javascript/javascript');
require('react-combo-select/style.css');
require('font-awesome/css/font-awesome.min.css');
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/base16-light.css';

import TableColumns from './tableschema.json';

import FilterComponent from '../../../components/FilterComponent/';

import * as api from '../../../api';

class CustomSql extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      tables: [],
      columns: [],
      tableObj: null,
      value: [],
      rtl: false,
      filterList: [],
      isFilterOpen: false,
      isFilterableField: false,
      filterColumn: null,
      dateMax: null,
      dateMin: null,
      numberMin: null,
      numberMax: null,
      filterConditions:[],
      sqlCode: squel.select().from('test').field('*').toString(),
      tableValue: ''
    };

    this.setFilterableField = this.setFilterableField.bind(this);
    this.setParentField = this.setParentField.bind(this);
    this.getTableList();
  }

  getTableList() {
    api.fetchTables().then(data => this.setState({
      tables: data.results.map(obj => obj.name)
    }));
  }

  onAddFilterBtnClick(event) {
    const filterList = this.state.filterList;
    this.setState({
      filterList: filterList.concat(<FilterComponent key={this.state.tableObj.name}
        dataType={this.state.dataType}
        columns={this.state.columns}
        isFilterableField = {this.setFilterableField}
        setParentField = {this.setParentField}
        tableObj={this.state.tableObj}/>),
      isFilterOpen: true,
      isFilterableField: false
    });
  }

  onCancelFilterClick(event) {
    let filterList = this.state.filterList;
    filterList.pop();
    this.setState({
      filterList: filterList,
      isFilterOpen: false,
      isFilterableField: false,
      filterColumn: null,
      dateMax: null,
      dateMin: null,
      numberMin: null,
      numberMax: null,
    });
  }

  setFilterableField(val) {
    this.setState({
      isFilterableField: val
    });
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  toggleRtl (e) {
    let rtl = e.target.checked;
    this.setState({ rtl });
  }

  handleTableChange(value) {
    let table = value;
    let cols = [];
    let tableObj;
    if (table !== 'select') {
      tableObj = TableColumns.results.find(obj => obj.name == table);
      if (tableObj) {
        cols = tableObj.schemaSpec.columns.map(obj => obj.name);
      }
    }
    if (cols.length > 0) {
      cols.unshift('All');
    }
    this.setState({
      columns: cols,
      tableObj: tableObj,
      filterConditions: [],
      tableValue: value
    });
  }

  logChange(value) {
    this.setState({
      value
    });
  }

  handleColumnChange(col) {
    let tableObj = this.state.tableObj;
    let dataType = '';
    if (tableObj) {
      dataType = tableObj.schemaSpec.columns.find(obj => obj.name == col).sqlType;
    }
    this.setState({
      dataType: dataType
    });
  }

  setParentField(field, value) {
    const obj = {};
    obj[field] = value;
    this.setState({
      [field]: value
    });
  }

  onSaveFilterBtnClick() {
    const filterColumn = this.state.filterColumn;

    if (filterColumn) {
      const dateMax = this.state.dateMax;
      const dateMin = this.state.dateMin;
      const numberMin = this.state.numberMin;
      const numberMax = this.state.numberMax;

      let filterConditions = this.state.filterConditions;
      if (dateMax) {
        filterConditions.push(filterColumn + ' < "' + dateMax + '"');
      }
      if (dateMin) {
        filterConditions.push(filterColumn + ' > "' + dateMin + '"');
      }
      if (numberMin) {
        filterConditions.push(filterColumn + ' > ' + numberMin);
      }
      if (numberMax) {
        filterConditions.push(filterColumn + ' < ' + numberMax);
      }

      this.setState({
        filterConditions,
        filterList: [],
        isFilterOpen: false,
        isFilterableField: false,
        filterColumn: null,
        dateMax: null,
        dateMin: null,
        numberMin: null,
        numberMax: null
      });
    }
    console.log(this.state.filterConditions);
  }

  onGenerateSQLClick() {
    const table = this.state.tableObj.name;
    let columns = this.state.value;
    const conditions = this.state.filterConditions;

    if(columns.includes('All')) {
      columns = '*';
    }

    const sql = squel.select()
      .field(columns)
      .from(table)
      .where(conditions.join(' AND '))
      .toString();
    console.log(sql);
    this.setState({
      sqlCode: sql
    });
  }

  deleteFilter(condition) {
    let filterConditions = this.state.filterConditions;

    this.setState({
      filterConditions: filterConditions.filter(obj => obj != condition)
    });
  }

  render() {
    return (
      <div>
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col md="7">
                <CardGroup className="mb-0">
                  <Card className="mx-4">
                    <CardBody className="p-4">
                      <h1 align="center">Add Custom SQL</h1>
                      <Form>
                        <FormGroup>
                          <Label for="tableNames" className="text-muted">Select a Table</Label>
                          <Select
                            id="tableNames"
                            name="tableNames"
                            clearable={false}
                            options={this.state.tables.map(function(table) { return {value: table, label: table}; })}
                            onChange={this.handleTableChange.bind(this)}
                            value={this.state.tableValue}
                            placeholder="Select column"
                            simpleValue
                            autoFocus
                            rtl={this.state.rtl}
                            menuContainerStyle={{'zIndex': 999}}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for="columnNames" className="text-muted">Select columns from table</Label>
                          <Select
                            name="columnNames"
                            closeOnSelect={true}
                            options={this.state.columns.map(function(column) { return {value: column, label: column}; })}
                            onChange={this.logChange.bind(this)}
                            multi={true}
                            removeSelected={true}
                            value={this.state.value}
                            placeholder="Select column(s)"
                            disabled={false}
                            simpleValue
                            menuContainerStyle={{'zIndex': 999}}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Button color="primary" disabled={this.state.isFilterOpen} onClick={this.onAddFilterBtnClick.bind(this)}>Add Filter</Button>
                        </FormGroup>
                        {this.state.filterList.map(function(input, index) {
                          return input;
                        })}
                        <FormGroup>
                          <Button color="secondary" hidden={!this.state.isFilterOpen} onClick={this.onCancelFilterClick.bind(this)}>Cancel</Button>{' '}
                          <Button color="primary" disabled={!this.state.isFilterableField} hidden={!this.state.isFilterOpen} onClick={this.onSaveFilterBtnClick.bind(this)}>Save</Button>
                        </FormGroup>
                        <FormGroup>
                          <Table size="sm">
                            <tbody>
                              {this.state.filterConditions.map(cond =>
                                <tr key={cond}>
                                  <td scope="row">{cond}</td>
                                  <td style={{textAlign: 'right'}}><Button size="sm" color="link" onClick={this.deleteFilter.bind(this, cond)}>x</Button></td>
                                </tr>
                              )}
                            </tbody>
                          </Table>

                        </FormGroup>
                        <FormGroup>
                          <Label for="queryField">SQL Query</Label>
                          <div>
                            <CodeMirror name="sqlQuery" value={this.state.sqlCode}
                              options={{code: '', lineNumbers: true, theme: 'base16-light', mode: 'text/x-sql', lineWrapping: true}}
                              autoFocus={true}
                              onChange={(editor, data, value) => {
                              }}/>
                          </div>
                        </FormGroup>
                        <FormGroup>
                          <Button color="primary" disabled={!this.state.tableObj || !(this.state.value.length > 0)}
                            onClick={this.onGenerateSQLClick.bind(this)}>Generate SQL</Button>
                        </FormGroup>
                      </Form>
                    </CardBody>
                  </Card>
                </CardGroup>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

CustomSql.propTypes = {

};

export default CustomSql;
