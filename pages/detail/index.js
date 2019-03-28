// pages/detail/course/index.js
const WxParse = require('../../wxParse/wxParse.js')
const request = require('../../utils/wxRequest.js')
const wxapi = require("../../api/base.js").wxapi
const api = require('../../api/config.js').api
const util = require('../../utils/util.js')
import pageState from '../../common/pageState/pageState.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hideModal: true,
    disabledChoose: false,
    courseInfo: {},
    workInfo: {},
    summaryInfo: {},
    courseId: null
  },
  onRetry: function() {
    var that = this;
    pageState(that).loading()
    request.fetch(api.getCourseDetail, {
      courseId: this.data.courseId
    }, request.method.post, false).then(data => {
      pageState(that).finish()
      that.setData({
        courseInfo: data.data.courseInfo,
        workInfo: data.data.workInfo,
        summaryInfo: data.data.summaryInfo,
      })
      WxParse.wxParse('article', 'html', data.data.summaryInfo.replace('<img', '<img style="width:100%;height:auto"'), that)
    }).catch(e => {
      pageState(that).error()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      courseId: options.id
    })
    this.onRetry()
  },
  uploadWork: function() {
    this.setData({
      hideModal: false
    })
  },
  closeModal: function() {
    this.setData({
      hideModal: true
    })
  },
  askQuestion: function(e) {
    this.closeModal()
    var style = '0'
    wx.navigateTo({
      url: '../uploadworks/index?style=' + style + '&courseId=' + this.data.courseInfo.courseId + '&courseName=' + this.data.courseInfo.title
    })
  },
  shareWork: function(e) {
    console.log('dddddd')
    this.closeModal()
    var style = '1'
    wx.navigateTo({
      url: '../uploadworks/index?style=' + style + '&courseId=' + this.data.courseInfo.courseId + '&courseName=' + this.data.courseInfo.title
    })
  },
  showMore: function() {
    wx.navigateTo({
      url: '../works/index?id=' + this.data.courseInfo.courseId
    })
  }
})