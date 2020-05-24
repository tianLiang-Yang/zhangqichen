import React from 'react'
import styles from './index.less'
import QRCode from 'qrcode.react'
import appIcon from '@/img/app_icon.png';
import { AppColor } from '@/utils/ColorCommom';
import IconFont from '@/components/IconFont';

class ForgetPw extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        value: '12',
    }
  }

   render() {
     return (
       <div className={styles.main}>
         <div className={styles.mainInner}>
           <div className={styles.first_div}>
             {/* eslint-disable-next-line jsx-a11y/alt-text */}
             <span> <img src={appIcon}/> <span> &nbsp; 佑健康 </span> </span>
           </div>
           <div className={styles.second_div}>
             <div>
               <QRCode
                 value={this.state.value} // value参数为生成二维码的链接
                 size={250} // 二维码的宽高尺寸
                 fgColor="#000000" // 二维码的颜色
               />
             </div>
           </div>
           <div className={styles.three_div}>
             <IconFont type = "iconweibiaoti1" style={{ fontSize: '16px' }}/>
             <span style = {{ fontSize: '12px' }}>&nbsp;请通过【德佑健康】app【扫一扫】扫验证码登录</span>
           </div>
           <span style = {{ fontSize: '12px' }}>
             &nbsp;不知道【扫一扫】在哪？
             <span style={{ color: AppColor.Green }}> 「查看」</span>
             </span>
         </div>
       </div>
     )
   }
}

export default ForgetPw;
