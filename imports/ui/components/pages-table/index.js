import React from 'react';
import PropTypes from 'prop-types';
import Popconfirm from 'antd/lib/popconfirm'; // for js
import 'antd/lib/popconfirm/style/css'; // for css
import Button from 'antd/lib/button'; // for js
import 'antd/lib/button/style/css'; // for css
import Table from 'antd/lib/table'; // for js
import 'antd/lib/table/style/css'; // for css
import Icon from 'antd/lib/icon'; // for js
import 'antd/lib/icon/style/css'; // for css
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
    render: (text, { isCrawled }) => (
      <span>
        {isCrawled ? 'yes' : 'no'}
      </span>
    ),
  },
  {
    title: 'Links',
    dataIndex: 'links',
    key: 'links',
    render: (text, record) => {
      const { _id, isCrawling, links } = record;

      if (isCrawling) {
        return (
          <span>
            Crawling crawling... <Icon type="coffee" />
          </span>
        );
      }

      return (
        <div style={{ fontSize: '11px' }}>
          {links && links.map(link => (
            <p key={link} >{link}</p>
          ))}
        </div>
      );
    },
  },
  {
    // title: 'Edit',
    key: 'edit',
    render: (text, record) => (
      // When the edit button is clicked the modal is open and the form
      // is pre-filled using the record's data
      <Button
        onClick={() => handleEdit(record)}
        disabled={disabled}
      >
        Edit
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
        disabled={disabled}
      >
        Crawl
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
        onConfirm={() => handleDelete(record)}
        onCancel={() => {}}
        okText="Yes"
        cancelText="No"
      >
        <Button
          disabled={disabled}
        >
          Delete
        </Button>
      </Popconfirm>
    ),
  },
]);

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const PagesTable = ({
  pages,
  disabled,
  onCrawl,
  onEdit,
  onDelete,
}) => (
  <Table
    dataSource={pages}
    columns={columns({
      disabled,
      handleCrawl: onCrawl,
      handleEdit: onEdit,
      handleDelete: onDelete,
    })}
  />
);

PagesTable.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape(pageFragment)),
  disabled: PropTypes.bool,
  onCrawl: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

PagesTable.defaultProps = {
  pages: [],
  disabled: false,
  onCrawl: () => {},
  onEdit: () => {},
  onDelete: () => {},
};

export default PagesTable;
