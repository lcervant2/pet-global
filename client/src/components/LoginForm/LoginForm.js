import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './LoginForm.scss';

import Panel from '../UI/Panel/Panel';
import PanelHeader from '../UI/Panel/Header/Header';
import PanelFooter from '../UI/Panel/Footer/Footer';
import Form from '../UI/Form/Form';
import FormField from '../UI/Form/Field/Field';
import FormSection from '../UI/Form/Section/Section';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import Icon from '../UI/Icon/Icon';
import Message from '../UI/Message/Message';

import APIService from '../../services/APIService';

class LoginForm extends Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      username: '',
      password: '',
      isLoading: false,
      error: null
    };
  }

  handleChange(e, { name, value }) {
    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({
      isLoading: true
    });

    APIService.shared().login(this.state.username, this.state.password)
      .then(response => {
        this.props.onLogin(response);
      })
      .catch(err => {
        if (err.response.status === 400) {
          this.setState({
            isLoading: false,
            error: {
              title: 'Incorrect username or password'
            }
          });
        } else {
          this.setState({
            isLoading: false,
            error: {
              title: 'An unknown error occurred'
            }
          });
        }
      });
  }

  render() {
    const { className } = this.props;
    const { isLoading, error } = this.state;

    const inputClass = classNames('login-form', className);

    return (
      <div className={inputClass}>
        {error && <Message {...error} error />}

        <Panel padded>
          <PanelHeader title='Login' content='Enter your username and password to login.' />

          <Form onSubmit={this.handleSubmit}>
            <FormSection>
              <FormField>
                <label>Username/email</label>
                <Input type='text' name='username' placeholder='Username/email' onChange={this.handleChange} />
              </FormField>

              <FormField>
                <label>Password</label>
                <Input type='password' name='password' placeholder='Password' onChange={this.handleChange} />
              </FormField>
            </FormSection>

            <FormSection />

            <FormSection>
              <Button type='submit' primary block large icon='sign-in-alt' loading={isLoading}>Login</Button>
            </FormSection>
          </Form>

          <PanelFooter content={
            <span>Don't have an account? <Link to='/signup'>Sign up here</Link>.</span>
          } />
        </Panel>

        <p className='login-form__forgot-password'>
          <Link to='/password/forgot'>Forgot your password?</Link>
        </p>
      </div>
    );
  }

}

LoginForm.propTypes = {
  onLogin: PropTypes.func
};

LoginForm.defaultProps = {
  onLogin: (response) => {}
};

export default LoginForm;