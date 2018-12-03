// pages/profile/courses/index.js
const request = require('../../../utils/wxRequest.js')
import pageState from '../../../common/pageState/pageState.js'
const api = require('../../../api/config.js').api
const util = require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showLoading: false,
    showNoMore: false,
    items: [],
    pageSize: 10,
    currentPage: 0,
    haveNext: false
  },
  getData: function() {
    var that = this
    pageState(that).loading()
    var postData = {
      pageSize: this.data.pageSize,
      lastStamp: this.data.currentPage
    }
    request.fetch(api.getUserBuyCourses, postData).then(res => {
      if (res.data.items.length === 0) {
        pageState(that).empty('还没有购买课程哦～', '../../../image/ic_kongbai.png')
      } else {
        pageState(that).finish()
        that.setData({
          currentPage: res.data.lastStamp,
          haveNext: res.data.haveNext,
          items: res.data.items
        })
      }
    }).catch(res => {
      pageState(that).error(res)
    })
  },
  getMoreData: function() {
    var that = this
    var postData = {
      pageSize: this.data.pageSize,
      lastStamp: this.data.currentPage
    }
    request.fetch(api.getUserBuyCourses, postData).then(res => {
      that.setData({
        showLoading: false
      })
      var list = that.data.items;
      list = list.concat(res.data.items);
      that.setData({
        items: list,
        haveNext: res.data.haveNext,
        currentPage: res.data.lastStamp
      })
    }).catch(res => {
      util.showToast(res, 'none', 2000)
    })
  },
  onRetry: function() {
    this.getData()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getData()
  },
  doWork: function(e) {
    var item = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../uploadworks/index?id='+item.courseId+'&title='+item.title,
    })
  },
  study: function(e) {
    wx.navigateTo({
      url: `../../detail/detail?id=${e.currentTarget.dataset.id}`
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.showNoMore && this.data.haveNext) {
      this.setData({
        showLoading: true
      })
      this.getMoreData()
    } else {
      this.setData({
        showNoMore: true
      })
    }
  }
})