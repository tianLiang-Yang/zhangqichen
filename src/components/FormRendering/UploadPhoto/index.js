import * as React from 'react';
import { Icon, Upload, Modal } from 'antd';

class UploadPhoto extends React.Component {
  constructor(props) {
    super(props);
    const value = this.props.value || {};
    this.state = {
      loading: false,
      fileList: value | [],
    };
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      const res = info.file.response;
      if (!res || res.code != 200) {
        Modal.error({
          content: '上传失败',
        });
      }
      else {
        this.setState({
          loading: false,
        });
        this.props.onChange(info.file.response.data);
      }
    }
  }

  render() {
    const { action } = this.props;
    const file = this.props[this.props.id] || null;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action={action}
          listType="picture-card"
          showUploadList={false}
          onChange={this.handleChange}
        >
          {file ? <img src={file} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
      </div>
    );
  }
}

export default UploadPhoto;