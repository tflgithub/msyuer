// pages/profile/works/index.js
const request = require('../../../utils/wxRequest.js')
const api=require('../../../api/config.js').api
import pageState from '../../../common/pageState/pageState.js'
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: false,
    showNoMore: false,
    items: [],
    pageSize: 10,
    currentPage: 0,
    haveNext: false,
    hideModal: true,
    itemDetail: {},
    itemIndex: -1
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
  getData: function() {
    var that = this
    pageState(that).loading()
    var postData={
      lastStamp:this.data.currentPage,
      pageSize:this.data.pageSize
    }
    request.fetch(api.getUserWorks,postData).then(res => {
      if (res.data.items.length === 0) {
        pageState(that).empty('还没有发布作品哦～', '../../../image/ic_kongbai.png')
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
    var postData = {
      lastStamp: this.data.currentPage,
      pageSize: this.data.pageSize
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
  deleteWork: function(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    console.log("要删除的" + id)
    this.doDelete(id, index)
  },
  doDelete: function(id, index) {
    var that = this
    wx.showModal({
      title: '温馨提示',
      content: '删除后将不能恢复，确定是要删除吗？',
      confirmColor: '#000000',
      cancelColor: '#808080',
      success: function(sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          request.fetch(api.deleteWorks, { workId:id}).then(res => {
            var items = that.data.items
            items.splice(index, 1)
            if (items.length === 0) {
              pageState(that).empty('还没有发布作品哦～', '../../../image/ic_empty_zp.png')
            } else {
              that.setData({
                items: items
              })
            }
          }).catch(res => {
            util.showToast(res, 'none', 2000)
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  showDetail: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    this.setData({
      hideModal: false,
      itemDetail: that.data.items[index],
      itemIndex: index
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src
    var imageUrls = this.data.itemDetail.workUrls
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: imageUrls // 需要预览的图片http链接列表
    })
  },
  modalConfirm: function(e) {
    this.setData({
      hideModal: true
    })
    this.doDelete(this.data.itemDetail.workId, this.data.itemIndex)
  },
  modalCancel: function(e) {
    console.log('点击了取消')
    this.setData({
      hideModal: true
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