import _ from 'lodash';
import React, { Component } from 'react';
import {
  Container,
  Form,
  Button,
  Header,
  Grid,
  Input,
  Divider,
  Message,
  Segment,
  Dropdown,
  TextArea
} from 'semantic-ui-react';
import './Settings.css';

import { AsYouType } from 'libphonenumber-js';

import defaultProfilePicture from '../../images/profile_default.png';

import SpacedSegment from '../../components/SpacedSegment';
import SquareImage from '../../components/SquareImage';
import ErrorMessage from '../../components/ErrorMessage';

import { withAuth } from '../../helpers/withAuth';
import APIService from "../../services/APIService";

import states from '../../helpers/states';

class Settings extends Component {

  constructor(props) {
    super(props);

    this.states = _.map(Object.keys(states), state => ({ key: state, value: state, text: state }));

    this.updateState = this.updateState.bind(this);

    this.handleFileChange = this.handleFileChange.bind(this);

    this.handleChange = this.handleChange.bind(this);

    this.handleProfilePictureSubmit = this.handleProfilePictureSubmit.bind(this);
    this.handleBasicSubmit = this.handleBasicSubmit.bind(this);
    this.handleAccountSubmit = this.handleAccountSubmit.bind(this);
    this.handleAddressSubmit = this.handleAddressSubmit.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);

    this.deleteAccount = this.deleteAccount.bind(this);

