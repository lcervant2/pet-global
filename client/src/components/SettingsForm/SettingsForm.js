import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import './SettingsForm.scss';

import Panel from '../UI/Panel/Panel';
import PanelHeader from '../UI/Panel/Header/Header';
import Form from '../UI/Form/Form';
import FormField from '../UI/Form/Field/Field';
import FormGroup from '../UI/Form/Group/Group';
import FormSection from '../UI/Form/Section/Section';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import ImageInput from '../UI/Image/Input/Input';

import APIService from '../../services/APIService';

import { withAuth } from '../../helpers/withAuth';

import { AsYouType } from 'libphonenumber-js';

class SettingsForm extends Component {

  constructor(props) {
    super(props);

    this.updateState = this.updateState.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAccountSubmit = this.handleAccountSubmit.bind(this);
    this.handleAddressSubmit = this.handleAddressSubmit.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);

    this.state = {
      profilePicture: null,
      isUpdatingProfilePicture: false,
      username: '',
      email: '',
      phoneNumber: '',
      firstName: '',
      lastName: '',
      bio: '',
      isUpdatingAccount: false,
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      isUpdatingAddress: false,
      newPassword: '',
      newPasswordConfirmation: '',
      oldPassword: '',
      isUpdatingPassword: false,
      isDeletingAccount: false,
      error: null
    };
  }

  componentWillMount() {
    if (this.props.currentUser)
      this.updateState(this.props.currentUser);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.currentUser)
      this.updateState(newProps.currentUser);
  }

  updateState(user) {
    this.setState({
      profilePicture: user.profilePicture,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      address1: user.address.address1,
      address2: user.address.address2,
      city: user.address.city,
      state: user.address.state,
      zipCode: user.address.zipCode
    });
  }

  handleFileChange(name, image) {
    this.setState({
      isUpdatingProfilePicture: true
    });

    if (image) {
      APIService.shared().uploadProfilePicture(image.file)
        .then(response => {
          this.updateState(response);
          this.setState({
            isUpdatingProfilePicture: false
          });
        })
        .catch(error => {
          this.setState({
            isUpdatingProfilePicture: false,
            error: {
              title: 'An unknown error occurred',
              content: 'Please try again later'
            }
          });
        });
    } else {
      APIService.shared().deleteProfilePicture()
        .then(response => {
          this.updateState(response);
          this.setState({
            isUpdatingProfilePicture: false
          });
        })
        .catch(error => {
          this.setState({
            isUpdatingProfilePicture: false,
            error: {
              title: 'An unknown error occurred',
              content: 'Please try again later'
            }
          });
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

  handleAccountSubmit(e) {
    e.preventDefault();

    this.setState({
      isUpdatingAccount: true
    });

    APIService.shared().updateAccount({
      username: this.state.username,
      email: this.state.email,
      phoneNumber: this.state.phoneNumber,
      firstName: this.state.firstName,
      lastName: this.state.lastName
    }, {
      username: true,
      email: true,
      phoneNumber: true,
      firstName: true,
      lastName: true
    })
      .then(response => {
        this.updateState(response);
        this.setState({
          isUpdatingAccount: false,
          error: null
        });
      })
      .catch(error => {
        this.setState({
          isUpdatingAccount: false,
          error: {
            title: 'An unknown error occurred',
            content: 'Please try again later'
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
      .catch(error => {
        this.setState({
          isUpdatingAddress: false,
          error: {
            title: 'An unknown error occurred',
            content: 'Please try again later'
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
      .catch(error => {
        this.setState({
          isUpdatingPassword: false,
          error: {
            title: 'An unknown error occurred',
            content: 'Please try again later'
          }
        });
      });
  }

  deleteAccount(e) {
    this.setState({
      isDeletingAccount: true
    });

    APIService.shared().deleteAccount()
      .then(response => {
        this.setState({
          isDeletingAccount: false
        });
        this.props.history.push('/');
      })
      .catch(error => {
        this.setState({
          isDeletingAccount: false,
          error: {
            title: 'An unknown error occurred',
            content: 'Please try again later'
          }
        });
      });
  }

  render() {
    const { profilePicture, isUpdatingProfilePicture } = this.state;
    const { username, email, phoneNumber, firstName, lastName, isUpdatingAccount } = this.state;
    const { address1, address2, city, state, zipCode, isUpdatingAddress } = this.state;
    const { newPassword, newPasswordConfirmation, oldPassword, isUpdatingPassword } = this.state;
    const { isDeletingAccount } = this.state;
    const { className } = this.props;

    const inputClass = classNames('settings-form', className);

    return (
      <div className={inputClass}>

        <Panel padded>
          <PanelHeader title='Profile Picture' />
          <div className='settings-form__profile-picture'>
            <ImageInput name='profilePicture' preview={profilePicture} onChange={this.handleFileChange} loading={isUpdatingProfilePicture} />
          </div>
        </Panel>

        <Panel padded>
          <PanelHeader title='Account Information' />

          <Form onSubmit={this.handleAccountSubmit}>
            <FormGroup>
              <FormField>
                <label>First Name</label>
                <Input type='text' name='firstName' value={firstName} onChange={this.handleChange} />
              </FormField>
              <FormField>
                <label>Last Name</label>
                <Input type='text' name='lastName' value={lastName} onChange={this.handleChange} />
              </FormField>
            </FormGroup>
            <FormField>
              <label>Username</label>
              <Input type='text' name='username' value={username} onChange={this.handleChange} />
            </FormField>
            <FormField>
              <label>Email</label>
              <Input type='email' name='email' value={email} onChange={this.handleChange} />
            </FormField>
            <FormField>
              <label>Phone Number</label>
              <Input type='text' name='phoneNumber' value={phoneNumber} onChange={this.handleChange} />
            </FormField>
            <FormSection />
            <FormSection>
              <FormField>
                <Button type='submit' block loading={isUpdatingAccount}>Update</Button>
              </FormField>
            </FormSection>
          </Form>
        </Panel>

        <Panel padded>
          <PanelHeader title='Address' />

          <Form onSubmit={this.handleAddressSubmit}>
            <FormField>
              <label>Address</label>
              <Input type='text' name='address1' value={address1} onChange={this.handleChange} />
            </FormField>
            <FormField>
              <Input type='text' name='address2' value={address2} onChange={this.handleChange} />
            </FormField>
            <FormGroup>
              <FormField>
                <label>City</label>
                <Input type='text' name='city' value={city} onChange={this.handleChange} />
              </FormField>
              <FormField>
                <label>State</label>
                <Input type='text' name='state' value={state} onChange={this.handleChange} />
              </FormField>
              <FormField>
                <label>Zip Code</label>
                <Input type='text' name='zipCode' value={zipCode} onChange={this.handleChange} />
              </FormField>
            </FormGroup>
            <FormSection />
            <FormSection>
              <FormField>
                <Button type='submit' block loading={isUpdatingAddress}>Update</Button>
              </FormField>
            </FormSection>
          </Form>
        </Panel>

        <Panel padded>
          <PanelHeader title='Update Password' />

          <Form onSubmit={this.handlePasswordSubmit}>
            <FormField>
              <label>New Password</label>
              <Input type='password' name='newPassword' value={newPassword} onChange={this.handleChange} />
            </FormField>
            <FormField>
              <label>New Password Confirmation</label>
              <Input type='password' name='newPasswordConfirmation' value={newPasswordConfirmation} onChange={this.handleChange} />
            </FormField>
            <FormField>
              <label>Old Password</label>
              <Input type='password' name='oldPassword' value={oldPassword} onChange={this.handleChange} />
            </FormField>
            <FormSection />
            <FormSection>
              <FormField>
                <Button type='submit' block loading={isUpdatingPassword}>Update</Button>
              </FormField>
            </FormSection>
          </Form>
        </Panel>

        <Button icon='trash' danger block onClick={this.deleteAccount} loading={isDeletingAccount}>Delete Account</Button>
      </div>
    );
  }

}

export default withRouter(withAuth(SettingsForm));