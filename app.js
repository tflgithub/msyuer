//app.js
const wxapi = require("./api/base.js").wxapi;
const api = require('./api/config.js').api;
App({
  onLaunch: function() {
    var that = this;
    wxapi("login").then(loginRes => {
      wxapi("getUserInfo").then(userInfoRes => {
        console.log("昵称：" + JSON.stringify(userInfoRes.userInfo.nickName) + "头像：" + JSON.stringify(userInfoRes.userInfo.avatarUrl))
        that.globalData.userInfo = userInfoRes.userInfo;
        wxapi("request", {
          url: api.base_url + api.login,
          header: {
            "content-Type": "application/json"},
          data: { code: loginRes.code, nickName: userInfoRes.userInfo.nickName, avatarUrl: userInfoRes.userInfo.avatarUrl},
          method: 'post',
        }).then(res=>{
           wx.setStorageSync('token', res.data.data.token)
           wx.setStorageSync('setUserInfo', res.data.data.setUserInfo)
          console.log('登录成功：' + wx.getStorageSync('token'))
        })
      })
    })
  },
  globalData: {
    setUserInfo: null,
    userInfo: null
  },
})