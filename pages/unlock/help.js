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
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hiddenPage: true,
    tip: '助力好友解锁美味菜谱，米勺期待您的加入',
    isHelp: false,
    currentUid: 0,
    currentavatarUrl: '',
    currentNickName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var params = options.id.split(',')
    this.setData({
      avatarUrl: params[0],
      nickName: params[1],
      uid: params[2]
    })
    request.isHelp(parseInt(this.data.uid)).then(res => {
      if (res.data.isHelp) {
        that.setData({
          isHelp: true,
          tip: '您已经助力过此好友！'
        })
      }
    }).catch(res => {
      console.log('获取助力信息失败', e)
    })

    request.getUserInfo().then(res => {
      console.log('分享者ID:' + that.data.uid + '当前登录用户ID:' + res.data.uid)
      that.setData({
        currentUid: res.data.uid,
        currentavatarUrl: res.data.avatarUrl,
        currentNickName: res.data.nickName
      })
      if (that.data.uid == res.data.uid) {
        console.log('当前用户是自己')
        wx.reLaunch({
          url: 'invite',
        })
      } else {
        that.setData({
          hiddenPage: false
        })
        request.getHelpInfo(that.data.uid).then(res => {
          if (that.data.needShareNum == that.data.sharedNum) {
            that.setData({
              tip: '您的朋友已经完成解锁'
            })
          }
        }).catch(res => {
          console.log('获取用户助力信息失败:' + res)
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  unlock: function(e) {
    if (app.globalData.setUserInfo != 1) {
      wx.navigateTo({
        url: '../bindaccount/bindaccount?navigateBack=1'
      })
      return
    }
    if (this.data.isHelp) {
      return
    }
    request.help(parseInt(this.data.uid)).then(res => {
      wx.showModal({
        title: '温馨提示',
        content: '完成助力',
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
    }).catch(res => {
      util.showToast(res, 'none', 2000)
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
    var userInfos = [this.data.currentavatarUrl, this.data.currentNickName, this.data.currentUid]
    return {
      title: this.data.currentNickName + '请您来助力！',
      imageUrl: '../../image/share.png',
      path: 'pages/unlock/help?id=' + userInfos
    }
  }
})