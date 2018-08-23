// pages/detail/detail.js
var WxParse = require('../../wxParse/wxParse.js');
const request = require('../../api/request.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    likeNum:'',
    hadLike:false,
    showCenterBtn: true,
    autoPlay: false,
    showCover: true,
    isWifi: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let app = getApp()
    var that = this;
    console.log("当前网络:" + app.globalData.netWorkType)
    if (app.globalData.setUserInfo=== 1) {
      this.setData({
        showCover: false
      })
    }
    if (app.globalData.netWorkType === 'wifi' && app.globalData.setUserInfo === 1) {
      this.setData({
        isWifi: true,
        autoPlay:true
      })
    }

    console.log("当前ID：" + options.id);
    request.getVedioDetail(options.id, function(res) {
      var article = res.data.detailInfo.summary;
      WxParse.wxParse('article', 'html', article, that, 5);
      that.setData({
        data: res.data,
        likeNum: res.data.detailInfo.likeNum,
        hadLike: res.data.detailInfo.hadLike
      })
    }, function(res) {

    })
  },
  gotoDetail: function(e) {
    wx.redirectTo({
      url: `../detail/detail?id=${e.currentTarget.dataset.id}`
    })
  },
  bindaccount: function() {
    wx.navigateTo({
      url: '../bindaccount/bindaccount',
    })
  },
  startPlay: function(e) {
    var videoContext = wx.createVideoContext('myVideo');
    videoContext.play();
    this.setData({
      isWifi: true
    })
  },
  dolike: function(e) {
    var that = this;
    var detailId = this.data.data.detailInfo.detailId;
    console.log(detailId);
    request.like(detailId, function(res) {
       that.setData({
          likeNum:res.data.likeNum,
          hadLike:true
       })
    }, function(res) {

    })
  },
  fenxiang: function(e) {
    wx.updateShareMenu({
      withShareTicket: true,
      success() {}
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

  }
})