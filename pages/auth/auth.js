var app = getApp();
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  login: function() {
    wx.reLaunch({
      url: '../unlock/help'
    })
  },
  onShow: function() {

  },
  onLoad: function() {

  }
})