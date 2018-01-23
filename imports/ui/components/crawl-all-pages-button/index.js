import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import Button from 'antd/lib/button'; // for js
import 'antd/lib/button/style/css'; // for css
import notification from 'antd/lib/notification'; // for js
import 'antd/lib/notification/style/css'; // for css


class CrawlAllPagesButton extends React.PureComponent {
  handleClick = () => {
    Meteor.call('Pages.methods.crawlAllPages', (err) => {
      if (err) {
        console.log(err);
        notification.error({
          message: err.reason || err.message || 'Unexpected Error!',
          duration: 3,
        });
      } else {
        notification.success({
          message: 'Pages successfully crawled!',
          duration: 3,
        });
      }
    });
  }

  render() {
    const { disabled } = this.props;

    return (
      <Button
        type="danger"
        onClick={this.handleClick}
        disabled={disabled}
      >
        CRAWL ALL PAGES
      </Button>
    );
  }
}

CrawlAllPagesButton.propTypes = {
  disabled: PropTypes.bool,
};

CrawlAllPagesButton.defaultProps = {
  disabled: false,
};

export default CrawlAllPagesButton;
