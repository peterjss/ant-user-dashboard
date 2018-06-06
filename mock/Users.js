// const Mock = require('mockjs');
// let db = Mock.mock({'data|3-6': [{id: '@id', name: '@name', 'age|18-32': 1}]});
// module.exports = {
//   [`GET /api/users`](req, res) {
//     res.status(200).json(db);
//   }, [`POST /api/users`](req, res) {
//     let user = req.body;
//     console.log(req);
//     user.id = Mock.mock('@id');
//     db.data.push(user);
//     res.status(200).json(user);
//   }
// }

'use strict';

const qs = require('qs');
const mockjs = require('mockjs');  //导入mock.js的模块

const Random = mockjs.Random;  //导入mock.js的随机数

// 数据持久化   保存在global的全局变量中
let userTableListData = {};


if (!global.userTableListData) {
  const data = mockjs.mock({
    'data|100': [{
      'id|+1': 1,
      'name': () => {
        return Random.cname();
      },
      'username': () => {
        return Random.name();
      },
      'email': () => {
        return Random.email('visiondk.com');
      },
      "phone": /1(3[0-9]|4[57]|5[0-35-9]|7[01678]|8[0-9])\d{8}/,
      "Website": "hildegard.org",
      'created_at': () => {
        return Random.datetime('yyyy-MM-dd HH:mm:ss');
      },
      'updated_at': () => {
        return Random.datetime('yyyy-MM-dd HH:mm:ss');
      },
    }],
    page: {
      total: 100,
      current: 1,
    },
  });
  userTableListData = data;
  global.userTableListData = userTableListData;
} else {
  userTableListData = global.userTableListData;
}

module.exports = {
  //post请求  /api/users/ 是拦截的地址   方法内部接受 request response对象
  'GET /api/users' (req, res) {
    const page = qs.parse(req.query);
    console.log("=============="+page);
    const pageSize = page._limit || 10;
    const currentPage = page._page || 1;

    let data;
    let newPage;

    let newData = userTableListData.data.concat();

    //数据开始模拟
    if (page.field) {
      const d = newData.filter((item) => {
        return item[page.filed].indexOf(page.keyword) > -1;
      });

      data = d.slice((currentPage - 1) * pageSize, currentPage * pageSize);

      newPage = {
        current: currentPage * 1,
        total: d.length,
      };
    } else {
      data = userTableListData.data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
      userTableListData.page.current = currentPage * 1;

      newPage = {
        current: userTableListData.page.current,
        total: userTableListData.page.total,
      }
    }
    res.setHeader('x-total-count', newPage.total);
    
    setTimeout(() => {
      res.json(
        data
      );
    }, 200);
  }

}
