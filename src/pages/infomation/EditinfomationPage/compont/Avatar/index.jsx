import React from 'react';
import styles from './index.less';
import { Upload, Icon, Modal } from 'antd';
import { BaseUrl } from '@/utils/Constant'

class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this. state = {
      previewVisible: false,
      previewImage: '',
      fileList: [
      ],
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      fileList: nextProps.fileList,
    })
  }

  getBase64 = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    })

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList })
    this.props.onFileListChanage(this.props.type,fileList)
  };

  render() {
    // 上传缩略图
    const { previewVisible, previewImage, fileList = [] } = this.state;
    const { limit, showRemoveIcon = true } = this.props;
    console.log('fileList',fileList)
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    const url = this.props.url ? this.props.url : `${BaseUrl}/classroom/uploadController/perfect/uploadPhoto`
    return (
        <div className = {styles.main}>
              <div className="clearfix">
                <Upload
                  showUploadList={{showRemoveIcon}}
                  accept="image/*"
                  style={{width:200}}
                  action={ url }
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                >
                  {fileList.length >= limit ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        </div>
    );
  }
}

export default Avatar;
