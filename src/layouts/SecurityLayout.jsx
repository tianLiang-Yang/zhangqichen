import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import PageLoading from '@/components/PageLoading';
import { ACCOUNT_ID } from '@/utils/Constant'
import { isEmpty, handleEmptyStr } from '@/utils/utils'

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  // eslint-disable-next-line consistent-return
  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
    if(!isEmpty(sessionStorage.getItem(ACCOUNT_ID))){
      if (dispatch) {
        dispatch({
          type: 'user/fetchCurrent',
          payload: {
            orgUserId: sessionStorage.getItem(ACCOUNT_ID),
          },
        });
      }
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading } = this.props;
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）

    const isLogin = handleEmptyStr(sessionStorage.getItem(ACCOUNT_ID));
    const queryString = stringify({
      redirect: window.location.href,
    });
    // console.log('SecurityLayout render: ',queryString,currentUser,)
    // if ((!isLogin && loading) || !isReady) {
    //   return <PageLoading />;
    // }

    if(!isLogin){ // 没有登录
      return <Redirect to={`/user/login?${queryString}`} />;
    }

    return children;
  }
}

export default connect(({ user, loading }) => ({
  // currentUser: user.currentUser,
  // loading: loading.models.user,
}))(SecurityLayout);
