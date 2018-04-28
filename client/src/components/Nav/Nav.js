import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {
  Container,
  Menu,
  Dropdown,
  Image,
  Button
} from 'semantic-ui-react'
import './Nav.css';

import logo from '../../images/logo.svg';
import defaultProfilePicture from '../../images/profile_default.png';

import APIService from '../../services/APIService';
import { withAuth } from '../../helpers/withAuth';

class Nav extends Component {

  constructor(props) {
    super(props);

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
  }

  logout() {
    APIService.shared().logout()
      .then(() => this.props.history.push('/'));
  }

  render() {
    const { currentUser } = this.props;

    return (
      <Container className='nav-container'>
        <Menu secondary>
          <Menu.Item as={Link} to='/'>
            <Image src={logo} alt='PetGlobe' />
          </Menu.Item>
          <Menu.Item as={Link} to='/search' content='Search' />

{/*
          <Menu.Item>
            <Input type='text' placeholder='Search...' action>
              <input />
              <Button type='submit' icon='search' />
            </Input>
          </Menu.Item>
*/}

          <Menu.Menu position='right'>
            <Menu.Item as={Link} to='/businesses/register' content='Register a Business' />
            <Dropdown item text='Browse Services'>
              <Dropdown.Menu>
                {this.services.map(service => (
                  <Dropdown.Item key={service.path} as={Link} to={service.path} icon={service.icon} text={service.name} />
                ))}
              </Dropdown.Menu>
            </Dropdown>
            {!currentUser
              ? (
                <Menu.Menu position='right'>
                  <Menu.Item fitted><Button as={Link} to='/login' icon='sign in' content='Login' /></Menu.Item>
                  <Menu.Item fitted><Button as={Link} to='/signup' icon='signup' content='Sign Up' primary /></Menu.Item>
                </Menu.Menu>
              )
              : (
                <Menu.Menu position='right'>
                  <Dropdown
                    item
                    trigger={(
                      <span>
                        <Image avatar src={currentUser.profilePicture || defaultProfilePicture} /> {currentUser.firstName + ' ' + currentUser.lastName}
                      </span>
                    )}>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to={'/profile/' + currentUser.username} icon='user' text='Profile' />
                      <Dropdown.Item as={Link} to='/businesses' icon='building' text='Businesses' />
                      <Dropdown.Divider />
                      <Dropdown.Item as={Link} to='/settings' icon='setting' text='Settings' />
                      <Dropdown.Item onClick={this.logout} icon='sign out' text='Logout' />
                    </Dropdown.Menu>
                  </Dropdown>
                </Menu.Menu>
              )
            }
          </Menu.Menu>
        </Menu>
      </Container>
    );
  }

}

export default withRouter(withAuth(Nav));