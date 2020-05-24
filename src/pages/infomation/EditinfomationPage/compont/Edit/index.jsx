import React from 'react';
import styles from './index.less';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import {BaseUrl} from "@/utils/Constant";
// https://braft.margox.cn/
//https://blog.csdn.net/qq_36400206/article/details/93752528
class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: BraftEditor.createEditorState('<p></p>'), // 设置编辑器初始内容
      outputHTML: '<p></p>'
    }
  }

  componentDidMount () {
    this.isLivinig = true
    // 3秒后更改编辑器内容
    // setTimeout(this.setEditorContentAsync, 3000)
  }

  componentWillUnmount () {
    this.isLivinig = false
  }

  handleChange = (editorState) => {

    this.setState({
      editorState,
      outputHTML: editorState.toHTML()
    },()=>{
      // 通知父组件富文本的变化
      this.props.onChanageEditHtmlListener(this.state.outputHTML);
    })
  }

   uploadFn = (param) => {

    const serverURL = `${BaseUrl}/classroom/uploadController/perfect/uploadPhoto`
    const xhr = new XMLHttpRequest
    const fd = new FormData()

    // libraryId可用于通过mediaLibrary示例来操作对应的媒体内容

    const successFn = (response) => {
      console.log('uploadFn', response)
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
        param.success({
          // url: xhr.responseText,
          url:  JSON.parse(xhr.responseText).data,
          meta: {
            id: 'xxx',
            title: 'xxx',
            alt: 'xxx',
            loop: false, // 指定音视频是否循环播放
            autoPlay: false, // 指定音视频是否自动播放
            controls: false, // 指定音视频是否显示控制栏
            // poster: 'http://xxx/xx.png', // 指定视频播放器的封面
            poster: null, // 指定视频播放器的封面
          },
        });

    };

    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)
    };

    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: 'unable to upload.',
      });
    };

    xhr.upload.addEventListener("progress", progressFn, false);
    xhr.addEventListener("load", successFn, false);
    xhr.addEventListener("error", errorFn, false);
    xhr.addEventListener("abort", errorFn, false);

    fd.append('file', param.file);
    xhr.open('POST', serverURL, true);
    xhr.send(fd);

  };

  render() {
    const { editorState, outputHTML } = this.state
    const editorProps = {
      height: 350,
      contentFormat: 'html',
      // initialContent: line ? line.introduction : '',
      media: {
        allowPasteImage: true, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
        image: true, // 开启图片插入功能
        video: false, // 开启视频插入功能
        uploadFn: this.uploadFn, // 指定上传函数，说明见下文
      },
    }
    return (
        <div className = {styles.main}>

          <div className="editor-wrapper">
            <BraftEditor
              { ...editorProps}
              value={editorState}
              onChange={this.handleChange}
            />
          </div>
          <h5>输出内容</h5>
          {/*<div className="output-content">{outputHTML}</div>*/}
        </div>
    );
  }
}

export default Edit;
