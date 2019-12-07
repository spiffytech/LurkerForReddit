import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import './global.css';

import AuthedZone from './components/AuthedZone';
import Home from './views/Home';

const App: React.FC = () => {
  return (
    <main className="bg-gray-500 h-screen overflow-auto">
      <Router>
        <Switch>
          <Route path='/r/:subreddit/:id'>
            <AuthedZone component={Home} />
          </Route>

          <Route path='/'>
            <AuthedZone component={Home} />
          </Route>
        </Switch>
      </Router>
    </main>
  );
}

export default App;
