import React from 'react'
import styles from './index.less'
import ForgetPwFrom from './components/froget-pw-from' // 表单
import IconFont from '@/components/IconFont';
import rightTopIcon from '@/img/bg_right_pw.jpg';
import { AppColor } from '@/utils/ColorCommom';

class ForgetPw extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

   render() {
     return (
       <div className={styles.main}>
         <div className={styles.first_div}>
           <span> <IconFont type = "iconyuechi" style={{ fontSize: '16px' }}/> <span> &nbsp; 修改登录密码 </span> </span>
           <span> <img src={rightTopIcon} alt = "加载失败"/> </span>
         </div>
         <div className={styles.second_div}>
           <IconFont type = "iconweibiaoti1" style={{ color: '#3A98C1', fontSize: '16px' }}/>
           <span> &nbsp;&nbsp; 王琰龙您好，欢迎您登录<span style={{ color: AppColor.Green }}>德佑健康管理平台</span>
             ，为了您的账户安全，建议您<span style={{ color: AppColor.Origin }}>立即修改密码</span>^-^
           </span>
         </div>
         <ForgetPwFrom/>
       </div>
     )
   }
}

export default ForgetPw;
