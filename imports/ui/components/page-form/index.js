import React from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/lib/form'; // for js
import 'antd/lib/form/style/css'; // for css
import Input from 'antd/lib/input'; // for js
import 'antd/lib/input/style/css'; // for css
import Button from 'antd/lib/button'; // for js
import 'antd/lib/button/style/css'; // for css
import extend from 'lodash/extend';

const FormItem = Form.Item;


class PageForm extends React.Component {
  handleSubmit = (evt) => {
    const { type, onBeforeHook, onErrorHook, onSubmitHook, form } = this.props;

    evt.preventDefault();

    // Run before logic if provided and return on error
    try {
      onBeforeHook();
    } catch (exc) {
      return; // return silently
    }

    form.validateFields((err, data) => {
      if (err) {
        // Pass event up to parent component
        onErrorHook(err);
      } else {
        // In case we are editing, format links field.
        if (type === 'edit') {
          // Format links string into an array. Note, with filter(Boolean) all
          // falsy values will be omitted from the array.
          const links = (data && data.links && data.links.split(/[ ,;]+/).filter(Boolean)) || [];
          extend(data, { links });
        }

        // Pass data up to parent component to handle submit functionality.
        onSubmitHook(data);
      }
    });
  }

  render() {
    const { type, form, btnLabel, initialValue, disabled } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={this.handleSubmit} style={{ width: '100%' }}>
        <FormItem label="URL">
          {getFieldDecorator('url', {
            initialValue: (initialValue && initialValue.url) || '',
            validateTrigger: 'onBlur',
            rules: [
              { required: true, message: 'This field is required!' },
              // { max: 100, message: 'Must be no more than 100 characters!' },
            ],
          })(
            <Input placeholder="URL..." />,
          )}
        </FormItem>
        <FormItem label="Language">
          {getFieldDecorator('lang', {
            initialValue: (initialValue && initialValue.lang) || '',
            validateTrigger: 'onBlur',
            rules: [
              { required: false, message: 'This field is required!' },
              // { max: 100, message: 'Must be no more than 100 characters!' },
            ],
          })(
            <Input placeholder="Language..." />,
          )}
        </FormItem>
        <FormItem label="Country">
          {getFieldDecorator('country', {
            initialValue: (initialValue && initialValue.country) || '',
            validateTrigger: 'onBlur',
            rules: [
              { required: false, message: 'This field is required!' },
              // { max: 100, message: 'Must be no more than 100 characters!' },
            ],
          })(
            <Input placeholder="Country..." />,
          )}
        </FormItem>
        {type === 'edit' && (
          <FormItem label="Links">
            {getFieldDecorator('links', {
              initialValue: (initialValue && initialValue.links && initialValue.links.join(', ')) || '',
              validateTrigger: 'onBlur',
              rules: [
                { required: false, message: 'This field is required!' },
                // { max: 100, message: 'Must be no more than 100 characters!' },
              ],
            })(
              <Input.TextArea placeholder="Links..." autosize={{ minRows: 4 }} />,
            )}
          </FormItem>
        )}
        {type === 'edit' && (
          <FormItem label="ID" className="display-none">
            {getFieldDecorator('_id', {
              initialValue: (initialValue && initialValue._id) || '',
              validateTrigger: 'onBlur',
              rules: [
                { required: true, message: 'This field is required!' },
                // { max: 100, message: 'Must be no more than 100 characters!' },
              ],
            })(
              <Input placeholder="ID..." />,
            )}
          </FormItem>
        )}
        <FormItem>
          <Button
            htmlType="submit"
            type="primary"
            disabled={disabled}
            loading={disabled}
          >
            {btnLabel}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

PageForm.propTypes = {
  type: PropTypes.oneOf(['new', 'edit']).isRequired,
  btnLabel: PropTypes.string,
  initialValue: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    lang: PropTypes.string,
    country: PropTypes.string,
    links: PropTypes.arrayOf(PropTypes.string),
  }),
  disabled: PropTypes.bool,
  onBeforeHook: PropTypes.func,
  onErrorHook: PropTypes.func,
  onSubmitHook: PropTypes.func,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
  }).isRequired,
};

PageForm.defaultProps = {
  btnLabel: 'SUBMIT',
  initialValue: null,
  disabled: false,
  hideClientInput: false,
  onBeforeHook: () => {},
  onErrorHook: () => {},
  onSubmitHook: () => {},
};

export default Form.create()(PageForm);
