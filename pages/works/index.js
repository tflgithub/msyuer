// pages/works/index.js
const request = require('../../utils/wxRequest.js');
var wxapi = require("../../api/base.js").wxapi;
const api = require('../../api/config.js').api;
import pageState from '../../common/pageState/pageState.js'
const util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    courseId: null,
    works: [],
    pageSize: 15,
    currentPage: 0,
    haveNext: false,
    url: api.getWorks
  },
  loadData: function() {
    this.onRetry()
  },
  onRetry: function() {
    var that = this;
    var postData = {
      courseId: this.data.courseId,
      pageSize: that.data.pageSize
    }
    if (this.data.courseId) {
      this.setData({
        url: api.getCourseWorks
      })
    }
    pageState(that).loading()
    request.fetch(this.data.url, postData, request.method.post, false).then(data => {
      console.log(JSON.stringify(data))
      pageState(that).finish()
      that.setData({
        works: data.data.items,
        currentPage: data.data.lastStamp,
        haveNext: data.data.haveNext,
      })
    }).catch(e => {
      console.log(JSON.stringify(e))
      util.showToast(e, 'none', 2000)
      pageState(that).error()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.setData({
        courseId: options.id
      })
    }
    this.loadData()
  },
  onPullDownRefresh: function(e) {
    var that = this;
    wx.showNavigationBarLoading()
    var postData = {
      courseId: that.data.courseId,
      pageSize: that.data.pageSize
    }
    request.fetch(this.data.url, postData, request.method.post, false).then(data => {
      console.log(JSON.stringify(data))
      wx.stopPullDownRefresh()
      that.setData({
        works: data.data.items,
        currentPage: data.data.lastStamp,
        haveNext: data.data.haveNext,
      })
      wx.hideNavigationBarLoading()
    }).catch(e => {
      console.log(JSON.stringify(e))
      util.showToast(e, 'none', 2000)
      wx.hideNavigationBarLoading()
    })
  },
  getMoreData: function() {
    var that = this
    var postData = {
      lastStamp: this.data.currentPage,
      pageSize: this.data.pageSize,
      courseId: that.data.courseId
    }
    wx.showLoading({
      title: '正在努力加载...',
    })
    request.fetch(this.data.url, postData, request.method.post, false).then(data => {
      wx.hideLoading()
      var list = that.data.works;
      list = list.concat(data.data.items);
      that.setData({
        works: list,
        haveNext: data.data.haveNext,
        currentPage: data.data.lastStamp
      })
    }).catch(res => {
      wx.hideLoading()
      util.showToast(res, 'none', 2000)
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.haveNext) {
      this.getMoreData()
    } else {
      util.showToast('没有更多啦～', 'none', 2000)
    }
  }
})