/* eslint-disable no-multi-str */
export default {
  'POST  /api/forms': (_, res) => {
    res.send({
      message: 'Ok',
    });
  },
  'GET  /api/prescription/search': (_, res) => {
    res.send({
      code: 200,
      data: [
        {
          name: '饮食处方1',
          type: '饮食处方',
        },
        {
          name: '西医疾病1',
          type: '西医疾病',
        },
        {
          name: '中医疾病1',
          type: '中医疾病',
        },
        {
          name: '西医疾病2',
          type: '西医疾病',
        },
      ],
    });
  },
};
