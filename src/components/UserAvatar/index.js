import { Upload, Icon, message } from 'antd';
import {BaseUrl} from "@/utils/Constant";
import React from 'react';
import styles from './index.less'


class UserAvatar extends React.Component {
  state = {
    loading: false,
  };

  handleChange = info => {
    console.log('handleChangehandleChange',info)
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      if(info.file.response.code === 200)
      this.props.handleImageChange(info.file.response.data)
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl => {

          this.setState({
            imageUrl,
            loading: false,
          })
        }
      );

    }
  };


   getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }


  beforeUpload = (file) =>  {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className={styles.ButtonUp}> 上传</div>
      </div>
    );
    const { imageUrl } = this.state;
    const url = `${BaseUrl}/classroom/uploadController/perfect/uploadPhoto`

    return (
      <Upload
        accept="image/*"
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={ url}
        beforeUpload={this.beforeUpload}
        onChange={this.handleChange}
      >
        { imageUrl ?
          <img
            className={styles.imgStyle}
            src={imageUrl}
            alt="avatar"
          />
          :
          uploadButton}
      </Upload>
    );
  }
}

export default UserAvatar
