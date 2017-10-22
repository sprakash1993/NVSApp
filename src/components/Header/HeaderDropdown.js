import React, {Component} from 'react';
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  NavDropdown
} from 'reactstrap';

class HeaderDropdown extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  dropAccnt() {
    return (
      <NavDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav caret={this.state.caretVisible}>
          <img src={'img/avatars/Prakash.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com"/>
          <span className="d-md-down-none">Prakash</span>
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
          <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
          <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
          <DropdownItem divider/>
          <DropdownItem><i className="fa fa-lock"></i> Logout</DropdownItem>
        </DropdownMenu>
      </NavDropdown>
    );
  }

  render() {
    const {...attributes} = this.props;
    return (
      this.dropAccnt()
    );
  }
}

export default HeaderDropdown;
