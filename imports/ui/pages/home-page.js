import { Meteor } from 'meteor/meteor';
import React from 'react';
import notification from 'antd/lib/notification'; // for js
import 'antd/lib/notification/style/css'; // for css
import Modal from 'antd/lib/modal'; // for js
import 'antd/lib/modal/style/css'; // for css
import NewPageButton from '../components/new-page-button';
import PagesTable from '../components/pages-table';
import EditPage from '../components/edit-page';


class HomePage extends React.Component {
  state = {
    disabled: false, // whether or not table links are disabled
    visible: false, // whether or not the modal form is visible
    editPage: {}, // page to be edited
    crawledPageId: '',
  }

  disableBtn = () => {
    this.setState({ disabled: true });
  }

  enableBtn = () => {
    this.setState({ disabled: false });
  }

  openModal = () => {
    this.setState({ visible: true });
  }

  closeModal = () => {
    this.setState({ visible: false });
  }

  handleCrawl = ({ _id: pageId }) => {
    this.disableBtn();

    // Keep track of the crawled page in order to show loading indicator
    this.setState({ crawledPageId: pageId });

    Meteor.call('Pages.methods.crawlPage', pageId, (err) => {
      if (err) {
        console.log(err);
        notification.error({
          message: err.reason || err.message || 'Unexpected Error!',
          duration: 3,
        });
      } else {
        notification.success({
          message: 'Page successfully crawled!',
          duration: 3,
        });
      }
      this.enableBtn();
      this.setState({ crawledPageId: '' });
    });
  }

  handleEdit = (page) => {
    this.setState(
      { editPage: page },
      () => (this.setState({ visible: true })), // callback
    );
  }

  handleDelete = ({ _id: pageId }) => {
    this.disableBtn();

    Meteor.call('Pages.methods.removePage', pageId, (err) => {
      if (err) {
        console.log(err);
        notification.error({
          message: err.reason || err.message || 'Unexpected Error!',
          duration: 3,
        });
      } else {
        notification.success({
          message: 'Page successfully deleted!',
          duration: 3,
        });
      }
      this.enableBtn();
    });
  }

  render() {
    const { disabled, visible, editPage, crawledPageId } = this.state;

    return (
      <div className="p2">
        <div className="flex justify-between items-center">
          <h1>List of Wordpress sites:</h1>
          <NewPageButton />
        </div>
        <PagesTable
          disabled={disabled}
          crawledPageId={crawledPageId}
          onCrawl={this.handleCrawl}
          onEdit={this.handleEdit}
          onDelete={this.handleDelete}
        />

        {/* Force re-render in order to clear form fields */}
        {visible && (
          <Modal
            title="Edit Page"
            visible={visible}
            onOk={() => {}}
            onCancel={this.closeModal}
            footer={null}
          >
            <div className="flex justify-center items-center">
              <EditPage
                page={editPage}
                onCancel={this.closeModal}
                onComplete={this.closeModal}
              />
            </div>
          </Modal>
        )}
      </div>
    );
  }
}

export default HomePage;
