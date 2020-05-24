/**
 * @type {Array} 左边的列表
 */
function getList(pageNum, pageSize) {
  const list = [];
  console.log('mock', 'getList');
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 45; i++) {
    // eslint-disable-next-line default-case
        list.push({
          key: i,
          序号: i,
          字典类型: `字典类型${i}`,
          机构类型: '平台维护',
        })
  }
  return [list.slice((pageNum - 1) * pageSize, pageNum * pageSize), list.length];
}

/**
 * @type {Array} 向年轻列表
 */
function getRightList(pageNum, pageSize) {
  const list = [];
  console.log('mock', 'getList');
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 45; i++) {
    // eslint-disable-next-line default-case
    list.push({
      key: i,
      序号: i,
      字典类型: `字典类型${i}`,
      字典值: i,
      助记码: '名称',
      备注说明: '名称',
      中文名称: '名称',
      状态: i % 2 === 0 ? '1' : '0',
    })
  }
  return [list.slice((pageNum - 1) * pageSize, pageNum * pageSize), list.length];
}

function fetchList(req, res) {
  const params = req.query;
  const { pageNum, pageSize } = params;
  const [records, total] = getList(pageNum, pageSize);
  return res.json({
    code: 200,
    data: {
      object: records,
      pageNum,
      pageSize,
      total,
    },
    result: true,
    desc: '成功',
  });
}

function fetchDetialList(req, res) {
  const params = req.query;
  console.log('fetchDetialList--->',params)
  const { pageNum, pageSize } = params;
  const [records, total] = getRightList(pageNum, pageSize);
  return res.json({
    code: 200,
    data: {
      object: records,
      pageNum,
      pageSize,
      total,
    },
    result: true,
    desc: '成功',
  });
}

export default {
  'GET  /api/fetchList': fetchList,
  'GET  /api/fetchDetialList': fetchDetialList,
};
