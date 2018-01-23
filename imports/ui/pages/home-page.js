import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import notification from 'antd/lib/notification'; // for js
import 'antd/lib/notification/style/css'; // for css
import Modal from 'antd/lib/modal'; // for js
import 'antd/lib/modal/style/css'; // for css
import Pages from '../../api/pages';
import { pageFragment } from '../fragments';
import ImportPageButton from '../components/import-page-button';
import CrawlAllPagesButton from '../components/crawl-all-pages-button';
import NewPageButton from '../components/new-page-button';
import PagesTable from '../components/pages-table';
import EditPage from '../components/edit-page';


class HomePage extends React.Component {
  state = {
    visible: false, // whether or not the modal form is visible
    editPage: {}, // page to be edited
  }

  openModal = () => {
    this.setState({ visible: true });
  }

  closeModal = () => {
    this.setState({ visible: false });
  }

  handleCrawl = ({ _id: pageId }) => {
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
    });
  }

  handleEdit = (page) => {
    this.setState(
      { editPage: page },
      () => (this.setState({ visible: true })), // callback
    );
  }

  handleDelete = ({ _id: pageId }) => {
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
    });
  }

  render() {
    const { meteorData } = this.props;
    const { pages, disabled } = meteorData;
    const { visible, editPage } = this.state;

    return (
      <div className="p2">
        <div className="flex justify-between items-center">
          <h1>List of Wordpress sites:</h1>
          <ImportPageButton disabled={disabled} />
          <CrawlAllPagesButton disabled={disabled} />
          <NewPageButton />
        </div>
        <PagesTable
          pages={pages}
          disabled={disabled}
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

PagesTable.propTypes = {
  meteorData: PropTypes.shape({
    pages: PropTypes.arrayOf(PropTypes.shape(pageFragment)).isRequired,
    disabled: PropTypes.bool.isRequired,
  }),
};

PagesTable.defaultProps = {
  meteorData: {
    pages: [],
    disabled: false,
  },
};

//------------------------------------------------------------------------------
// CONTAINER:
//------------------------------------------------------------------------------
const withData = withTracker(() => {
  const subs = Meteor.subscribe('Pages.publications.getAllPages');
  const pages = Pages.collection.find({}, { sort: { createdAt: -1 } }).fetch(); // newest first.
  const disabled = pages.filter(page => page.isCrawling === true).length > 0;

  return {
    meteorData: {
      pagesReady: subs.ready(),
      disabled: disabled || false,
      pages: pages || [],
    },
  };
});

export default withData(HomePage);
