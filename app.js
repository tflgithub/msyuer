//app.js
const wxapi = require("./api/base.js").wxapi;
const api = require('./api/config.js').api;
App({
  onLaunch: function() {
    var that = this;
    wxapi("login").then(loginRes => {
      wxapi("getUserInfo").then(userInfoRes => {
        console.log("昵称：" + JSON.stringify(userInfoRes.userInfo.nickName) + "头像：" + JSON.stringify(userInfoRes.userInfo.avatarUrl))
        wxapi("request", {
          url: api.base_url + api.login,
          header: {
            "content-Type": "application/json"
          },
          data: {
            code: loginRes.code,
            nickName: userInfoRes.userInfo.nickName,
            avatarUrl: userInfoRes.userInfo.avatarUrl
          },
          method: 'post',
        }).then(res => {
          wx.setStorage({
            key: 'token',
            data: res.data.data.token,
          })
          wx.setStorage({
            key: 'setUserInfo',
            data: res.data.data.setUserInfo,
          })
          console.log('登录成功：' + res.data.data.token)
          console.log('是否绑定' + res.data.data.setUserInfo)
        })
      })
    })
  },
  globalData: {
    setUserInfo: null,
    userInfo: null
  },
})