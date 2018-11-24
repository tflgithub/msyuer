// pages/detail/works.js
const request = require('../../utils/wxRequest.js')
const api = require('../../api/config.js').api
const wxapi = require("../../api/base.js").wxapi;
import pageState from '../../common/pageState/pageState.js'
const util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    courseId: null,
    showLoading: false,
    showNoMore: false,
    items: [],
    pageSize: 10,
    currentPage: 0,
    haveNext: false
  },
  onRetry: function() {
    this.getData()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      courseId: options.id
    })
    this.getData()
  },
  getData: function() {
    var that = this
    pageState(that).finish()
    pageState(that).loading()
    var postData = {
      lastStamp: this.data.currentPage,
      pageSize: this.data.pageSize,
      courseId: this.data.courseId
    }
    request.fetch(api.getWorks, postData).then(res => {
      that.setData({
        currentPage: res.data.lastStamp,
        haveNext: res.data.haveNext,
        items: res.data.items
      })
    }).catch(res => {
      pageState(that).error(res)
    })
  },
  getMoreData: function() {
    var that = this
    var postData = {
      lastStamp: this.data.currentPage,
      pageSize: this.data.pageSize,
      courseId: this.data.courseId
    }
    request.fetch(api.getWorks, postData).then(res => {
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
  dolike: function(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    console.log('workId:'+id+'index:'+index)
    var that = this;
    wxapi('getSetting').then(res => {
      if (!res.authSetting['scope.userInfo']) {
        wx.reLaunch({
          url: '../auth/auth',
        })
      } else {
        var isLike = 'items[' + index + '].isLike';
        var likeNum = 'items[' + index + '].likeNum';
        request.fetch(api.workLike, {
          workId: id
        }).then(res => {
          that.setData({
            [isLike]: true,
            [likeNum]: res.data.likeNum
          })
        }).catch(res => {
          util.showToast(res, 'none', 2000)
        })
      }
    })
  },
  unlike: function(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var that = this;
    wxapi('getSetting').then(res => {
      if (!res.authSetting['scope.userInfo']) {
        wx.reLaunch({
          url: '../auth/auth',
        })
      } else {
        var isLike = 'items[' + index + '].isLike';
        var likeNum = 'items[' + index + '].likeNum';
        request.fetch(api.workUnlike, {
          workId: id
        }).then(res => {
          that.setData({
            [isLike]: false,
            [likeNum]: res.data.likeNum
          })
        }).catch(res => {
          util.showToast(res, 'none', 2000)
        })
      }
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