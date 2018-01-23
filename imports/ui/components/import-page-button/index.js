import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import Popconfirm from 'antd/lib/popconfirm'; // for js
import 'antd/lib/popconfirm/style/css'; // for css
import Button from 'antd/lib/button'; // for js
import 'antd/lib/button/style/css'; // for css
import notification from 'antd/lib/notification'; // for js
import 'antd/lib/notification/style/css'; // for css
import Icon from 'antd/lib/icon'; // for js
import 'antd/lib/icon/style/css'; // for css


class ImportPageButton extends React.PureComponent {
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
    this.disableBtn();

    Meteor.call('Pages.methods.importCSV', (err) => {
      if (err) {
        console.log(err);
        notification.error({
          message: err.reason || err.message || 'Unexpected Error!',
          duration: 3,
        });
      } else {
        notification.success({
          message: 'Page successfully imported!',
          duration: 3,
        });
      }
      this.enableBtn();
    });
  }

  render() {
    return (
      <Popconfirm
        title="This operation will remove all existing records. Do you want to proceed?"
        onConfirm={this.handleClick}
        onCancel={() => {}}
        okText="Yes"
        cancelText="No"
      >
        <Button
          type="danger"
          disabled={this.state.disabled || this.props.disabled}
        >
          <Icon type="download" /> IMPORT
        </Button>
      </Popconfirm>
    );
  }
}

ImportPageButton.propTypes = {
  disabled: PropTypes.bool,
};

ImportPageButton.defaultProps = {
  disabled: false,
};

export default ImportPageButton;
