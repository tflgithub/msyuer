// pages/infolist/infolist.js
const request = require('../../api/request.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageWidth: wx.getSystemInfoSync().windowWidth, //图片宽度
    typeId: [],
    foods: [],
    moment: [],
    data: {
      "lastTimeStamp": 1533805768335,
      "barUrl": "../../image/list_bar.png",
      "barTitle": "测试bar Title",
      "items": [{
          "duration": "04:30",
          "phoUrl": "../../image/list_bar.png",
          "detailId": "234rrfgeh920",
          "clickNum": "2366",
          "title": "abc测试",
          "likeNum": "1266"
        },
        {
          "duration": "04:30",
          "phoUrl": "../../image/list_bar.png",
          "detailId": "234rrfgeh920",
          "clickNum": "2366",
          "title": "abc测试",
          "likeNum": "1266"
        },
        {
          "duration": "04:30",
          "phoUrl": "../../image/list_bar.png",
          "detailId": "234rrfgeh920",
          "clickNum": "2366",
          "title": "abc测试",
          "likeNum": "1266"
        },
        {
          "duration": "04:30",
          "phoUrl": "../../image/list_bar.png",
          "detailId": "234rrfgeh920",
          "clickNum": "2366",
          "title": "abc测试",
          "likeNum": "1266"
        },
        {
          "duration": "04:30",
          "phoUrl": "../../image/list_bar.png",
          "detailId": "234rrfgeh920",
          "clickNum": "2366",
          "title": "abc测试",
          "likeNum": "1266"
        },
        {
          "duration": "04:30",
          "phoUrl": "../../image/list_bar.png",
          "detailId": "234rrfgeh920",
          "clickNum": "2366",
          "title": "abc测试",
          "likeNum": "1266"
        },
        {
          "duration": "04:30",
          "phoUrl": "../../image/list_bar.png",
          "detailId": "234rrfgeh920",
          "clickNum": "2366",
          "title": "abc测试",
          "likeNum": "1266"
        },
        {
          "duration": "04:30",
          "phoUrl": "../../image/list_bar.png",
          "detailId": "234rrfgeh920",
          "clickNum": "2366",
          "title": "abc测试",
          "likeNum": "1266"
        },
        {
          "duration": "04:30",
          "phoUrl": "../../image/list_bar.png",
          "detailId": "234rrfgeh920",
          "clickNum": "2366",
          "title": "abc测试",
          "likeNum": "1266"
        },
        {
          "duration": "04:30",
          "phoUrl": "../../image/list_bar.png",
          "detailId": "234rrfgeh920",
          "clickNum": "2366",
          "title": "abc测试",
          "likeNum": "1266"
        }, {
          "duration": "04:30",
          "phoUrl": "../../image/list_bar.png",
          "detailId": "234rrfgeh920",
          "clickNum": "2366",
          "title": "abc测试",
          "likeNum": "1266"
        },
      ],
      "haveNext": true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.typeId);
    console.log(options.foodId);
    this.setData({
      typeId: [options.typeId],
      foods:[options.foodId]
    })
    wx.setNavigationBarTitle({
      title: this.data.data.barTitle,
    })
    request.getVedioList(this.data.typeId, this.data.foods, 0, 10, function(res) {
      this.setData({
        data: res.data
      })
    }, function(res) {

    })
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
    var that = this;
    wx.showNavigationBarLoading();
    request.getVedioList(this.data.typeId, this.data.foods, this.data.data.lastTimeStamp, 10, function(res) {
      that.setData({
        moment: res.data
      });
      // 设置数组元素
      that.setData({
        moment: that.data.moment
      });
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    request.getVedioList(this.data.typeId, this.data.foods, this.data.data.lastTimeStamp, 10, function(res) {
      var moment_list = that.data.moment;
      for (var i = 0; i < res.data.items.length; i++) {
        moment_list.push(res.data.items[i]);
      }
      // 设置数据
      that.setData({
        moment: that.data.moment
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})