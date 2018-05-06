import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {
  Container,
  Menu,
  Dropdown,
  Image,
  Button,
  Input,
  Icon
} from 'semantic-ui-react'
import './Header.scss';

import SquareImage from '../../components/SquareImage';

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
      <div className="nav-wrapper">
        <Container className='nav-container'>
          <Menu secondary inverted>
            <Menu.Item as={Link} to='/' className='logo'>
              <Image src={logo} alt='PetGlobe' />
            </Menu.Item>
            <Menu.Item>
              <Input iconPosition='left' placeholder='Search...' action>
                <input />
                <Icon name='search' />
                <Button icon='search' secondary />
              </Input>
            </Menu.Item>

            {/*
          <Menu.Item>
            <Input type='text' placeholder='Search...' action>
              <input />
              <Button type='submit' icon='search' />
            </Input>
          </Menu.Item>
*/}

            <Menu.Menu position='right'>
              {/*<Dropdown item text='Browse Services'>*/}
              {/*<Dropdown.Menu>*/}
              {/*{this.services.map(service => (*/}
              {/*<Dropdown.Item key={service.path} as={Link} to={service.path} icon={service.icon} text={service.name} />*/}
              {/*))}*/}
              {/*</Dropdown.Menu>*/}
              {/*</Dropdown>*/}
              {!currentUser
                ? (
                  <Menu.Menu position='right'>
                    <Menu.Item fitted><Button as={Link} to='/login' icon='sign in' content='Login' className='login-button' /></Menu.Item>
                    <Menu.Item fitted><Button as={Link} to='/signup' icon='signup' content='Sign Up' primary className='signup-button' /></Menu.Item>
                  </Menu.Menu>
                )
                : (
                  <Menu.Menu position='right'>
                    <Dropdown
                      item
                      trigger={(
                        <span>
                        <SquareImage src={currentUser.profilePicture || defaultProfilePicture} style={{ width: '32px', height: '32px', border: 'none' }} />
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
      </div>
    );
  }

}

export default withRouter(withAuth(Nav));