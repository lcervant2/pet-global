import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './ResetPassword.scss';
import qs from 'qs';

import Container from '../../components/UI/Container/Container';
import Panel from '../../components/UI/Panel/Panel';
import PanelHeader from '../../components/UI/Panel/Header/Header';
import Form from '../../components/UI/Form/Form';
import FormField from '../../components/UI/Form/Field/Field';
import FormSection from '../../components/UI/Form/Section/Section';
import Button from '../../components/UI/Button/Button';
import Message from '../../components/UI/Message/Message';
import Input from '../../components/UI/Input/Input';

import APIService from "../../services/APIService";

import { withAuth } from '../../helpers/withAuth';

class ResetPassword extends Component {

  constructor(props) {
    super(props);

    this.updateToken = this.updateToken.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      token: '',
      user: '',
      password: '',
      passwordConfirmation: '',
      isLoading: false,
      error: null,
      success: null
    };
  }

  componentWillMount() {
    if (this.props.isLoggedIn) {
      if (this.props.history.canGoBack)
        this.props.history.goBack();
      else
        this.props.history.push('/');
    } else {
      this.updateToken(this.props);
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isLoggedIn) {
      if (newProps.history.canGoBack)
        newProps.history.goBack();
      else
        newProps.history.push('/');
    } else {
      this.updateToken(newProps);
    }
  }

  updateToken(props) {
    const query = qs.parse(props.location.search.slice(1));
    this.setState({
      token: query.token,
      user: query.user
    });
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

    APIService.shared().confirmPassword(this.state.token, this.state.user, this.state.password)
      .then(() => {
        this.setState({
          isLoading: false,
          error: null,
          password: '',
          passwordConfirmation: '',
          success: {
            title: 'Success',
            content: 'Your password has been reset. You can now login.'
          }
        });
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          success: null,
          password: '',
          passwordConfirmation: '',
          error: {
            title: 'Error',
            content: 'This reset link may be expired. Try request another.'
          }
        });
      });
  }

  render() {
    const { password, passwordConfirmation, success, error, isLoading } = this.state;

    return (
      <div className='reset-password-page'>
        <Container>
          <div className='reset-password-page__form'>
            {success && <Message success {...success} />}
            {error && <Message error {...error} />}

            <Panel padded>
              <PanelHeader title='Reset Password' content='Reset the password to your account.' />

              <Form onSubmit={this.handleSubmit}>
                <FormSection>
                  <FormField>
                    <label>New Password</label>
                    <Input type='password' placeholder='New password' value={password} name='password' onChange={this.handleChange} />
                  </FormField>
                  <FormField>
                    <label>New Password Confirmation</label>
                    <Input type='password' placeholder='New password confirmation' value={passwordConfirmation} name='passwordConfirmation' onChange={this.handleChange} />
                  </FormField>
                </FormSection>
                <FormSection>
                  <FormField>
                    <Button type='submit' icon='sign-in-alt' primary block loading={isLoading}>Reset Password</Button>
                  </FormField>
                </FormSection>
              </Form>

            </Panel>

          </div>
        </Container>
      </div>
    )
  }

}

export default withAuth(ResetPassword);