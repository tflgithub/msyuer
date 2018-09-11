// pages/unlock/invite.js
const app = getApp()
const request = require('../../api/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    nickName: '',
    viewedNum: 0,
    needShareNum: 0,
    sharedNum: 0,
    uid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    request.getUserInfo().then(res => {
      that.setData({
        avatarUrl: res.data.avatarUrl,
        nickName: res.data.nickName,
        uid:res.data.uid
      })
      request.getHelpInfo(res.data.uid).then(res => {
        that.setData({
          viewedNum: res.data.viewedNum,
          needShareNum: res.data.needShareNum,
          sharedNum: res.data.sharedNum
        })
      }).catch(res => {
        console.log('获取用户信息失败:' + res)
      })
    }).catch(res => {
      console.log('获取助力信息失败:' + res)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
    var userInfos = [this.avatarUrl, this.nickName,this.uid]
    return {
      title: '帮忙解锁',
      path: 'pages/unlock/help?id=' + userInfos
    }
  }
})