var wxapi = require("../api/base.js").wxapi;
var api = require("../api/config.js").api;
const util = require('../utils/util.js')
const method = {
  post: "POST"
}
const status = {
  notFound: 505,
  noNetWork: 500,
  reLogin:403
}

function fetch(url, data = '', method = 'POST', needLogin = true) {
  console.log("请求:" + api.base_url + url + "参数:" + JSON.stringify(data))
  return new Promise((resole, reject) => {
    wxapi("getNetworkType")
      .then(res => {
        if (res.networkType == "none") {
          reject(status.noNetWork)
        } else {
          console.log('当前登录token：' + wx.getStorageSync('token'))
          if (needLogin && !wx.getStorageSync('token')) {
            reLoginFetch(url, data, resole, reject)
          } else {
            doRequest(url, data, resole, reject)
          }
        }
      })
  })
}

function doRequest(url, data, resole, reject) {
  var systemInfo = wx.getSystemInfoSync()
  console.log('当前系统：' + systemInfo.platform)
  wxapi("request", {
    url: api.base_url + url,
    header: {
      'ms-token': wx.getStorageSync('token'),
      'content-type': 'application/json', // 默认值
      'os-type': systemInfo.platform
    },
    data: data,
    method: method.post,
  }).then(res => {
    if (res.data.code == 403) {
      //认证失败，重新登录
      console.log('token错误')
      //reLoginFetch(url, data, resole, reject)
      util.showModal('温馨提示', '登录状态失效', false, '重新登录', res => {
        if (res.confirm) {
          reLoginFetch(url, data, resole, reject)
        }
      })
    } else if (res.data.code == 0) {
      //成功
      resole(res.data)
    } else if (res.data.code == 416) {
      reject(status.notFound)
    } else {
      console.log(JSON.stringify(res))
      reject('服务器开小差啦～')
    }
  }).catch(res => {
    console.log(JSON.stringify(res))
    if (res.errMsg.indexOf('timeout') > -1) {
      util.showModal('温馨提示', '网络请求超时', false, '重试', res => {
        if (res.confirm) {
          doRequest(url, data, resole, reject)
        }
      })
    } else {
      reject('服务器开小差啦～')
    }
  })
}

//重新登录、操作
function reLoginFetch(url, data, resole, reject) {
  wxapi("login").then(res => {
    console.log("微信登录Code："+JSON.stringify(res.code))
    if (res.code) {
      wxapi("getUserInfo").then(userInfoRes => {
        wxapi("request", {
          url: api.base_url + api.login,
          header: {
            "content-type": "application/json"
          },
          data: {
            code: res.code,
            nickName: userInfoRes.userInfo.nickName,
            avatarUrl: userInfoRes.userInfo.avatarUrl,
            iv:userInfoRes.iv,
            encryptedData:userInfoRes.encryptedData
          },
          method: "post",
        }).then(res => {
          wx.setStorageSync('token', res.data.data.token);
          console.log('登录成功!' + res.data.data.token)
          doRequest(url, data, resole, reject)
        })
      })
    }
  })
}
module.exports = {
  fetch,
  method,
  status
}