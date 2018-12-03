var wxapi = require("../api/base.js").wxapi;
var api = require("../api/config.js").api;
const app=getApp()
const method = {
  post: "POST",
  get: "GET"
}
function fetch(url, data = '', method = 'POST') {
  console.log("请求:" + api.base_url+url+"参数:"+JSON.stringify(data))
  return new Promise((resole, reject) => {
    wxapi("getNetworkType")
      .then(res => {
        if (res.networkType == "none") {
          wx.showToast({
            title: '网络好像不太好哦，请稍候再试',
            icon: "none"
          })
        } else {
          var systemInfo=wx.getSystemInfoSync()
          console.log('当前系统：' + systemInfo.platform)
          wxapi("request", {
            url: api.base_url + url,
            header: {
              'ms-token':wx.getStorageSync('token'),
              'content-type': 'application/json', // 默认值
              'os-type': systemInfo.platform
            },
            data: data,
            method: method,
          }).then(res => {
              if (res.data.code == 403) {
                //认证失败，重新登录
                wx.showToast({
                  title: '验证失败,自动重试',
                  icon: "none"
                })
                wxapi("removeStorage", { key: "token", key:"setUserInfo"})
                  .then(() => wxapi("login"))
                  .then(res => fetch(api.login, { code: res.code, nickName: app.globalData.userInfo.nickName, avatarUrl: app.globalData.userInfo.avatarUrl}
                  )
                  )
                  .then(res => {
                    if (res.data.code == 0) {
                      //登录成功，重新请求一次
                      wx.setStorageSync('token', res.data.data.token)
                      console.log('重新登录获取token:' + wx.getStorageSync('token'))
                      wx.setStorageSync('setUserInfo', res.data.setUserInfo)
                      wxapi("request", {
                        url: api.base_url + url,
                        header: {
                          'ms-token':wx.getStorageSync('token'),
                          'content-type': 'application/json' // 默认值
                        },
                        data: data,
                        method: 'POST',
                      })
                        .then(res => {
                          if (res.data.code == 0) {
                            resole(res.data)
                            console.log(JSON.stringify(res.data))
                          } else {
                            reject(res.data)
                          }
                        })
                    }
                  })
              } else if (res.data.code == 0) {
                //成功
                resole(res.data)
                console.log(JSON.stringify(res.data))
              } else {
                console.log(JSON.stringify(res))
                reject('服务器开小差啦～')
              }
            }).catch(res => {
              console.log(JSON.stringify(res))
              reject('服务器开小差啦～')
            })
        }
      })
  })
}
module.exports = { fetch, method }