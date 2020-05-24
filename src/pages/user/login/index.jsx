import { Alert, Checkbox } from 'antd';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import styles from './style.less';
import appIcon from '@/img/app_icon.png';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents;

@connect(({ login, loading }) => ({
  submitting: loading.effects['login/login'],
}))
class Login extends Component {
  loginForm = undefined;

  state = {
    type: '1',
    autoLogin: true,
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked, // 是否自动刚登录
    });
  };

  handleSubmit = (err, values) => {
    console.log('登录value',values)
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      let params = {};
      if (type === '1') {
        // 账号登录
        params = {
          username: values.userName,
          password: values.password,
        };
      } else {
        // 验证码登录
        params = {
          phone: values.mobile,
          code: values.captcha,
        };
      }
      dispatch({
        type: 'login/login',
        payload: { ...params, type },
      });
    }
  };

  onTabChange = type => {
    this.setState({
      type,
    });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      console.log('onGetCaptcha', 'loginForm', this.loginForm);
      if (!this.loginForm) {
        return;
      }
      console.log('onGetCaptcha');

      this.loginForm.validateFields(['mobile'], {}, async (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;

          try {
            const success = await dispatch({
              type: 'login/getCaptcha',
              payload: values.mobile,
            });
            resolve(!!success);
          } catch (error) {
            reject(error);
          }
        }
      });
    });

  renderMessage = content => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const { userLogin, submitting } = this.props;
    console.log('userLogin', userLogin);
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <div className={styles.HLayout}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img style={{ width: '25px', height: '25px' }} src={appIcon} />
          <div style={{ marginLeft:'5px'}}>德佑健康 </div>
          <div style={{ width: '1px', height: '13px',marginTop:'5px', marginLeft:'5px',marginRight:'5px',background: '#333333' }} />
          <div>后台管理系统</div>
        </div>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          onCreate={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="1" tab="账户密码登录">
            <UserName
              name="userName"
              placeholder={`${'用户名'}: 张三`}
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${'密码'}: 100002`}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();

                if (this.loginForm) {
                  this.loginForm.validateFields(this.handleSubmit);
                }
              }}
            />
          </Tab>
          <Tab key="2" tab="手机号登录">
            <Mobile
              name="mobile"
              placeholder="手机号"
              rules={[
                {
                  required: true,
                  message: '请输入手机号！',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '手机号格式错误！',
                },
              ]}
            />
            <Captcha
              name="captcha"
              placeholder="验证码"
              countDown={10}
              onGetCaptcha={this.onGetCaptcha}
              getCaptchaButtonText="获取验证码"
              getCaptchaSecondText="秒"
              rules={[
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ]}
            />
          </Tab>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            <a
              style={{
                float: 'right',
              }}
              href=""
            >
              <Link className={styles.register} to="/user/forgetpw">
                忘记密码
              </Link>
            </a>
          </div>
          <Submit loading={submitting}>登录</Submit>
        </LoginComponents>
        <div className={styles.other}>
          <Link className={styles.register} to="/user/qrcodePage">
            通过德佑健康手机App登录
          </Link>
        </div>
      </div>
    );
  }
}

export default Login;
