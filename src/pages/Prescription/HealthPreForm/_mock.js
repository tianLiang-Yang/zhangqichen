export default {
  'POST  /api/forms': (_, res) => {
    res.send({
      message: 'Ok',
    });
  },
  'GET /api/prescription/getPrescriptionByName': (_, res) => {
    res.send({
      code: 200,
      data: {
        name: '鲫鱼竹笋汤',
        pinyin: 'jyzst',
        cure: '感冒病（风寒袭表证）',
        description: '鲜竹笋50克，鲫鱼1条。共煮汤调味服食可分次食用，3~5天为1疗程。',
        note:
          '【按】竹笋甘寒，有清热，化痰，镇静的功效。汪颗在《食物本草》中讲，竹笋“治小儿痘疹不出，煮粥食之，解毒”。鯽鱼有益气健脾，清热利水的作用。故本方有清热利湿的功效。',
        disease: '水痘',
        tcm: '天花',
        condition: '风热挟湿型(轻型)',
        useflag: 1,
        vip_flag: 0,
        remark: '',
      },
    });
  },
};
