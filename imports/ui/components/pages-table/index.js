import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import Popconfirm from 'antd/lib/popconfirm'; // for js
import 'antd/lib/popconfirm/style/css'; // for css
import Button from 'antd/lib/button'; // for js
import 'antd/lib/button/style/css'; // for css
import Icon from 'antd/lib/icon'; // for js
import 'antd/lib/icon/style/css'; // for css
import Table from 'antd/lib/table'; // for js
import 'antd/lib/table/style/css'; // for css
import Pages from '../../../api/pages';
import { pageFragment } from '../../fragments';


//------------------------------------------------------------------------------
// HELPERS:
//------------------------------------------------------------------------------
const columns = ({
  disabled,
  handleEdit,
  handleCrawl,
  handleDelete,
}) => ([
  {
    title: 'URL',
    dataIndex: 'url',
    key: 'url',
  },
  {
    title: 'Country',
    dataIndex: 'country',
    key: 'country',
  },
  {
    title: 'Language',
    dataIndex: 'lang',
    key: 'lang',
  },
  {
    title: 'Crawled',
    dataIndex: 'isCrawled',
    key: 'isCrawled',
  },
  {
    title: 'Links',
    dataIndex: 'links',
    key: 'links',
  },
  {
    // title: 'Edit',
    key: 'edit',
    render: (text, record) => (
      // When the edit button is clicked the modal is open and the form
      // is pre-filled using the record's data
      <Button
        onClick={() => handleEdit(record)}
        loading={disabled}
        disabled={disabled}
      >
        Edit <Icon type="edit" />
      </Button>
    ),
  },
  {
    // title: 'Crawl',
    key: 'crawl',
    render: (text, record) => (
      // When the crawl button is clicked a server side function is fired to
      // find all links associated to the given url
      <Button
        onClick={() => handleCrawl(record)}
        loading={disabled}
        disabled={disabled}
      >
        Crawl <Icon type="fork" />
      </Button>
    ),
  },
  {
    // title: 'Delete',
    key: 'delete',
    render: (text, record) => (
      // When the delete button is clicked we remove the given record from
      // the DB
      <Popconfirm
        title="Are you sure delete this page?"
        onClick={() => handleDelete(record)}
        onCancel={() => {}}
        okText="Yes"
        cancelText="No"
      >
        <Button
          loading={disabled}
          disabled={disabled}
        >
          Delete <Icon type="delete" />
        </Button>
      </Popconfirm>
    ),
  },
]);

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const PagesTable = ({
  meteorData,
  disabled,
  onCrawl,
  onEdit,
  onDelete,
}) => (
  <Table
    dataSource={meteorData.pages}
    columns={columns({
      disabled,
      handleCrawl: onCrawl,
      handleEdit: onEdit,
      handleDelete: onDelete,
    })}
  />
);

PagesTable.propTypes = {
  meteorData: PropTypes.shape({
    pages: PropTypes.arrayOf(
      PropTypes.shape(pageFragment),
    ).isRequired,
  }).isRequired,
  disabled: PropTypes.bool,
  onCrawl: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

PagesTable.defaultProps = {
  disabled: false,
};

//------------------------------------------------------------------------------
// CONTAINER:
//------------------------------------------------------------------------------
const withData = withTracker(() => {
  const subs = Meteor.subscribe('Pages.publications.getAllPages');
  const pages = Pages.collection.find({}).fetch();

  return {
    meteorData: {
      pagesReady: subs.ready(),
      pages,
    },
  };
});

export default withData(PagesTable);
