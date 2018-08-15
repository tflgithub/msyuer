// pages/home.js
const request = require('../../api/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //bar data
    barItems: [{
        "id": "1",
        "url": "../../image/ic_banner.png"
      },
      {
        "id": "2",
        "url": "../../image/ic_banner.png"
      }
    ],
    mainItem: {
      "todayRecommend": {
        "title": "今日推荐",
        "items": [{
            "note": "为***定制",
            "phoUrl": "http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg",
            "detailId": "123",
            "title": "12个月宝宝的营养辅食妈妈必看"
          },
          {
            "note": "为***定制",
            "phoUrl": "http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg",
            "detailId": "234",
            "title": "12个月宝宝的营养辅食妈妈必看"
          },
          {
            "note": "为***定制",
            "phoUrl": "http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg",
            "detailId": "234",
            "title": "12个月宝宝的营养辅食妈妈必看"
          },
          {
            "note": "为***定制",
            "phoUrl": "http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg",
            "detailId": "234",
            "title": "12个月宝宝的营养辅食妈妈必看"
          }
        ]
      },
      list: [{
          "typeId": "9",
          "title": "9月哺食",
          "type": "1",
          "items": [{
            "phoUrl": "http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg",
            "detailId": "234rrfgfh900",
            "title": "abc测试"
          }, {
            "phoUrl": "http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg",
            "detailId": "234rrfgfh900",
            "title": "abc测试"
          }]
        },
        {
          "typeId": "6",
          "title": "6月哺食",
          "type": "1",
          "items": [{
            "phoUrl": "http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg",
            "detailId": "234rrfgfh900",
            "title": "abc测试"
          }, {
            "phoUrl": "http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg",
            "detailId": "234rrfgfh900",
            "title": "abc测试"
          }]
        }
      ]
    },
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    current: 0
  },
  gotoDetail: function(e) {
    wx.navigateTo({
      url: `../detail/detail?id=${e.currentTarget.dataset.id}`
    })
  },
  /**图片轮播改变 */
  swiperChange(e) {
    let current = e.detail.current;
  },

  getMore: function(e) {
    wx.navigateTo({
      url: `../infolist/infolist?typeId=${e.currentTarget.dataset.id}`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    request.getHomeBar(function(res) {
      this.setData({
        barItems: res.data
      })
    }, function(res) {})
    request.getHomeVedio(function(res) {
      this.setData({
        mainItem: res.data
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})