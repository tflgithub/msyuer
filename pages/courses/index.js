// pages/courses/index.js
const util = require('../../utils/util.js')
const request = require('../../utils/wxRequest.js');
const api = require('../../api/config.js').api;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    courses: [],
    pageSize: 10,
    currentPage: 0,
    haveNext: false,
    courseId:null
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    if(options.id)
    this.setData({
      courseId: options.id
    })
    var that = this
    wx.showLoading({
      title: '正在加载...',
    })
    request.fetch(api.getCoursesCategory, '', request.method.post, false).then(data => {
      wx.hideLoading()
      that.setData({
        courses: data.data.items
      })
    }).catch(e => {
      wx.hideLoading()
      console.log(JSON.stringify(e))
      util.showToast(e, 'none', 2000)
    })
  },
  chooseCourse: function(e) {
    var course = this.data.courses[e.currentTarget.dataset.index]
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      courseId: course.course.courseId,
      courseName: course.course.title
    })
    wx.navigateBack({
      delta: 1
    })
  },
  getMoreData: function() {
    var that = this
    var postData = {
      lastStamp: this.data.currentPage,
      pageSize: this.data.pageSize
    }
    wx.showLoading({
      title: '正在加载...',
    })
    request.fetch(api.getCoursesCategory, postData, request.method.post, false).then(data => {
      wx.hideLoading()
      var list = that.data.courses;
      list = list.concat(data.data.items);
      that.setData({
        courses: list,
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