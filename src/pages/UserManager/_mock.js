function getRoleData() {
  const data = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 19; i++) {
    data.push({
      id: i,
      用户名称: `李霞${i}`,
      创建时间: '2019-02-01 12:23',
      修改时间: '2019-02-01 12:23',
      创建人: `张宝${i}`,
      角色: '医生',
      角色描述: '医生有开药方的权限',
    })
  }
  return data;
}

function getuserData() {
  const data = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 19; i++) {
    data.push({
      用户名称: `李霞${i}`,
      创建时间: '2019-02-01 12:23',
      修改时间: '2019-02-01 12:23',
      创建人: `张宝${i}`,
      角色: 1, // 1-已通过 2 - 已驳回 3 - 已取消
      角色描述: '证件模糊',
    })
  }
  return data;
}
/**
 * @type {Array}
 */
function getList(pageNum, pageSize) {
  const list = [];
  console.log('mock', 'getList');
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 45; i++) {
        list.push(
          {
            key: i,
            用户Id: i,
            注册号: '12340',
            昵称: `天蚕土豆${i}z最好看号，嘴鸭最好看`,
            性别: 1,
            年龄: 102,
            真实姓名: `赵丽颖${i}`,
            所属机构: '中科软中科软中科软中科软',
            所属部门: '中科软中科软中科软中科软',
            手机号: '1501****2711', // 首次申请 1 驳回 0
            注册时间: '2019-04-26 11:04:32',
            认证: i % 2 === 0 ? 2 : 3,
            操作历史: i % 2 === 0,
            登录数: '3/10',
            status: i % 2 === 0,
          })
    }
  return [list.slice((pageNum - 1) * pageSize, pageNum * pageSize), list.length];
}

/**
* @type {Array}
*/
function getSysList(pageNum, pageSize) {
  const list = [];
  console.log('mock', 'getList');
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 45; i++) {
    list.push(
      {
        key: i,
        用户Id: i,
        注册号: '12340',
        昵称: `天蚕土豆${i}z最好看号，嘴鸭最好看`,
        用户名: 'daniel',
        性别: 1,
        年龄: 102,
        真实姓名: `赵丽颖${i}`,
        所属机构: '中科软中科软中科软中科软',
        所属部门: '中科软中科软中科软中科软',
        手机号: '1501****2711', // 首次申请 1 驳回 0
        注册时间: '2019-04-26 11:04:32',
        操作历史: i % 2 === 0,
        角色: '平台管理员',
        status: i % 2 === 0,
        是否绑定了手机号: i % 2 === 0,
      })
  }
  return [list.slice((pageNum - 1) * pageSize, pageNum * pageSize), list.length];
}


function fetchMoblieList(req, res) {
  const params = req.query;
  const { page, size, flag } = params;
  const [object, total] = getList(page, size, flag);
  console.log('mock', object)
  return res.json({
    data: {
      object,
      page,
      size,
      total,
    },
    code: 200,
    msg: '成功',
  });
}
function fetchSysList(req, res) {
  const params = req.query;
  const { page, size, flag } = params;
  const [object, total] = getSysList(page, size, flag);
  console.log('mock', object)
  return res.json({
    data: {
      object,
      page,
      size,
      total,
    },
    code: 200,
    msg: '成功',
  });
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getUserInfo(id) {
  // const { dialogControl } = this.props;
  const url = 'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1321463267,128419202&fm=26&gp=0.jpg';
  const data = {
    headUrl: url,
    注册号: '10001',
    昵称: 'daniel',
    姓名: '张东林',
    性别: '男',
    出生日期: '1977年03月21日',
    职称: '副主任医师',
    身份证号: '120000123000101',
    年龄: '42',
    所在部门: '北京市朝阳医院',
    所属机构: '北京市朝阳区',
    所在地: '北京市朝阳区',
    职业医生证号: '120000123000101',
    擅长: '心脑血管疾病',
    异常原因: '证件件模糊，医师名字看不清', // 原因
    注册时间: '2019-12-01 09:10:45',
    最后登录时间: '2019-12-01 09:10:45',
    注册IP: '54.21.22.12',
    最后登录IP: '54.21.22.12',
    最后更新时间: '2019-12-01 09:10:45',
    isDoctorId: true,
    isId: false,
    状态是否异常: 0,
  }
  return data;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function fetchUserInfo(req, res) {
  const params = req.query;
  const data = getUserInfo(params);
  console.log('mock', data)
  return res.json({
    data,
    result: true,
    msg: '成功',
    code: 200,
  });
}
function fetchRoleList(req, res) {
  const params = req.query;
  const data = getRoleData(params);
  console.log('mock', data)
  return res.json({
    data,
    result: true,
    desc: '成功',
  });
}

function fetchuserList(req, res) {
  const params = req.query;
  const data = getuserData(params);
  console.log('mock', data)
  return res.json({
    data,
    result: true,
    desc: '成功',
  });
}


export default {
  'GET  /api/fetchRoleList': fetchRoleList,
  'GET  /api/fetchuserList': fetchuserList,
  'GET  /api/fetchMoblieList': fetchMoblieList,
  'GET  /api/fetchUserInfo': fetchUserInfo,
  'GET  /api/fetchSysList': fetchSysList,
};
