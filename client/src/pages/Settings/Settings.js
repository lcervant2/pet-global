import React, { Component } from 'react';
import './Settings.scss';

import Container from '../../components/UI/Container/Container';
import SettingsForm from '../../components/SettingsForm/SettingsForm';

class Settings extends Component {

  render() {
    return (
      <div className="settings-page">
        <Container>
          <SettingsForm />
        </Container>
      </div>
    );
  }

}

export default Settings;