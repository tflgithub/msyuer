// pages/profile/collect/index.js
const request = require('../../../api/request.js')
import pageState from '../../../common/pageState/pageState.js'
const app = getApp()
const {
  util
} = app
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: false,
    showNoMore: false,
    items: [{
        "duration": "16.23",
        "phoUrl": "http://g.hiphotos.baidu.com/image/pic/item/0dd7912397dda1443b5c9090bfb7d0a20cf486bf.jpg",
        "detailId": "234rrfgfh900",
        "clickNum": "2366",
        "title": "abc测试",
        "likeNum": "1266"
      },
      {
        "duration": "16.23",
        "phoUrl": "http://g.hiphotos.baidu.com/image/pic/item/0dd7912397dda1443b5c9090bfb7d0a20cf486bf.jpg",
        "detailId": "234rrfgfh900",
        "clickNum": "2366",
        "title": "abc测试",
        "likeNum": "1266"
      }
    ],
    pageSize: 10,
    currentPage: 0,
    haveNext:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getData()
  },
  onRetry: function() {
    this.getData()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  getData: function() {
    var that = this
    request.getUserLikes(this.data.currentPage, this.data.pageSize).then(res => {
      if (res.data.items.length === 0) {
        pageState(that).empty()
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
    request.getUserLikes(this.data.currentPage, this.data.pageSize).then(res => {
      that.showLoading = false
      var list = that.data.items;
      list = list.concat(res.data.items);
      that.setData({
        items: list,
        haveNext: res.data.haveNext,
        currentPage: res.data.lastStamp
      })
    }).catch(res => {
      that.showLoading = false
      util.showToast(res, 'none', 2000)
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.data.showNoMore = false
    wx.showNavigationBarLoading();
    this.getData()
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.showNoMore && this.data.haveNext) {
      this.showLoading = true
      this.getMoreData()
    } else {
      this.setData({
        showNoMore: true
      })
    }
  }
})