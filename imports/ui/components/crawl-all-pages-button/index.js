import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import Button from 'antd/lib/button'; // for js
import 'antd/lib/button/style/css'; // for css
import notification from 'antd/lib/notification'; // for js
import 'antd/lib/notification/style/css'; // for css


class CrawlAllPagesButton extends React.PureComponent {
  state = {
    disabled: false,
  }

  disableBtn = () => {
    this.setState({ disabled: true });
  }

  enableBtn = () => {
    this.setState({ disabled: false });
  }

  handleClick = () => {
    const { onStart, onComplete } = this.props;

    this.disableBtn();

    // Pass event up to parent component
    onStart();

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
      this.enableBtn();
      // Pass event up to parent component
      onComplete();
    });
  }

  render() {
    const { disabled } = this.state;

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
  onStart: PropTypes.func,
  onComplete: PropTypes.func,
};

CrawlAllPagesButton.defaultProps = {
  onStart: () => {},
  onComplete: () => {},
};

export default CrawlAllPagesButton;
