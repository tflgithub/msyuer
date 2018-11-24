// pages/infolist/details.js
const request = require('../../utils/wxRequest.js')
const api = require('../../api/config.js').api
import pageState from '../../common/pageState/pageState.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {},
    items: [],
    showLoading: false,
    showNoMore: false,
    pageSize: 10,
    currentPage: 0,
    haveNext: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let param = {
      coverUrl: options.coverUrl,
      avatarUrl: options.avatarUrl,
      name: options.name,
      title: options.title,
      teacherId: options.teacherId
    }
    this.setData({
      item: param
    })
    this.onRetry()
  },
  onRetry: function() {
    this.getData()
  },
  getData: function() {
    var that = this
    pageState(that).finish()
    pageState(that).loading()
    var postData = {
      teacherId: this.data.item.teacherId,
      lastStamp: this.data.currentPage,
      pageSize: this.data.pageSize
    }
    request.fetch(api.getTeacherCourses, postData).then(res => {
      if (res.data.items.length === 0) {
        pageState(that).empty('没有课程～', '../../../image/ic_kongbai.png')
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
  getMoreData: function () {
    var that = this
    var postData = {
      teacherId: this.data.item.teacherId,
      lastStamp: this.data.currentPage,
      pageSize: this.data.pageSize
    }
    request.fetch(api.getTeacherCourses, postData).then(res => {
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
      that.setData({
        showLoading: false
      })
      util.showToast(res, 'none', 2000)
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