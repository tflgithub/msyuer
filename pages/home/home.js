// pages/home.js
const request = require('../../utils/wxRequest.js')
const api = require('../../api/config.js').api
const util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isFresh: false,
    bestCourses: null,
    newCourses:null
  },
  goCoursesDetail: function(e) {
    wx.navigateTo({
      url: `../detail/detail?id=${e.currentTarget.dataset.id}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.onRetry()
  },
  onRetry: function() {
    this.loadData()
  },
  loadData: function() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    request.fetch(api.index).then(data => {
      wx.hideLoading();
      that.setData({
        bestCourses: data.data.items[0],
        newCourses: data.data.items[1]
      })
    }).catch(e => {
      console.log(JSON.stringify(e))
    })
  },
  scrolltolower: function() {
    var that = this;
    if (that.data.isFresh) {
      util.showToast('刷新太快啦!', 'none', 2000)
    } else {
      that.setData({
        isFresh: true
      })
      that.loadData();
    }
    setTimeout(function() {
      that.setData({
        isFresh: false
      })
    }, 500)
  }
})