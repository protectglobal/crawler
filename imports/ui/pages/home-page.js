import React from 'react';
// import PropTypes from 'prop-types';
import PagesTable from '../components/pages-table';


class HomePage extends React.Component {
  handleCrawl = () => {

  }

  handleEdit = () => {

  }

  handleDelete = () => {

  }

  render() {
    return (
      <div className="p2">
        <h1>List of Wordpress sites:</h1>
        <PagesTable
          onCrawl={this.handleCrawl}
          onEdit={this.handleEdit}
          onDelete={this.handleDelete}
        />
      </div>
    );
  }
}

export default HomePage;
