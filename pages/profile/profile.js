// pages/profile/profile.js
const request = require('../../utils/wxRequest.js');
var wxapi = require("../../api/base.js").wxapi;
const api = require('../../api/config.js').api
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: '../../image/ic_logo.png',
      nickName: 'TFL',
      mobile: '13418463415'
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that=this
    wxapi('getSetting').then(res => {
      if (res.authSetting['scope.userInfo']) {
        this.onRetry()
      }
    })
  },
  onShow:function(){
    wxapi('getSetting').then(res => {
      if (!res.authSetting['scope.userInfo'])
        wx.reLaunch({
          url: '../auth/auth',
        })
    })
  },
  onRetry: function() {
    var that = this
    request.fetch(api.getUserInfo).then(data => {
      var param = {
        avatarUrl: data.data.avatarUrl,
        nickName: data.data.nickName,
        mobile: data.data.mobile
      }
      that.setData(param)
    }).catch(e => {
      wx.reLaunch({
        url: '../bindaccount/bindaccount'
      })
    })
  }
})