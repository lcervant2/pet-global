import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import './SignUpForm.scss';

import Panel from '../UI/Panel/Panel';
import PanelHeader from '../UI/Panel/Header/Header';
import PanelFooter from '../UI/Panel/Footer/Footer';
import Form from '../UI/Form/Form';
import FormSection from '../UI/Form/Section/Section';
import FormField from '../UI/Form/Field/Field';
import FormGroup from '../UI/Form/Group/Group';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import Message from '../UI/Message/Message';
import Icon from '../UI/Icon/Icon';

import APIService from '../../services/APIService';

import { camelCase } from '../../helpers/convertCase';
import states from '../../helpers/states';

class SignUpForm extends Component {

  constructor(props) {
    super(props);

    this.statesList = _.map(Object.keys(states), state => { return { key: state, text: state, value: state } });

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      passwordConfirmation: '',
      address: {
        address1: '',
        address2: '',
        city: '',
        state: 'VA',
        zipCode: ''
      },
      isLoading: false,
      error: null
    };
  }

  handleChange(e, { name, value }) {
    if (name.startsWith('address.')) {
      this.setState({
        address: Object.assign({}, this.state.address, {
          [name.replace('address.', '')]: value
        })
      });
    } else {
      this.setState({
        [name]: value
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({
      isLoading: true
    });

    APIService.shared().signUp(this.state)
      .then(response => {
        this.props.onSignUp(response);
      })
      .catch(err => {
        const errorMessages = {};
        if (err.response.status === 400) {
          const errors = camelCase(err.response.data.validations.body);
          errors.forEach(error => {
            if (error.dataPath === '' && error.keyword === 'required') {
              if (error.params.missingProperty === 'username')
                errorMessages.username = 'Username cannot be blank';
              else if (error.params.missingProperty === 'email')
                errorMessages.email = 'Email cannot be blank';
              else if (error.params.missingProperty === 'password')
                errorMessages.password = 'Password cannot be blank';
              else if (error.params.missingProperty === 'first_name')
                errorMessages.firstName = 'First name cannot be blank';
              else if (error.params.missingProperty === 'last_name')
                errorMessages.lastName = 'Last name cannot be blank';
            } else if (error.dataPath === '.address' && error.keyword === 'required') {
              if (error.params.missingProperty === 'address1')
                errorMessages.address1 = 'Address cannot be blank';
              else if (error.params.missingProperty === 'address2')
                errorMessages.address2 = 'Address cannot be blank';
              else if (error.params.missingProperty === 'city')
                errorMessages.city = 'City cannot be blank';
              else if (error.params.missingProperty === 'state')
                errorMessages.state = 'State cannot be blank';
              else if (error.params.missingProperty === 'zip_code')
                errorMessages.zipCode = 'Zip code cannot be blank';
            }
          });
        } else if (err.response.status === 401 && err.response.data.error.code === 'USERNAME_UNAVAILABLE_ERROR') {
          errorMessages.username = 'This username is already taken';
        } else if (err.response.status === 401 && err.response.data.error.code === 'EMAIL_ALREADY_REGISTERED_ERROR') {
          errorMessages.email = 'This email is already associated with another account';
        }
        this.setState({
          error: {
            title: 'The following errors occurred',
            content: (
              <ul>
                {Object.values(errorMessages).map(message => (
                  <li>{message}</li>
                ))}
              </ul>
            )
          },
          isLoading: false
        });
      });
  }

  render() {
    const { isLoading, error } = this.state;
    const { className } = this.props;

    const inputClass = classNames('sign-up-form', className);

    return (
      <div className={inputClass}>
        {error && <Message {...error} error />}

        <Panel padded>
          <PanelHeader title='Sign Up' content='Fill out the form below to sign up for a new account.' />

          <Form onSubmit={this.handleSubmit}>
            <FormSection>
              <FormGroup>
                <FormField>
                  <label>First name</label>
                  <Input type='text' name='firstName' placeholder='John' onChange={this.handleChange} />
                </FormField>
                <FormField>
                  <label>Last name</label>
                  <Input type='text' name='lastName' placeholder='Smith' onChange={this.handleChange} />
                </FormField>
              </FormGroup>
              <FormField>
                <label>Username</label>
                <Input type='text' name='username' placeholder='Username' icon='at' onChange={this.handleChange} />
              </FormField>
              <FormField>
                <label>Email</label>
                <Input type='email' name='email' placeholder='email@domain.com' onChange={this.handleChange} />
              </FormField>
            </FormSection>

            <FormSection>
              <FormField>
                <label>Password</label>
                <Input type='password' name='password' placeholder='Password' onChange={this.handleChange} />
              </FormField>
              <FormField>
                <label>Password Confirmation</label>
                <Input type='password' name='passwordConfirmation' placeholder='Password confirmation' onChange={this.handleChange} />
              </FormField>
            </FormSection>

            <FormSection>
              <FormField>
                <label>Address</label>
                <Input type='text' name='address.address1' placeholder='Address line 1' onChange={this.handleChange} />
                <Input type='text' name='address.address2' placeholder='Address line 2' onChange={this.handleChange} />
              </FormField>
              <FormGroup>
                <FormField>
                  <label>City</label>
                  <Input type='text' name='address.city' placeholder='City' onChange={this.handleChange} />
                </FormField>
                <FormField>
                  <label>State</label>
                  <Input type='text' name='address.state' placeholder='State' onChange={this.handleChange} />
                </FormField>
                <FormField>
                  <label>Zip Code</label>
                  <Input type='text' name='address.zipCode' placeholder='Zip code' onChange={this.handleChange} />
                </FormField>
              </FormGroup>
            </FormSection>

            <FormSection />

            <FormSection>
              <Button type='submit' primary block icon='edit' loading={isLoading}>Sign Up</Button>
            </FormSection>
          </Form>

          <PanelFooter content={
            <span>Already have an account? <Link to='/login'>Login here</Link>.</span>
          } />
        </Panel>
      </div>
    );
  }

}

SignUpForm.propTypes = {
  onSignUp: PropTypes.func
};

SignUpForm.defaultProps = {
  onSignUp: () => {}
};

export default SignUpForm;