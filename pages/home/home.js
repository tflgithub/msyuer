// pages/home.js
const request = require('../../api/request.js');
const app = getApp()
const {
  util
} = app
import pageState from '../../common/pageState/pageState.js'
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
    current: 0,
    hideModal: true
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
    app.isAuth().then(res => {
      this.loadData()
    }).catch(res => {
      console.log(res)
      pageState(this).error(res)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  onRetry: function() {
    this.loadData()
  },

  loadData: function() {
    pageState(this).loading()
    var that = this;
    Promise.all([request.getHomeBar(), request.getTodayRecommend(), request.getHotList(0, 4), request.getNewList(0, 4), request.getIndex()]).then(res => {
      pageState(that).finish()
      that.setData({
        barItems: res[0].data,
        toDayRecommend: res[1].data,
        hots: res[2].data,
        news: res[3].data,
        cooks: res[4].data
      })
    }).catch(res => {
      pageState(this).error(res)
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
    wx.showNavigationBarLoading()
    this.loadData()
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading()
    // 停止下拉动作
    wx.stopPullDownRefresh()
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
    return {
      title: '米勺美食',
      imageUrl: this.data.barItems[0].url,
      path: util.getCurrentPageUrl()
    }
  }
})