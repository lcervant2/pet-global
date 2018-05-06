import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.scss';

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

class ForgotPassword extends Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      email: '',
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
    }
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

    APIService.shared().resetPassword(this.state.email)
      .then(() => {
        this.setState({
          isLoading: false,
          error: null,
          success: {
            title: 'Success',
            content: 'We sent an email with your password reset link to ' + this.state.email + '.'
          }
        });
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          success: null,
          error: {
            title: 'Error',
            content: 'The email you provided does not match any registered accounts.'
          }
        });
      });
  }

  render() {
    const { email, success, error, isLoading } = this.state;

    return (
      <div className='forgot-password-page'>
        <Container>
          <div className='forgot-password-page__form'>
            {success && <Message success {...success} />}
            {error && <Message error {...error} />}

            <Panel padded>
              <PanelHeader title='Forgot Password' content='Enter the email associated with your account.' />

              <Form onSubmit={this.handleSubmit}>
                <FormSection>
                  <FormField>
                    <label>Email</label>
                    <Input type='email' name='email' value={email} placeholder='youremail@domain.com' onChange={this.handleChange} />
                  </FormField>
                </FormSection>
                <FormSection>
                  <Button type='submit' icon='sign-in-alt' primary block loading={isLoading}>Reset Password</Button>
                </FormSection>
              </Form>
            </Panel>
          </div>
        </Container>
      </div>
    )
  }

}

export default withAuth(ForgotPassword);