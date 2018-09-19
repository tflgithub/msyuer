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
    viewedNum: '',
    needShareNum: 0,
    sharedNum: 0,
    uid: 0,
    buttonTxt: '邀请微信好友'
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
        uid: res.data.uid
      })
      request.getHelpInfo().then(res => {
        that.setData({
          needShareNum: res.data.needShareNum,
          sharedNum: res.data.sharedNum
        })
        if (that.data.needShareNum == that.data.sharedNum) {
          that.setData({
            viewedNum: '您已经完成解锁！'
          })
          app.globalData.canSee = true
        } else {
          that.setData({
            viewedNum: '您已经观看了' + res.data.viewedNum + '个菜谱，立即邀请好友助力解锁'
          })
        }
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
    var userInfos = [this.data.avatarUrl, this.data.nickName, this.data.uid]
    return {
      title: this.data.nickName + '请您来助力！',
      imageUrl: '../../image/share.png',
      path: 'pages/unlock/help?id=' + userInfos
    }
  }
})