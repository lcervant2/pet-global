import React, { Component } from 'react';
import './Login.scss';

import Container from '../../components/UI/Container/Container';
import LoginForm from '../../components/LoginForm/LoginForm';

import { withAuth } from '../../helpers/withAuth';

class Login extends Component {

  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);
  }

  componentWillMount() {
    if (this.props.isLoggedIn) {
      if (this.props.history.canGoBack)
        this.props.history.goBack();
      else
        this.props.history.push('/');
    }
  }

  handleLogin(response) {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    this.props.history.push(from);
    window.location.reload();
  }

  render() {
    return (
      <div className='login-page'>
        <Container>
          <LoginForm onLogin={this.handleLogin} />
        </Container>
      </div>
    )
  }

}

export default withAuth(Login);