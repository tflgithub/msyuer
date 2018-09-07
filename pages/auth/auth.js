var app = getApp();
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  login: function() {
    wx.reLaunch({
      url: '../profile/profile'
    })
  },
  onShow: function() {

  },
  onLoad: function() {

  }
})