import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import './Header.scss';

import Container from '../UI/Container/Container';
import Menu from '../UI/Menu/Menu';
import MenuItem from '../UI/Menu/Item/Item';
import MenuBar from '../UI/Menu/Bar/Bar';
import MenuSpacer from '../UI/Menu/Spacer/Spacer';
import Image from '../UI/Image/Image';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import Icon from '../UI/Icon/Icon';
import MenuDropdown from '../UI/Menu/Dropdown/Dropdown';
import MenuDropdownContent from '../UI/Menu/Dropdown/Content/Content';
import MenuDropdownItem from '../UI/Menu/Dropdown/Item/Item';
import Form from '../UI/Form/Form';

import logo from '../../images/logo.svg';
import defaultProfilePicture from '../../images/profile_default.png';

import APIService from '../../services/APIService';
import { withAuth } from '../../helpers/withAuth';

class Header extends Component {

  constructor(props) {
    super(props);

    this.handleChange= this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.logout = this.logout.bind(this);

    this.services = [
      { name: 'Retail', value: 'retail', path: '/services/retail', icon: 'shopping basket' },
      { name: 'Grooming', value: 'grooming', path: '/services/grooming', icon: 's15' },
      { name: 'Training', value: 'training', path: '/services/training', icon: 'star' },
      { name: 'Caretaker', value: 'caretaker', path: '/services/caretaker', icon: 'male' },
      { name: 'Hotels and Spas', value: 'hotels_and_spas', path: '/services/hotels_and_spas', icon: 'bar' },
      { name: 'Insurance', value: 'insurance', path: '/services/insurance', icon: 'money' },
      { name: 'Relocation', value: 'relocation', path: '/services/relocation', icon: 'truck' },
      { name: 'Veterinary', value: 'veterinary', path: '/services/veterinary', icon: 'doctor' },
      { name: 'Emergency', value: 'emergency', path: '/services/emergency', icon: 'hospital' },
    ];

    this.state = {
      query: ''
    };
  }

  handleChange(e, { name, value }) {
    this.setState({
      [name]: value
    });
  }

  handleSearch(e) {
    e.preventDefault();

    this.props.history.push({ pathname: '/search', search: 'query=' + this.state.query });
    window.location.reload();
  }

  logout() {
    APIService.shared().logout()
      .then(() => {
        this.props.history.push('/');
        window.location.reload();
      });
  }

  render() {
    const { isLoggedIn, currentUser } = this.props;

    return (
      <div className='header'>
        <div className='header__main-menu'>
          <Container>
            <Menu>
              <MenuBar expand>
                <MenuItem className='header__logo' linkTo='/' noHover padded>
                  <Image src={logo} />
                </MenuItem>
                <MenuItem expand className='header__search'>
                  <Form onSubmit={this.handleSearch}>
                    <Input type='text' icon='search' name='query' placeholder='Search for businesses...'
                         action={<Button type='button' secondary onClick={this.handleSearch}>Search</Button>} onChange={this.handleChange} />
                  </Form>
                </MenuItem>
              </MenuBar>

              {isLoggedIn ? (
                <MenuBar>
                  <MenuDropdown>
                    <Image src={currentUser.profilePicture || defaultProfilePicture} avatar /> {currentUser.firstName} {currentUser.lastName}
                    <MenuDropdownContent>
                      <MenuDropdownItem linkTo={'/profile/' + currentUser.username}>Profile</MenuDropdownItem>
                      <MenuDropdownItem linkTo='/settings'>Settings</MenuDropdownItem>
                      <MenuDropdownItem onClick={this.logout}>Logout</MenuDropdownItem>
                    </MenuDropdownContent>
                  </MenuDropdown>
                </MenuBar>
              ) : (
                <MenuBar>
                  <MenuItem linkTo='/login' noHover><Button icon='sign-in-alt'>Login</Button></MenuItem>
                  <MenuItem linkTo='/signup' noHover><Button icon='edit' primary>Sign Up</Button></MenuItem>
                </MenuBar>
              )}
            </Menu>
          </Container>
        </div>
        <div className='header__services-menu'>
          <Container>
            <Menu compact centered>
              <MenuBar className='header__services-menu__label'>
                <MenuItem light>Browse by Category:</MenuItem>
              </MenuBar>
              <MenuItem linkTo='/services/retail'><Icon name='shopping-basket' />&nbsp;&nbsp;Retail</MenuItem>
              <MenuItem linkTo='/services/grooming'><Icon name='shower' />&nbsp;&nbsp;Grooming</MenuItem>
              <MenuItem linkTo='/services/training'><Icon name='baseball-ball' />&nbsp;&nbsp;Training</MenuItem>
              <MenuItem linkTo='/services/insurance' className='header__services-menu__label'><Icon name='money-bill-alt' />&nbsp;&nbsp;Insurance</MenuItem>
              <MenuItem linkTo='/services/relocation'><Icon name='truck' />&nbsp;&nbsp;Relocation</MenuItem>
              <MenuItem linkTo='/services/veterinary'><Icon name='user-md' />&nbsp;&nbsp;Veterinary</MenuItem>
              <MenuItem linkTo='/services/emergency'><Icon name='hospital' />&nbsp;&nbsp;Emergency</MenuItem>
            </Menu>
          </Container>
        </div>
      </div>
    );
  }

}

export default withRouter(withAuth(Header));