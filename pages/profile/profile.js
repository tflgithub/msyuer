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
    isBindMobile: null,
    mobile: '',
    hadMsg: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      isBindMobile: app.globalData.setUserInfo,
      hadMsg: app.globalData.hadMsg
    })
    this.onRetry()
  },
  onRetry: function() {
    var that = this
    console.log("是否绑定手机：" + app.globalData.setUserInfo)
    if (app.globalData.setUserInfo === 1) {
      request.getUserInfo().then(res => {
        that.setData({
          mobile: res.data.mobile
        })
      }).catch(res => {})
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  bindAccount: function() {
    wx.navigateTo({
      url: '../bindaccount/bindaccount?navigateBack=1',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.setUserInfo === 1) {
      this.setData({
        isBindMobile: 1
      })
    }
  },
  readMsg: function() {
    app.globalData.hadMsg = false
    this.setData({
      hadMsg: app.globalData.hadMsg
    })
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