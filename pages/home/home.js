// pages/home.js
const request = require('../../utils/wxRequest.js')
const api = require('../../api/config.js').api
const util = require('../../utils/util.js')
const wxapi = require("../../api/base.js").wxapi;
import pageState from '../../common/pageState/pageState.js'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    hideModal: true,
    swiperIndex: 0,
    courses: [],
    recommends: [],
    works: [],
    pageSize: 10,
    currentPage: 0,
    haveNext: true
  },
  swiperChange(e) {
    const that = this;
    that.setData({
      swiperIndex: e.detail.current,
    })
  },
  goCoursesDetail: function(e) {
    console.log('课程id:' + e.currentTarget.dataset.id)
    wx.navigateTo({
      url: `../detail/index?id=${e.currentTarget.dataset.id}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.editTabbar()
    this.onRetry()
  },
  onRetry: function() {
    this.loadData()
  },
  loadData: function() {
    var that = this;
    //推荐
    var getRecommends = request.fetch(api.getRecommends, '', request.method.post, false)
    //课程
    var getCourses = request.fetch(api.getCoursesCategory, {
      lastStamp: this.data.currentPage,
      pageSize: this.data.pageSize
    }, request.method.post, false)
    //作业
    var getWorks = request.fetch(api.getWorks, {
      lastStamp: 0,
      pageSize: 10
    }, request.method.post, false)
    pageState(this).loading()
    Promise.all([getRecommends, getCourses,getWorks]).then((result) => {
      console.log(JSON.stringify(result))
      pageState(that).finish()
      that.setData({
        recommends: result[0].data.items,
        courses: result[1].data.items,
        currentPage: result[1].data.lastStamp,
        haveNext: result[1].data.haveNext,
        works: result[2].data.items
      })
    }).catch((e) => {
      if (e == request.status.noNetWork) {
        pageState(that).error('您的网络好像出问题啦～')
      } else {
        pageState(that).error()
      }
    })
  },
  onShow: function() {
    wx.hideTabBar();
  },
  uploadWork: function(e) {
    this.setData({
      hideModal: !e.detail.showModal
    })
  },
  onPullDownRefresh: function(e) {
    var that = this;
    wx.showNavigationBarLoading()
    //推荐
    var getRecommends = request.fetch(api.getRecommends, '', request.method.post, false)
    //课程
    var getCourses = request.fetch(api.getCoursesCategory, {
      lastStamp: this.data.currentPage,
      pageSize: this.data.pageSize
    }, request.method.post, false)
    //作业
    var getWorks = request.fetch(api.getWorks, {
      lastStamp: 0,
      pageSize: 10
    }, request.method.post, false)
    Promise.all([getRecommends, getCourses,getWorks]).then((result) => {
      console.log(JSON.stringify(result))
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      that.setData({
        recommends: result[0].data.items,
        courses: result[1].data.items,
        currentPage: result[1].data.lastStamp,
        haveNext: result[1].data.haveNext,
        works: result[2].data.items
      })
    }).catch((e) => {
      util.showToast(e, 'none', 2000)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })
  },
  getMoreData: function() {
    var that = this
    var postData = {
      lastStamp: this.data.currentPage,
      pageSize: this.data.pageSize
    }
    request.fetch(api.getCoursesCategory, postData, request.method.post, false).then(data => {
      console.log(data.data.lastStamp)
      var list = that.data.courses;
      list = list.concat(data.data.items);
      that.setData({
        courses: list,
        haveNext: data.data.haveNext,
        currentPage: data.data.lastStamp
      })
    }).catch(res => {
      util.showToast(res, 'none', 2000)
    })
  },
  onReachBottom: function() {
    if (this.data.haveNext) {
      this.getMoreData()
    }
  }
})