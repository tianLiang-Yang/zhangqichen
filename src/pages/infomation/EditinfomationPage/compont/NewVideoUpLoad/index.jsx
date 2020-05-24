import React from 'react';
import {Upload, Button, message} from 'antd';
import { BaseUrl } from '@/utils/Constant'
import { UploadOutlined } from '@ant-design/icons';
import request from "@/utils/request";

class NewVideoUpLoad extends React.Component {
  state = {
    fileList: [],
    uploading: false,
  };

  onChange = (info) => {
    if (info.file.status !== 'uploading') {
      // console.log(info.file.response, info.fileList);
    }
    if (info.file.status === 'done') {
      console.log(info.file.response, info.fileList);
      this.setState({fileList: info.fileList})
      console.log('上传视频', info.file.response.data);
      this.props.onResult(info.file.response.data, info.fileList[0].originFileObj)
      message.success(`${info.file.name} 上传成功`);

    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  }


  //
  // onChange = (e)=>{
  //   const file = e.target.files[0]
  //   if(!file){
  //     message.info("文件为空");
  //     return
  //   }
  //   e.target.value = '' // 上传之后还原
  //   const formData = new FormData()
  //   formData.append('file', file)
  //   fetch(`${BaseUrl}/classroom/uploadController/perfect/uploadPhoto`, {
  //     method: "POST",
  //     body: formData,
  //     mode: 'no-cors', // 跨域
  //     // credentials: 'include',
  //   }).then(r  =>{
  //     console.log('',r)
  //   })
  // }

  render() {
    const { uploading, fileList } = this.state;
    const props = {
      name: 'file',
      action: `${BaseUrl}/classroom/uploadController/perfect/uploadPhoto`,
      headers: {
        authorization: 'authorization-text',
      },

    }

    return (
      <div style={{marginTop: fileList.length > 0 ? -50 : 0}}>
        <Upload
          accept="video/*"
          {...props}
          onChange={ this.onChange }
        >
          <span style={{display: fileList.length > 0 ? 'none': 'block'}}>
            <Button>
              <UploadOutlined /> 点击上传视频
            </Button>
          </span>
        </Upload>
      </div>
    );
  }
}

export default NewVideoUpLoad;
