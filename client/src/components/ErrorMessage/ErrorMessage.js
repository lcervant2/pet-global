import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Message
} from 'semantic-ui-react';

class ErrorMessage extends Component {

  render() {
    const { title, message, ...rest } = this.props;

    return (
      <Message negative {...rest}>
        {!!title && <Message.Header>{title}</Message.Header>}
        {!!message && <p>{message}</p>}
      </Message>
    );
  }

}

ErrorMessage.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string
};

export default ErrorMessage;