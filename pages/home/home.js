// pages/home.js
const request = require('../../utils/wxRequest.js')
const api = require('../../api/config.js').api
import pageState from '../../common/pageState/pageState.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bestCourses: null,
    newCourses: null
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
    pageState(this).loading()
    var that = this;
    request.fetch(api.index).then(data => {
      pageState(that).finish()
      that.setData({
        bestCourses: data.data.items[0],
        newCourses: data.data.items[1]
      })
    }).catch(e => {
      pageState(this).error(e)
    })
  }
})