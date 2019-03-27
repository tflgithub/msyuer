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
    works: []
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
    pageState(this).loading()
    //课程
    request.fetch(api.getCoursesCategory, '', request.method.post, false).then(data => {
      console.log(JSON.stringify(data))
      that.setData({
        courses: data.data.items
      })
      pageState(that).finish()
    }).catch(e => {
      console.log(JSON.stringify(e))
      if (e == request.status.noNetWork) {
        pageState(that).error('您的网络好像出问题啦～')
      } else {
        pageState(that).error()
      }
    })
  },
  onShow:function(){
    wx.hideTabBar();
    var that=this
    //作业
    var data = {
      lastStamp: 0,
      pageSize: 6
    }
    request.fetch(api.getWorks, data, request.method.post, false).then(data => {
      console.log(JSON.stringify(data))
      that.setData({
        works: data.data.items
      })
    }).catch(e => {
      console.log(JSON.stringify(e))
    })
  },
  uploadWork: function(e) {
    this.setData({
      hideModal: !e.detail.showModal
    })
  },
  onPullDownRefresh: function(e) {
    var that = this;
    wx.showNavigationBarLoading()
    var data = {
      lastStamp: 0,
      pageSize: 6
    }
    request.fetch(api.getWorks, data).then(data => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      that.setData({
        works: data.data.items
      })
    }).catch(e => {
      util.showToast(e, 'none', 2000)
      wx.hideNavigationBarLoading()
    })
  }
})