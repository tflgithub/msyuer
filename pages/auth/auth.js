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
    wx.reLaunch({
      url: '../home/home'
    })
  },
  onShow: function() {

  },
  onLoad: function(options) {

  }
})