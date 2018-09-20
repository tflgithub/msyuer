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
    mobile: null,
    hadMsg: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      hadMsg: app.globalData.hadMsg
    })
  },
  onRetry: function() {
    var that = this
    console.log("是否绑定手机：" + app.globalData.setUserInfo)
    if (app.globalData.setUserInfo === 1) {
      if (this.data.mobile == null) {
        request.getUserInfo().then(res => {
          that.setData({
            mobile: res.data.mobile
          })
        }).catch(res => {})
      }
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
    this.setData({
      isBindMobile: app.globalData.setUserInfo
    })
    this.onRetry()
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