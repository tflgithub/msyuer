// pages/infolist/infolist.js
const request = require('../../api/request.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageWidth: wx.getSystemInfoSync().windowWidth, //图片宽度
    showLoading: false,
    showNoMore: false,
    items: [],
    typeId: [],
    foodId: [],
    data: {},
    pageSize: 10,
    showTip: '正在加载...',
    where: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.where = options.where;
    if (this.data.where) {
      this.getData()
    } else {
      if (options.typeId) {
        this.data.typeId = [options.typeId]
      }
      if (options.foodId) {
        this.data.foodId = [options.foodId]
      }
      var that = this;
      request.getVedioList(this.data.typeId, this.data.foodId, 0, this.data.pageSize, function(res) {
        if (res.data.barTitle) {
          wx.setNavigationBarTitle({
            title: res.data.barTitle,
          })
        }
        if (res.data.items.length === 0) {
          that.setData({
            showTip: '暂无数据'
          })
        }
        that.setData({
          data: res.data,
          items: res.data.items
        })
      }, function(res) {

      })
    }
  },

  getData: function() {
    var that = this;
    switch (this.data.where) {
      case "hots":
        wx.setNavigationBarTitle({
          title: "热门视频",
        })
        request.getHotList(0, this.data.pageSize).then(res => {
          if (res.data.items.length === 0) {
            that.setData({
              showTip: '暂无数据'
            })
          }
          that.setData({
            data: res.data,
            items: res.data.items
          })
        }).catch(res => {
          console.log("获取热门视频失败:", res.msg)
        })
        break
      case "news":
        wx.setNavigationBarTitle({
          title: "最新视频",
        })
        request.getNewList(0, this.data.pageSize).then(res => {
          if (res.data.items.length === 0) {
            that.setData({
              showTip: '暂无数据'
            })
          }
          that.setData({
            data: res.data,
            items: res.data.items
          })
        }).catch(res => {
          console.log("获取最新视频失败:", res.msg)
        })
        break
      case "likes":
        wx.setNavigationBarTitle({
          title: "最喜爱视频",
        })
        request.getLikeList(0, this.data.pageSize).then(res => {
          if (res.data.items.length === 0) {
            that.setData({
              showTip: '暂无数据'
            })
          }
          that.setData({
            data: res.data,
            items: res.data.items
          })
        }).catch(res => {
          //console.log("获取最喜爱视频失败:", res.msg)
        })
        break
    }
  },

  getMoreData: function() {
    var that = this;
    switch (this.data.where) {
      case "hots":
        request.getHotList(this.data.data.lastTimeStamp, this.data.pageSize).then(res => {
          that.showLoading = false
          var list = that.data.items;
          list = list.concat(res.data.items);
          that.setData({
            items: list,
            data: res.data
          })
        }).catch(res => {
          console.log("获取热门视频失败:", res.msg)
          that.showLoading = false
        })
        break
      case "news":
        request.getNewList(this.data.data.lastTimeStamp, this.data.pageSize).then(res => {
          that.showLoading = false
          var list = that.data.items;
          list = list.concat(res.data.items);
          that.setData({
            items: list,
            data: res.data
          })
        }).catch(res => {
          console.log("获取最新视频失败:", res.msg)
          that.showLoading = false
        })
        break
      case "likes":
        request.getLikeList(this.data.data.lastTimeStamp, this.data.pageSize).then(res => {
          that.showLoading = false
          var list = that.data.items;
          list = list.concat(res.data.items);
          that.setData({
            items: list,
            data: res.data
          })
        }).catch(res => {
          console.log("获取点赞失败:", res.msg)
          that.showLoading = false
        })
        break
    }
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this
    that.data.showNoMore = false
    wx.showNavigationBarLoading();
    if (this.data.where) {
      this.getData()
    } else {
      request.getVedioList(this.data.typeId, this.data.foodId, 0, this.data.pageSize, function(res) {
        that.setData({
          data: res.data,
          items: res.data.items
        });
      })
    }
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    if (!this.data.showNoMore && this.data.data.haveNext) {
      this.showLoading = true
      if (this.data.where) {
        this.getMoreData()
      } else {
        request.getVedioList(this.data.typeId, this.data.foodId, this.data.data.lastTimeStamp, this.data.pageSize, function(res) {
          that.showLoading = false
          var list = that.data.items;
          list = list.concat(res.data.items);
          that.setData({
            items: list,
            data: res.data
          })
        }, function(res) {
          that.showLoading = false
        })
      }
    } else {
      this.setData({
        showNoMore: true
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})