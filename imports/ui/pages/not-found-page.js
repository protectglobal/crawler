import React from 'react';
import { Link } from 'react-router-dom';


const NotFoundPage = () => (
  <div>
    <h1 className="center">
      404 - Page Not Found
    </h1>
    <p className="center">
      Back to <Link to="/">Home</Link>
    </p>
  </div>
);

export default NotFoundPage;
