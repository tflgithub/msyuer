// pages/classification/classification.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: true,
    interval: 5000,
    duration: 1000,
    current: 0,
    barItems: [],
    month: [{
        imageUrl: '../../image/ic_six.png',
        text: '0-6月',
        value: '8'
      },
      {
        imageUrl: '../../image/ic_seven.png',
        text: '7月',
        value: '9'
      },
      {
        imageUrl: '../../image/ic_eight.png',
        text: '8月',
        value: '10'
      },
      {
        imageUrl: '../../image/ic_nine.png',
        text: '9月',
        value: '11'
      },
      {
        imageUrl: '../../image/ic_ten.png',
        text: '10月',
        value: '12'
      }, {
        imageUrl: '../../image/ic_eleven.png',
        text: '11月',
        value: '13'
      }, {
        imageUrl: '../../image/ic_twelve.png',
        text: '12月',
        value: '14'
      },
      {
        imageUrl: '../../image/ic_eighteen.png',
        text: '18月',
        value: '15'
      },
      {
        imageUrl: '../../image/ic_twenty_four.png',
        text: '24月',
        value: '16'
      }
    ],
    foods: [{
        imageUrl: '../../image/ic_steamed.png',
        text: '蒸',
        value: '5'
      },
      {
        imageUrl: '../../image/ic_boil.png',
        text: '煮',
        value: '6'
      },
      {
        imageUrl: '../../image/ic_porridge.png',
        text: '粥',
        value: '7'
      },
      {
        imageUrl: '../../image/ic_noodles.png',
        text: '面',
        value: '8'
      },
      {
        imageUrl: '../../image/ic_friut.png',
        text: '果蔬泥',
        value: '9'
      }, {
        imageUrl: '../../image/ic_egg.png',
        text: '肉/蛋泥',
        value: '10'
      },
      {
        imageUrl: '../../image/ic_bake.png',
        text: '烘焙',
        value: '11'
      },
      {
        imageUrl: '../../image/ic_gril.png',
        text: '煎炸',
        value: '12'
      }
    ]
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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