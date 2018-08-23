// pages/infolist/infolist.js
const request = require('../../api/request.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageWidth: wx.getSystemInfoSync().windowWidth, //图片宽度
    showLoading: false,
    showNoMore: false,
    items: [],
    typeId: [],
    foodId: [],
    data: {},
    pageSize: 10,
    showTip: '正在加载...'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("月份:" + options.typeId);
    console.log("辅食:" + options.foodId);
    if (options.typeId) {
      this.data.typeId = [options.typeId]
    }
    if (options.foodId) {
      this.data.foodId = [options.foodId]
    }
    var that = this;
    request.getVedioList(this.data.typeId, this.data.foodId, 0, this.data.pageSize, function(res) {
      if (res.data.barTitle) {
        wx.setNavigationBarTitle({
          title: res.data.barTitle,
        })
      }
      if (res.data.items.length === 0) {
        that.setData({
          showTip: '暂无数据'
        })
      }
      that.setData({
        data: res.data,
        items: res.data.items
      })
    }, function(res) {

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
    var that = this
    that.data.showNoMore = false
    wx.showNavigationBarLoading();
    request.getVedioList(this.data.typeId, this.data.foodId, 0, this.data.pageSize, function(res) {
      that.setData({
        data: res.data,
        items: res.data.items
      });
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    if (!that.data.showNoMore && that.data.data.haveNext) {
      this.showLoading = true
      request.getVedioList(this.data.typeId, this.data.foodId, this.data.data.lastTimeStamp, this.data.pageSize, function(res) {
        that.showLoading = false
        var list = that.data.items;
        if (res.data.items.length > 0) {
          list = list.concat(res.data.items);
        }
        that.setData({
          items: list,
          data: res.data
        })
      }, function(res) {
        that.showLoading = false
      })
    } else {
      that.setData({
        showNoMore: true
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})