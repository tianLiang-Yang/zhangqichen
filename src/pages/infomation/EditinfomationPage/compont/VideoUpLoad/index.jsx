import React from 'react';
import styles from './index.less';
import { Upload, message, Button  } from 'antd';
import { BaseUrl } from '@/utils/Constant'
import { UploadOutlined } from '@ant-design/icons';
import request from "@/utils/request";
// https://blog.csdn.net/weixin_34067049/article/details/91445841?depth_1-utm_source=distribute.pc_relevant.none-task&utm_source=distribute.pc_relevant.none-task
class VideoUpLoad extends React.Component {
  constructor(props) {
    super(props);
    this. state = {
      fileList:[],
      uploading: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    // this.setState({
    //   fileList: nextProps.fileList,
    // })
  }

  onChange = (info) => {
    if (info.file.status !== 'uploading') {
      console.log('myCustomRequest1',info.file, info.fileList);
      this.setState({ fileList: info.fileList })
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 视频上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 视频上传失败`);
    }
  }

  myCustomRequest = (option)=> {
    console.log('myCustomRequest',option.file)

      const formData = new FormData();
      formData.append('file', option.file);
      fetch(`${BaseUrl}/classroom/uploadController/perfect/uploadPhoto`, {
        method: 'post',
        body: formData,
      }).then(response => response.json())
        .then((data) => {
          console.log(data);
        });
  }

// 拦截文件上传
  beforeUploadHandle=(file)=> {
    console.log('beforeUploadHandle',file)
    this.setState(state => ({
      fileList: [...state.fileList, file],
    }),()=>{
      console.log('beforeUploadHandle',this.state.fileList)
    });
    return false;
  }

  render() {
    const { fileList } = this.state;

    return (
      <Upload
        // accept="video/*"
        // action={`${BaseUrl}/classroom/uploadController/perfect/uploadPhoto`}
        onChange={this.onChange}
        customRequest={this.myCustomRequest}
        beforUpload={()=>this.beforeUploadHandle}
      >
        {
          fileList.length === 0
            ?
            <Button>
              <UploadOutlined /> 上传视频
            </Button>
            :
            <div />
        }

      </Upload>
    );
  }
}

export default VideoUpLoad;
