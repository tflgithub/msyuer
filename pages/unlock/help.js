// pages/unlock/help.js
const request = require('../../api/request.js')
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: 'https://v.miskitchen.com/ic_hiabao.png',
    nickName: '夏天的风',
    uid: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("接受的参数：" + options.id)
    var params = options.id.split(',')
    this.setData({
      avatarUrl: params[0],
      nickName: params[1],
      uid: params[2]
    })
    app.isAuth().then(res => {
      request.getUserInfo().then(res => {
        if (that.data.uid === res.data.uid) {
          wx.reLaunch({
            url: 'invite',
          })
        }
      })
    }).catch(res => {
      console.log(res)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  unlock: function(e) {
    var that = this
    request.isHelp(this.data.uid).then(res => {
      if (res.data.isHelp) {
        wx.showModal({
          title: '温馨提示',
          content: '您已经助力过此好友哦～',
          showCancel: true,
          cancelText: '知道了',
          confirmText: '去首页',
          confirmColor: '#000000',
          cancelColor: '#808080',
          success: res => {
            if (res.confirm) {
              wx.reLaunch({
                url: '../home/home',
              })
            }
          }
        })
      } else {
        wx.reLaunch({
          url: '../bindaccount/bindaccount',
        })
      }
    }).catch(res => {

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