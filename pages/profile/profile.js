// pages/profile/profile.js
const request = require('../../utils/wxRequest.js');
var wxapi = require("../../api/base.js").wxapi;
const api = require('../../api/config.js').api
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: null,
    nickName: null,
    mobile: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (wx.getStorageSync('setUserInfo') == 1) {
      request.fetch(api.getUserInfo).then(data => {
        that.setData({
          avatarUrl: data.data.avatarUrl,
          nickName: data.data.nickName,
          mobile: data.data.mobile
        })
      })
    }
  },
  onShow: function() {
    wxapi('getSetting').then(res => {
      if (!res.authSetting['scope.userInfo']) {
        wx.reLaunch({
          url: '../auth/auth',
        })
      }
    })
    if (wx.getStorageSync('setUserInfo') == 2) {
      wx.navigateTo({
        url: '../bindaccount/bindaccount'
      })
    }
  }
})