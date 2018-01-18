import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import notification from 'antd/lib/notification'; // for js
import 'antd/lib/notification/style/css'; // for css
import PageForm from '../page-form';


class NewPage extends React.Component {
  state = {
    disabled: false, // whether or not the form submit button is disabled
  }

  disableBtn = () => {
    this.setState({ disabled: true });
  }

  enableBtn = () => {
    this.setState({ disabled: false });
  }

  handleCancel = () => {
    const { onCancel } = this.props;
    this.enableBtn();
    // Pass event up to parent component
    onCancel();
  }

  handleSubmit = (page) => {
    const { onComplete } = this.props;

    this.disableBtn();

    Meteor.call('Pages.methods.insertPage', page, (err) => {
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
        // Pass event up to parent component
        onComplete();
      }
      this.enableBtn();
    });
  }

  render() {
    const { disabled } = this.state;

    return (
      <PageForm
        // type="new"
        btnLabel={!disabled ? 'Add Page!' : 'Creating...'}
        disabled={disabled}
        onBeforeHook={this.disableBtn}
        onErrorHook={this.enableBtn}
        onSubmitHook={this.handleSubmit}
        onCancel={this.enableBtn}
      />
    );
  }
}

NewPage.propTypes = {
  onComplete: PropTypes.func,
  onCancel: PropTypes.func,
};

NewPage.defaultProps = {
  onComplete: () => {},
  onCancel: () => {},
};

export default NewPage;
