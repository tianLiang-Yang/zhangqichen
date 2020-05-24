function getList(pageNum , pageSize , status) {
  const list = [];
  console.log('mock', '初始化',pageNum ,pageSize );
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 20; i++) {
    // eslint-disable-next-line default-case
    console.log('mock = flag', status)
    list.push(
      {
        id: `fake-list-${i}`,
        名称: `第${pageNum }页，第${i}调数据`,
        所属分类: '人群分类',
        创建方式: '紫铜',
        属性: 'dsnjfk',
        控制类型: 'zhen',
        人数: 20,
        创建时间:  '2019-01-09 20:20:00',
      }
      );
  }
  console.log('mock-size：', list)
  return [list.slice((pageNum  - 1) * pageSize , pageNum  * pageSize ), list.length];
}

function fetchList(req, res) {
  const params = req.query;
  const { pageNum, pageSize , status } = params;
  const [records, total] = getList(pageNum , pageSize , status);
  console.log('mock-fetchList', records)
  return res.json({
    data: {
      records,
      pageNum ,
      pageSize ,
      total,
    },
    code: 200,
    desc: '成功',
  });
}


export default {
  'GET  /api/manage_list': fetchList,
};
