import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import Table from 'antd/lib/table'; // for js
import 'antd/lib/table/style/css'; // for css
import Pages from '../../../api/pages';
import { pageFragment } from '../../fragments';


//------------------------------------------------------------------------------
// HELPERS:
//------------------------------------------------------------------------------
const columns = ({ handleEdit, handleCrawl, handleDelete }) => ([
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
    title: 'Edit',
    key: 'edit',
    render: (text, record) => (
      <a
        href=""
        onClick={(evt) => {
          // When the edit button is clicked the modal is open and the form
          // is pre-filled using the record data
          evt.preventDefault();
          handleEdit(record);
        }}
      >
        Edit
      </a>
    ),
  },
  {
    title: 'Crawl',
    key: 'crawl',
    render: (text, record) => (
      <a
        href=""
        onClick={(evt) => {
          // When the edit button is clicked the modal is open and the form
          // is pre-filled using the record data
          evt.preventDefault();
          handleCrawl(record);
        }}
      >
        Crawl
      </a>
    ),
  },
  {
    title: 'Delete',
    key: 'delete',
    render: (text, record) => (
      <a
        href=""
        onClick={(evt) => {
          // When the edit button is clicked the modal is open and the form
          // is pre-filled using the record data
          evt.preventDefault();
          handleDelete(record);
        }}
      >
        Delete
      </a>
    ),
  },
]);

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const PagesTable = ({
  meteorData,
  onCrawl,
  onEdit,
  onDelete,
}) => (
  <Table
    dataSource={meteorData.pages}
    columns={columns({
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
  onCrawl: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
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
