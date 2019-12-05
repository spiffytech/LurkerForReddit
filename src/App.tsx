import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import AuthedZone from './components/AuthedZone';
import Home from './views/Home';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path='/'>
          <AuthedZone component={Home} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
