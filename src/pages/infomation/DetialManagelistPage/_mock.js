/**
 * flag 1-待审核 2-已通过  4-已驳回 3-已取消
 * @type {Array}
 */
function getList(page, size, flag) {
  const list = [];
  console.log('mock', '初始化',page,size);
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 20; i++) {
    // eslint-disable-next-line default-case
        console.log('mock = flag', flag)
        list.push(
          {
            key: i,
            资讯名称: `北京疾控中心 ${i}`,
            分发人群: '所有人群',
            作者: '赵丽颖',
            资讯来源: `手动流入 ${i}`,
            所属分类: '疾控资讯',
            搜索关键字: '赵丽颖',
            是否访问:'0',
            访问量:'1002',
            是否阅读:'0',
            阅读: '10002',
            是否回复:'0',
            回复: '1000',
            是否点赞:'0',
            点赞: '11',
            是否转发:'0',
            转发: '133',
            权重: '133',
            状态: '停用',
            发布时间: '2014-12-24 23:12:00',
          });
  }
  console.log('mock-size：', list)
  return [list.slice((page - 1) * size, page * size), list.length];
}

function fetchList(req, res) {
  const params = req.query;
  const { page, size, flag } = params;
  const [object, total] = getList(page, size, flag);
  console.log('mock-fetchList', object)
  return res.json({
    data: {
      object,
      page,
      size,
      total,
    },
    code: 200,
    desc: '成功',
  });
}



export default {
  'GET  /api/fetchList': fetchList,
};
