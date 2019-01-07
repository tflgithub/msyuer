const wxapi = require("../../api/base.js").wxapi;
const api = require('../../api/config.js').api;
const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  login: function () {
    wxapi("getUserInfo").then(userInfoRes => {
      console.log("昵称：" + JSON.stringify(userInfoRes.userInfo.nickName) + "头像：" + JSON.stringify(userInfoRes.userInfo.avatarUrl))
      app.globalData.userInfo.avatarUrl = userInfoRes.userInfo.avatarUrl
      app.globalData.userInfo.nickName = userInfoRes.userInfo.nickName
      app.globalData.iv = userInfoRes.iv
      app.globalData.encryptedData = userInfoRes.encryptedData
      wx.navigateBack({
        delta: 1
      })
    })
    // var that = this;
    // wxapi("login").then(loginRes => {
    //   wxapi("getUserInfo").then(userInfoRes => {
    //     console.log(JSON.stringify(userInfoRes))
    //     console.log("昵称：" + JSON.stringify(userInfoRes.userInfo.nickName) + "头像：" + JSON.stringify(userInfoRes.userInfo.avatarUrl))
    //     wxapi("request", {
    //       url: api.base_url + api.login,
    //       header: {
    //         "content-Type": "application/json"
    //       },
    //       data: {
    //         code: loginRes.code,
    //         nickName: userInfoRes.userInfo.nickName,
    //         avatarUrl: userInfoRes.userInfo.avatarUrl,
    //         iv: userInfoRes.iv,
    //         encryptedData: userInfoRes.encryptedData
    //       },
    //       method: 'post',
    //     }).then(res => {
    //       console.log('登录成功：' + res.data.data.token)  
    //       wx.setStorageSync('token', res.data.data.token)
         
    //     })
    //   })
    // })
  }
})