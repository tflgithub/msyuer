const wxapi = require("../../api/base.js").wxapi;
const api = require('../../api/config.js').api;
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  login: function() {
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
          wx.setStorageSync('token', res.data.data.token)
          wx.setStorageSync('setUserInfo', res.data.data.setUserInfo)
          console.log('登录成功：' + res.data.data.token)
          console.log('是否绑定' + res.data.data.setUserInfo)
          if (res.data.data.setUserInfo == 1) {
            var pages = getCurrentPages(); // 当前页面
            var beforePage = pages[pages.length - 2]; // 前一个页面
            console.log("前一个页面" + JSON.stringify(beforePage.route))
            wx.navigateBack({
              delta: 1,
              success: function() {
                if (beforePage.route == 'pages/profile/profile') {
                  beforePage.onLoad(); // 执行前一个页面的onLoad方法
                } else if (beforePage.route == 'pages/detail/detail') {
                  beforePage.loadData()
                }
              }
            })
          } else {
            wx.redirectTo({
              url: '../bindaccount/bindaccount',
            })
          }
        })
      })
    })
  }
})