/**
 * flag 1-待审核 2-已通过  4-已驳回 3-已取消
 * @type {Array}
 */
function getList(pageNum, pageSize, flag) {
  const list = [];
  console.log('mock', 'getList');
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 45; i++) {
    // eslint-disable-next-line default-case
    switch (Number(flag)) {
      case 1:
        console.log('mock = flag', flag)
        list.push(
          {
            key: i,
            医生Id: i,
            注册号: '12340',
            医生姓名: `张小话${i}`,
            性别: 1,
            年龄: 12,
            职称: '高级认证职业医生',
            类型: i % 2 === 0 ? 0 : 1, // 首次申请 1 驳回 0
            申请时间: i % 2 === 0 ? '1573550080' : '1568193280',
            最迟审核时间: '2019.10.9 20:10',
          })
        break;
      case 2:
        list.push({
          key: i,
          医生Id: i,
          注册号: 10444556,
          医生姓名: `张丽影${i}`,
          性别: 1,
          年龄: 12,
          职称: i % 2 === 0 ? '护士' : '高级职业技师',
          申请时间: '2019.10.9 20:10',
          申请通过时间: '2019.10.9 20:10',
          审核人: '赵丽颖',
        })
        break;
      case 3:
        list.push({
          key: i,
          医生Id: i,
          注册号: 10444556,
          医生姓名: `张丽影${i}`,
          性别: 1,
          年龄: 12,
          职称: i % 2 === 0 ? '护士' : '高级职业技师',
          申请时间: '2019.10.9 20:10:06',
          申请驳回时间: '2019.10.9 20:10:30',
          审核人: '赵丽颖',
          驳回原因: '职业医师证件模糊，无法辨识',
          限申: i % 2 === 0 ? '0' : '1',
        })
        break;
      case 4:
        list.push({
          key: i,
          医生Id: i,
          注册号: 10444556,
          医生姓名: ` 张丽影${i}`,
          性别: 1,
          年龄: 12,
          职称: i % 2 === 0 ? '护士' : '高级职业技师',
          封号时间: '2019.10.9 20:10:06',
          操作员: '赵丽颖',
          封号原因: '职业医师证件模糊，无法辨识.你知道的太',
        })
        break;
    }
  }
  console.log('mock', list)
  return [list.slice((pageNum - 1) * pageSize, pageNum * pageSize), list.length];
}

function fetchPassList(req, res) {
  const params = req.query;
  const { pageNum, pageSize, flag } = params;
  const [records, total] = getList(pageNum, pageSize, flag);
  console.log('mock', records)
  return res.json({
    data: {
      records,
      pageNum,
      pageSize,
      total,
    },
    result: true,
    desc: '成功',
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getDocoterInfo(id) {
  // const { dialogControl } = this.props;
  const url = 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2018939532,1617516463&fm=26&gp=0.jpg';
  const imgs = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 3; i++) {
    imgs.push({
      url,
    })
  }
  const data = {
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
    单选按钮: 2, // 1 - 通过 2 -驳回
    复选框: 1, // 1-勾选 0 -无勾选
    原因: '证件件模糊，医师名字看不清', // 原因
    imgList: imgs,
  }
  return data;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getDocoterHis(id) {
  // 今天的时间
  const day2 = new Date();
  day2.setTime(day2.getTime());
  const s2 = `${day2.getFullYear()} - ${day2.getMonth() + 1} - ${day2.getDate()}`;
  // eslint-disable-next-line no-plusplus,no-empty
  const data = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 19; i++) {
    data.push({
      审核人: `李霞${i}`,
      审核时间: s2,
      审核状态: 1, // 1-已通过 2 - 已驳回 3 - 已取消
      原因: '证件模糊',
    })
  }
  return data;
}

// 获取审核历史
function fetchDoctorInfo(req, res) {
  const params = req.query;
  const data = getDocoterInfo(params);
  console.log('mock', data)
  return res.json({
    data,
    result: true,
    desc: '成功',
  });
}

// 获取历史审核
function fetchDoctorHistory(req, res) {
  const params = req.query;
  const data = getDocoterHis(params);
  console.log('mock', data)
  return res.json({
    data,
    result: true,
    desc: '成功',
  });
}

export default {
  'GET  /api/fetchPassList': fetchPassList,
  'GET  /api/fetchDoctorInfo': fetchDoctorInfo,
  'Get  /api/fetchDoctorHistory': fetchDoctorHistory,
};