    this.state = {
      username: '',
      email: '',
      phoneNumber: '',
      firstName: '',
      lastName: '',
      bio: '',
      newPassword: '',
      newPasswordConfirmation: '',
      oldPassword: '',
      isUpdatingProfilePicture: false,
      isUpdatingBasicInfo: false,
      isUpdatingAccount: false,
      isUpdatingAddress: false,
      isUpdatingPassword: false,
      isDeletingAccount: false,
      error: null,
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: ''
    };
  }

  componentWillMount() {
    if (this.props.isLoggedIn)
      this.updateState(this.props.currentUser);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isLoggedIn)
      this.updateState(newProps.currentUser);
  }

  updateState(currentUser) {
    this.setState({
      profilePicture: null,
      username: currentUser.username,
      email: currentUser.email,
      phoneNumber: currentUser.phoneNumber ? new AsYouType('US').input(currentUser.phoneNumber) : '',
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      bio: currentUser.bio,
      address1: currentUser.address.address1,
      address2: currentUser.address.address2 || '',
      city: currentUser.address.city,
      state: currentUser.address.state,
      zipCode: currentUser.address.zipCode
    });
  }

  handleFileChange(e) {
    const files = e.target.files || e.dataTransfer.files;
    if (!files.length) {
      this.setState({
        profilePicture: null
      });
    } else {
      this.setState({
        profilePicture: files[0]
      });
    }
  }

  handleChange(e, { name, value }) {
    if (name === 'phoneNumber') {
      // format old input
      const oldFormatter = new AsYouType('US');
      const oldFormatted = oldFormatter.input(this.state.phoneNumber);
      // check if new value is one less than the old value (meaning user pressed backspace key)
      if (value.length === oldFormatted.length - 1) {
        // delete a number
        const oldNationalNumber = oldFormatter.getNationalNumber();
        this.setState({
          phoneNumber: new AsYouType('US').input(oldNationalNumber.slice(0, oldNationalNumber.length - 1))
        });
      } else {
        this.setState({
          phoneNumber: new AsYouType('US').input(value)
        });
      }
    } else {
      this.setState({
        [name]: value
      });
    }
  }

  handleProfilePictureSubmit(e) {
    e.preventDefault();

    this.setState({
      isUpdatingProfilePicture: true
    });

    APIService.shared().uploadProfilePicture(this.state.profilePicture)
      .then(response => {
        this.updateState(response);
        this.setState({
          isUpdatingProfilePicture: false,
          error: null
        });
      })
      .catch(err => {
        this.setState({
          isUpdatingProfilePicture: false,
          error: {
            title: 'An unknown error occurred'
          }
        });
      });
  }

  handleBasicSubmit(e) {
    e.preventDefault();

    this.setState({
      isUpdatingBasicInfo: true
    });

    APIService.shared().updateAccount({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      bio: this.state.bio
    }, {
      firstName: true,
      lastName: true,
      bio: true
    })
      .then(response => {
        this.updateState(response);
        this.setState({
          isUpdatingBasicInfo: false,
          error: null
        });
      })
      .catch(err => {
        this.setState({
          isUpdatingBasicInfo: false,
          error: {
            title: 'An unknown error occurred'
          }
        });
      });
  }

  handleAccountSubmit(e) {
    e.preventDefault();

    this.setState({
      isUpdatingAccount: true
    });

    APIService.shared().updateAccount({
      username: this.state.username,
      email: this.state.email,
      phoneNumber: this.state.phoneNumber
    }, {
      username: true,
      email: true,
      phoneNumber: true
    })
      .then(response => {
        this.updateState(response);
        this.setState({
          isUpdatingAccount: false,
          error: null
        });
      })
      .catch(err => {
        this.setState({
          isUpdatingAccount: false,
          error: {
            title: 'An unknown error occurred'
          }
        });
      });
  }

  handleAddressSubmit(e) {
    e.preventDefault();

    this.setState({
      isUpdatingAddress: true
    });

    APIService.shared().updateAccount({
      address1: this.state.address1,
      address2: this.state.address2,
      city: this.state.city,
      state: this.state.state,
      zipCode: this.state.zipCode
    }, {
      address1: true,
      address2: true,
      city: true,
      state: true,
      zipCode: true
    })
      .then(response => {
        this.updateState(response);
        this.setState({
          isUpdatingAddress: false,
          error: null
        });
      })
      .catch(err => {
        this.setState({
          isUpdatingAddress: false,
          error: {
            title: 'An unknown error occurred'
          }
        });
      });
  }

  handlePasswordSubmit(e) {
    e.preventDefault();

    this.setState({
      isUpdatingPassword: true
    });

    APIService.shared().updatePassword(this.state.newPassword, this.state.oldPassword)
      .then(response => {
        this.updateState(response);
        this.setState({
          isUpdatingPassword: false,
          oldPassword: '',
          newPassword: '',
          newPasswordConfirmation: '',
          error: null
        });
      })
      .catch(err => {
        this.setState({
          isUpdatingPassword: false,
          oldPassword: '',
          newPassword: '',
          newPasswordConfirmation: '',
          error: {
            title: 'An unknown error occurred'
          }
        });
      });
  }

  deleteAccount(e) {
    e.preventDefault();

    this.setState({
      isDeletingAccount: true
    });

    APIService.shared().deleteAccount()
      .then(response => {
        this.props.history.push('/');
      })
      .catch(err => {
        this.setState({
          isDeletingAccount: false,
          error: {
            title: 'An unknown error occurred'
          }
        });
      });
  }

  render() {
    const { error, username, email, phoneNumber, firstName, lastName, address1, address2, city, state, zipCode, bio,
      oldPassword, newPassword, newPasswordConfirmation, isUpdatingProfilePicture, isUpdatingAccount, isUpdatingBasicInfo,
      isUpdatingAddress, isUpdatingPassword, isDeletingAccount } = this.state;
    const { currentUser } = this.props;

    return (
      <Container className='settings-container'>
        <Grid centered>
          <Grid.Row>
            <Grid.Column largeScreen={12} computer={14} tablet={16}>
              <Header className='settings-header' size='huge' textAlign='center'>Settings</Header>

              {error && <ErrorMessage title={error.title} message={error.message} />}

              <Message
                attached
                header='Profile Picture' />

              <Segment as={Form} attached onSubmit={this.handleProfilePictureSubmit} loading={isUpdatingProfilePicture}>

                <Form.Group>

                  <Form.Field width={4}>
                    {!!currentUser && <SquareImage src={currentUser.profilePicture || defaultProfilePicture} />}
                  </Form.Field>

                  <Form.Field width={12}>
                    <SpacedSegment spacing={3}><Input type='file' name='profilePicture' onChange={this.handleFileChange} /></SpacedSegment>
                    <Button type='submit' content='Update Picture' primary floated='right' />
                  </Form.Field>

                </Form.Group>

              </Segment>

              <Divider hidden />

              <Message
                attached
                header='Basic Information' />

              <Form className='attached fluid segment' onSubmit={this.handleBasicSubmit} loading={isUpdatingBasicInfo}>
                <Form.Group widths='equal'>
                  <Form.Field>
                    <label>First Name</label>
                    <Input type='text' name='firstName' value={firstName} onChange={this.handleChange} />
                  </Form.Field>
                  <Form.Field>
                    <label>Last Name</label>
                    <Input type='text' name='lastName' value={lastName} onChange={this.handleChange} />
                  </Form.Field>
                </Form.Group>
                <Form.Field>
                  <label>Bio</label>
                  <TextArea name='bio' value={bio} onChange={this.handleChange} style={{ minHeight: 100 }} />
                </Form.Field>
                <br />
                <Button type='submit' primary fluid size='large'>Update</Button>
              </Form>

              <Divider hidden />

              <Message
                attached
                header='Account Settings' />

              <Form className='attached fluid segment' onSubmit={this.handleAccountSubmit} loading={isUpdatingAccount}>
                <Form.Field>
                  <label>Username</label>
                  <Input type='text' name='username' value={username} onChange={this.handleChange} />
                </Form.Field>
                <Form.Field>
                  <label>Email</label>
                  <Input type='email' name='email' value={email} onChange={this.handleChange} />
                </Form.Field>
                <Form.Field>
                  <label>Phone Number</label>
                  <Input type='text' name='phoneNumber' value={phoneNumber} placeholder='+1 (555) 444-3333' onChange={this.handleChange} />
                </Form.Field>
                <br />
                <Button type='submit' primary fluid size='large'>Update</Button>
              </Form>

              <Divider hidden />

              <Message
                attached
                header='Address' />

              <Form className='attached fluid segment' onSubmit={this.handleAddressSubmit} loading={isUpdatingAddress}>
                <Form.Field>
                  <label>Address</label>
                  <Input type='text' name='address1' value={address1} placeholder='Address line 1' onChange={this.handleChange} />
                </Form.Field>
                <Form.Field>
                  <Input type='text' name='address2' value={address2} placeholder='Address line 2' onChange={this.handleChange} />
                </Form.Field>
                <Form.Group widths='equal'>
                  <Form.Field>
                    <label>City</label>
                    <Input type='text' name='city' value={city} placeholder='City' onChange={this.handleChange} />
                  </Form.Field>
                  <Form.Field>
                    <label>State</label>
                    <Dropdown name='state' search selection value={state} options={this.states} onChange={this.handleChange} />
                  </Form.Field>
                  <Form.Field>
                    <label>Zip Code</label>
                    <Input type='text' name='zipCode' value={zipCode} placeholder='Zip code' onChange={this.handleChange} />
                  </Form.Field>
                </Form.Group>
                <br />
                <Button type='submit' primary fluid size='large'>Update</Button>
              </Form>

              <Divider hidden />

              <Message
                attached
                header='Update Password' />
              <Form className='attached fluid segment' onSubmit={this.handlePasswordSubmit} loading={isUpdatingPassword}>
                <Form.Field>
                  <label>New Password</label>
                  <Input type='password' name='newPassword' value={newPassword} placeholder='New Password' onChange={this.handleChange} />
                </Form.Field>
                <Form.Field>
                  <label>New Password Confirmation</label>
                  <Input type='password' name='newPasswordConfirmation' value={newPasswordConfirmation} placeholder='New Password Confirmation' onChange={this.handleChange} />
                </Form.Field>
                <Form.Field>
                  <label>Old Password</label>
                  <Input type='password' name='oldPassword' value={oldPassword} placeholder='Old Password' onChange={this.handleChange} />
                </Form.Field>
                <br />
                <Button type='submit' primary fluid size='large'>Update Password</Button>
              </Form>

              <Divider />

              <Button negative fluid className='settings-close-account' size='large' onClick={this.deleteAccount} loading={isDeletingAccount}>Close Account</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

}

export default withAuth(Settings);