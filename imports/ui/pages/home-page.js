import { Meteor } from 'meteor/meteor';
import React from 'react';
import notification from 'antd/lib/notification'; // for js
import 'antd/lib/notification/style/css'; // for css
import NewPageButton from '../components/new-page-button';
import PagesTable from '../components/pages-table';


class HomePage extends React.Component {
  state = {
    disabled: false, // whether or not table links are disabled
  }

  disableBtn = () => {
    this.setState({ disabled: true });
  }

  enableBtn = () => {
    this.setState({ disabled: false });
  }

  handleCrawl = (page) => {
    this.disableBtn();

    Meteor.call('Pages.methods.crawlPage', page._id, (err) => {
      if (err) {
        console.log(err);
        notification.error({
          message: err.reason || err.message || 'Unexpected Error!',
          duration: 3,
        });
      } else {
        notification.success({
          message: 'Page successfully added!',
          duration: 3,
        });
      }
      this.enableBtn();
    });
  }

  handleEdit = () => {

  }

  handleDelete = () => {

  }

  render() {
    const { disabled } = this.state;

    return (
      <div className="p2">
        <div className="flex justify-between items-center">
          <h1>List of Wordpress sites:</h1>
          <NewPageButton />
        </div>
        <PagesTable
          disabled={disabled}
          onCrawl={this.handleCrawl}
          onEdit={this.handleEdit}
          onDelete={this.handleDelete}
        />
      </div>
    );
  }
}

export default HomePage;
