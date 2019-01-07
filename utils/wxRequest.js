var wxapi = require("../api/base.js").wxapi;
var api = require("../api/config.js").api;
const method = {
  post: "POST",
  get: "GET"
}

function fetch(url, data = '', method = 'POST') {
  console.log("请求:" + api.base_url + url + "参数:" + JSON.stringify(data))
  return new Promise((resole, reject) => {
    wxapi("getNetworkType")
      .then(res => {
        if (res.networkType == "none") {
          wx.showToast({
            title: '网络好像不太好哦，请稍候再试',
            icon: "none"
          })
        } else {
          var systemInfo = wx.getSystemInfoSync()
          console.log('当前系统：' + systemInfo.platform)
          console.log('当前登录token：' + wx.getStorageSync('token'))
          if (wx.getStorageSync('token')) {
            wxapi("request", {
              url: api.base_url + url,
              header: {
                'ms-token': wx.getStorageSync('token'),
                'content-type': 'application/json', // 默认值
                'os-type': systemInfo.platform
              },
              data: data,
              method: method,
            }).then(res => {
              if (res.data.code == 403) {
                //认证失败，重新登录
                console.log('token错误')
                reLoginFetch(url, data, resole, reject)
              } else if (res.data.code == 0) {
                //成功
                resole(res.data)
              } else {
                console.log(JSON.stringify(res))
                reject('服务器开小差啦～')
              }
            }).catch(res => {
              console.log(JSON.stringify(res))
              reject('服务器开小差啦～')
            })
          }
          else{
            reLoginFetch(url,data,resole,reject)
          }
        }
      })
  })
}

//重新登录、操作
function reLoginFetch(url, data, resole, reject) {
  wxapi("login").then(res => {
    console.log(JSON.stringify(res))
    if (res.code) {
      wxapi("getUserInfo").then(userInfoRes => {
        console.log("昵称：" + JSON.stringify(userInfoRes.userInfo.nickName) + "头像：" + JSON.stringify(userInfoRes.userInfo.avatarUrl))
        wxapi("request", {
          url: api.base_url + api.login,
          data: {
            code: res.code,
            nickName: userInfoRes.userInfo.nickName,
            avatarUrl: userInfoRes.userInfo.avatarUrl,
            iv: userInfoRes.iv,
            encryptedData: userInfoRes.encryptedData
          },
          method: 'POST',
        }).then(res => {
          console.log(res)
          if (res.data.code == 0) {
            var systemInfo = wx.getSystemInfoSync()
            wx.setStorageSync('token', res.data.data.token)
            wxapi("request", {
              url: api.base_url + url,
              header: {
                'ms-token': wx.getStorageSync('token'),
                'content-type': 'application/json', // 默认值
                'os-type': systemInfo.platform
              },
              data: data,
              method: 'POST',
            }).then(res => {
              console.log(JSON.stringify(res))
              if (res.data.code == 0) {
                resole(res.data)
              } else {
                reject('服务器开小差啦～')
              }
            })
          }
        })
      })
    }
  })
}
module.exports = {
  fetch,
  method
}