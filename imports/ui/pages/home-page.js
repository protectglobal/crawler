import React from 'react';
import NewPageButton from '../components/new-page-button';
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
        <div className="flex justify-between items-center">
          <h1>List of Wordpress sites:</h1>
          <NewPageButton />
        </div>
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
