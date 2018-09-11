var app = getApp();
const request = require('../../api/request.js');
const {
  util
} = app
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  login: function() {
    request.login().then(res => {
      wx.reLaunch({
        url: '../home/home'
      })
    }).catch(res => {
      util.showToast('登录失败', 'none', 20000)
    })
  },
  onShow: function() {

  },
  onLoad: function() {

  }
})