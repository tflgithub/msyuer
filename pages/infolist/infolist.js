// pages/infolist/infolist.js
const request = require('../../utils/wxRequest.js')
const api = require('../../api/config.js').api
import pageState from '../../common/pageState/pageState.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showLoading: false,
    showNoMore: false,
    items: [],
    pageSize: 10,
    currentPage:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.onRetry()
  },
  onRetry: function() {
    this.getData()
  },
  getData: function() {
    pageState(this).loading()
    var that = this;
    request.fetch(api.getTeachers).then(data => {
      pageState(that).finish()
      that.setData({
        items: data.data.items
      })
    }).catch(e => {
      pageState(this).error(e)
    })
  },
  getMoreData:function(){
    var that = this
    var postData = {
      lastStamp: this.data.currentPage,
      pageSize: this.data.pageSize
    }
    request.fetch(api.getTeachers, postData).then(res => {
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
    if (!this.data.showNoMore && this.data.data.haveNext) {
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