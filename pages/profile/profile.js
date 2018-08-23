// pages/profile/profile.js
const request = require('../../api/request.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: ''
    },
    isBindMobile: false,
    mobile: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    this.setData({
      userInfo: app.globalData.userInfo
    })
    if (app.globalData.setUserInfo === 1) {
      this.setData({
        isBindMobile: true
      })
      request.getUserInfo(function(res) {
        that.setData({
          mobile: res.data.mobile
        })
      }, function(res) {

      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  bindAccount: function() {
    wx.navigateTo({
      url: '../bindaccount/bindaccount',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})