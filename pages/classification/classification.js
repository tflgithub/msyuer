// pages/classification/classification.js
const request = require('../../api/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: true,
    interval: 5000,
    duration: 1000,
    current: 0,
    barItems: [{
      "id": "1",
      "url": "../../image/ic_banner.png"
    },
    {
      "id": "2",
      "url": "../../image/ic_banner.png"
    }
    ],
    month: [{
        imageUrl: '../../image/ic_six.png',
        text: '0-6月',
        value: '6'
      },
      {
        imageUrl: '../../image/ic_seven.png',
        text: '7月',
        value: '7'
      },
      {
        imageUrl: '../../image/ic_eight.png',
        text: '8月',
        value: '6'
      },
      {
        imageUrl: '../../image/ic_nine.png',
        text: '9月',
        value: '9'
      },
      {
        imageUrl: '../../image/ic_ten.png',
        text: '10月',
        value: '10'
      }, {
        imageUrl: '../../image/ic_eleven.png',
        text: '11月',
        value: '11'
      }, {
        imageUrl: '../../image/ic_twelve.png',
        text: '12月',
        value: '12'
      },
      {
        imageUrl: '../../image/ic_eighteen.png',
        text: '18月',
        value: '18'
      },
      {
        imageUrl: '../../image/ic_twenty_four.png',
        text: '24月',
        value: '24'
      }
    ],
    foods: [{
        imageUrl: '../../image/ic_steamed.png',
        text: '蒸',
        value: 'zheng'
      },
      {
        imageUrl: '../../image/ic_boil.png',
        text: '煮',
        value: 'zhu'
      },
      {
        imageUrl: '../../image/ic_porridge.png',
        text: '粥',
        value: 'zhou'
      },
      {
        imageUrl: '../../image/ic_noodles.png',
        text: '面',
        value: 'mian'
      },
      {
        imageUrl: '../../image/ic_friut.png',
        text: '果蔬',
        value: 'guoshu'
      }, {
        imageUrl: '../../image/ic_egg.png',
        text: '肉蛋',
        value: 'egg'
      },
      {
        imageUrl: '../../image/ic_bake.png',
        text: '烘焙',
        value: 'hongbei'
      },
      {
        imageUrl: '../../image/ic_gril.png',
        text: '煎炸',
        value: 'jianzha'
      }
    ]
  },
  /**图片轮播改变 */
  swiperChange(e) {
    this.setData({
      current: e.detail.current
    })
  },
  gotoDetail: function (e) {
    wx.navigateTo({
      url: `../detail/detail?id=${e.currentTarget.dataset.id}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    request.getHomeBar(function (res) {
      this.setData({
        barItems: res.data
      })
    }, function (res) { })
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