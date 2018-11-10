var wxapi = require("../api/base.js").wxapi;
var api = require("../api/config.js").api;
const method = {
  post: "POST",
  get: "GET"
}
function fetch(url, data = '', method = 'POST') {
  return new Promise((resole, reject) => {
    wxapi("getNetworkType")
      .then(res => {
        if (res.networkType == "none") {
          wx.showToast({
            title: '网络好像不太好哦，请稍候再试',
            icon: "none"
          })
        } else {
          wxapi("request", {
            url: api.base_url + url,
            header: {
              'ms-token':wx.getStorageSync('token'),
              'content-type': 'application/json' // 默认值
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
                  .then(res => fetch({
                    url: api.login,
                    data: {
                      code: res.code
                    },
                  })
                  )
                  .then(res => {
                    if (res.data.code == 0) {
                      //登录成功，重新请求一次
                      wx.setStorageSync('token', res.data.token)
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
                          } else {
                            reject(res.data)
                          }
                        })
                    }
                  })
              } else if (res.data.code == 0) {
                //成功
                resole(res.data)
              } else {
                reject('服务器开小差啦～')
              }
            }).catch(res => {
              reject('服务器开小差啦～')
            })
        }
      })
  })
}
module.exports = { fetch, method }