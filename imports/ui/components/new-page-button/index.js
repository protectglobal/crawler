import React from 'react';
import Button from 'antd/lib/button'; // for js
import 'antd/lib/button/style/css'; // for css
import Modal from 'antd/lib/modal'; // for js
import 'antd/lib/modal/style/css'; // for css
import NewPage from '../new-page';


class NewPageButton extends React.PureComponent {
  state = {
    visible: false, // whether or not the modalform is visible
  }

  openModal = () => {
    this.setState({ visible: true });
  }

  closeModal = () => {
    this.setState({ visible: false });
  }

  render() {
    const { visible } = this.state;

    return (
      <div className="inline">
        <Button
          type="primary"
          onClick={this.openModal}
        >
          + ADD PAGE
        </Button>
        <Modal
          title="Add a Page"
          visible={visible}
          onOk={() => {}}
          onCancel={this.closeModal}
          footer={null}
        >
          <div className="flex justify-center items-center">
            <NewPage
              onCancel={this.closeModal}
              onComplete={this.closeModal}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default NewPageButton;
