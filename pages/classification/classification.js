// pages/classification/classification.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cook: [{
        imageUrl: '../../image/ic_fry.png',
        style:'width:86rpx;height:56rpx',
        text: '炒',
        value: '8'
      },
      {
        imageUrl: '../../image/ic_steamed.png',
        text: '蒸',
        style: 'width:65rpx;height:59rpx',
        value: '9'
      },
      {
        imageUrl: '../../image/ic_boil.png',
        style: 'width:75rpx;height:66rpx',
        text: '煮',
        value: '10'
      },
      {
        imageUrl: '../../image/ic_ban.png',
        text: '拌', 
        style: 'width:65rpx;height:63rpx',
        value: '11'
      },
      {
        imageUrl: '../../image/ic_gril.png',
        text: '煎/炸',
        style: 'width:78rpx;height:61rpx',
        value: '12'
      }, {
        imageUrl: '../../image/ic_dun.png',
        style: 'width:75rpx;height:59rpx',
        text: '焖/炖',
        value: '13'
      }, {
        imageUrl: '../../image/ic_bake.png',
        text: '烘焙',
        style: 'width:65rpx;height:54rpx',
        value: '14'
      },
      {
        imageUrl: '../../image/ic_other.png',
        style: 'width:55rpx;height:62rpx',
        text: '其他',
        value: '15'
      }
    ],
    foods: [{
        imageUrl: '../../image/ic_meat.png',
        style: 'width:73rpx;height:53rpx',
        text: '肉类',
        value: '5'
      },
      {
        imageUrl: '../../image/ic_egg.png',
        style: 'width:54rpx;height:62rpx',
        text: '蛋/奶',
        value: '6'
      },
      {
        imageUrl: '../../image/ic_bean.png',
        style: 'width:64rpx;height:66rpx',
        text: '豆制品',
        value: '7'
      },
      {
        imageUrl: '../../image/ic_fish.png',
        text: '鱼虾水产',
        style: 'width:76rpx;height:57rpx',
        value: '8'
      },
      {
        imageUrl: '../../image/ic_corn.png',
        style: 'width:74rpx;height:55rpx',
        text: '五谷杂粮',
        value: '9'
      }, {
        imageUrl: '../../image/ic_vegetable.png',
        style: 'width:61rpx;height:58rpx',
        text: '蔬菜',
        value: '10'
      },
      {
        imageUrl: '../../image/ic_friut.png',
        style: 'width:56rpx;height:61rpx',
        text: '水果',
        value: '11'
      },
      {
        imageUrl: '../../image/ic_yanxun.png',
        text: '烟熏类',
        style: 'width:72rpx;height:48rpx',
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