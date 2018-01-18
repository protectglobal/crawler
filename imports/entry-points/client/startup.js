import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import 'sanitize.css/sanitize.css';
import 'basscss/css/basscss.min.css';
import App from '../../ui/app';


Meteor.startup(() => {
  // Inject react app
  render(<App />, document.getElementById('root'));
});
