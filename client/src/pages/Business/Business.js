import React from 'react';
import { Switch, Route } from 'react-router-dom';

import BusinessDetails from '../../components/BusinessDetails/BusinessDetails';

const Business = () => (
  <div>
    <Switch>
      <Route path='/businesses/:id' component={BusinessDetails} />
    </Switch>
  </div>
);

export default Business;