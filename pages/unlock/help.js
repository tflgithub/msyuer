// pages/unlock/help.js
const request = require('../../api/request.js')
const app = getApp()
const {
  util
} = app
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    nickName: '',
    uid: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    if (options) {
      var params = options.id.split(',')
      this.setData({
        avatarUrl: params[0],
        nickName: params[1],
        uid: params[2]
      })
    }
    // request.getUserInfo().then(res => {
    //   console.log('分享者ID:' + that.data.uid + '当前登录用户ID:' + res.data.uid)
    //   if (that.data.uid == res.data.uid) {
    //     console.log('当前用户是自己')
    //     wx.reLaunch({
    //       url: 'invite',
    //     })
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  unlock: function(e) {
    if (app.globalData.setUserInfo != 1) {
      wx.navigateTo({
        url: '../bindaccount/bindaccount?path=' + util.getCurrentPageUrl(),
      })
      return
    }
    var that = this
  
    request.isHelp(parseInt(this.data.uid)).then(res => {
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
        request.help(parseInt(this.data.uid)).then(res => {
          util.showToast('助力成功！', 'none', 2000)
        }).catch(res => {
          util.showToast(res, 'none', 2000)
        })
      }
    }).catch(res => {
      console.log('获取助力信息失败', e)
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