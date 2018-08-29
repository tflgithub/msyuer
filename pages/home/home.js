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
    toDayRecommend: {},
    hots: {},
    news: {},
    cooks: {},
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
      url: `../infolist/infolist?where=${e.currentTarget.dataset.id}`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    app.getLoginStatus().then(res => {
      var that = this;
      console.log(res)
      request.getHomeBar(function(res) {
        console.log(JSON.stringify(res));
        that.setData({
          barItems: res.data
        })
      }, function(res) {})

      request.getTodayRecommend().then(res => {
        that.setData({
          toDayRecommend: res.data
        })
      }).catch(res => {
        console.log("获取今日推荐失败:", res.msg)
      })

      request.getHotList(0, 4).then(res => {
        that.setData({
          hots: res.data
        })
      }).catch(res => {
        console.log("获取热门视频失败:", res.msg)
      })

      request.getNewList(0, 4).then(res => {
        that.setData({
          news: res.data
        })
      }).catch(res => {
        console.log("获取最新视频失败:", res.msg)
      })

      request.getIndex().then(res => {
        that.setData({
          cooks: res.data
        })
      }).catch(res => {
        console.log("获取烹饪方式失败：" + res.msg)
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