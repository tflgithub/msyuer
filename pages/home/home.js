// pages/home.js
const request = require('../../api/request.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //bar data
    barItems: [],
    mainItem: {},
    autoplay: true,
    interval: 5000,
    duration: 1000,
    current: 0
  },
  gotoDetail: function(e) {
    var item = e.currentTarget.dataset.id;
    console.log(JSON.stringify(item))
    if (item.type === "2") {
      wx.navigateTo({
        url: `../detail/detail?id=${item.id}`
      })
    } else if (item.type === "1") {
      wx.navigateTo({
        url: `../infolist/infolist?typeId=${item.id}`
      })
    } else {
      wx.navigateTo({
        url: `../infolist/infolist?foodId=${item.id}`
      })
    }
  },
  goPlay: function(e) {
    wx.navigateTo({
      url: `../detail/detail?id=${e.currentTarget.dataset.id}`
    })
  },
  /**图片轮播改变 */
  swiperChange(e) {
    this.setData({
      current: e.detail.current
    })
  },
  getMore: function(e) {
    wx.navigateTo({
      url: `../infolist/infolist?typeId=${e.currentTarget.dataset.id}`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    request.getHomeBar(function (res) {
      console.log(JSON.stringify(res));
      that.setData({
        barItems: res.data
      })
    }, function (res) { })
    request.getHomeVedio(function (res) {
      that.setData({
        mainItem: res.data
      })
    }, function (res) {

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