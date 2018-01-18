import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HomePage from './pages/home-page';
import NotFoundPage from './pages/not-found-page';


const Routes = () => (
  <Switch>
    <Route
      name="home"
      path="/"
      exact
      component={HomePage}
    />
    <Route
      name="notFound"
      component={NotFoundPage}
    />
  </Switch>
);

export default Routes;
