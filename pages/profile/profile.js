// pages/profile/profile.js
const request = require('../../api/request.js');
const app = getApp()
import pageState from '../../common/pageState/pageState.js'
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
    mobile: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.isAuth().then(res => {
      this.onRetry()
    }).catch(res => {
      console.log(res)
      pageState(this).error(res)
    })
  },
  onRetry: function() {
    this.setData({
      userInfo: app.globalData.userInfo,
      isBindMobile: app.globalData.setUserInfo
    })
    var that = this
    console.log("是否绑定手机：" + app.globalData.setUserInfo)
    if (app.globalData.setUserInfo ===1) {
      request.getUserInfo().then(res=>{
        pageState(that).finish()
        that.setData({
          mobile: res.data.mobile
        })
      }).catch(res=>{
        pageState(that).error(res)
      })
    } else {
      pageState(that).finish()
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