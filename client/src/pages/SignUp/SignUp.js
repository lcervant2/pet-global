import React, { Component } from 'react';
import './SignUp.scss';

import Container from '../../components/UI/Container/Container';
import SignUpForm from '../../components/SignUpForm/SignUpForm';

import { withAuth } from "../../helpers/withAuth";

class SignUp extends Component {

  constructor(props) {
    super(props);

    this.handleSignUp = this.handleSignUp.bind(this);
  }

  componentWillMount() {
    if (this.props.isLoggedIn) {
      if (this.props.history.canGoBack)
        this.props.history.goBack();
      else
        this.props.history.push('/');
    }
  }

  handleSignUp(response) {
    this.props.history.push('/');
  }

  render() {
    return (
      <div className='sign-up-page'>
        <Container>
          <SignUpForm onSignUp={this.handleSignUp} />
        </Container>
      </div>
    );
  }

}

export default withAuth(SignUp);