// pages/classification/classification.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cook: [{
        imageUrl: '../../image/ic_fry.png',
        text: '炒',
        value: '8'
      },
      {
        imageUrl: '../../image/ic_steamed.png',
        text: '蒸',
        value: '9'
      },
      {
        imageUrl: '../../image/ic_boil.png',
        text: '煮',
        value: '10'
      },
      {
        imageUrl: '../../image/ic_ban.png',
        text: '拌',
        value: '11'
      },
      {
        imageUrl: '../../image/ic_gril.png',
        text: '煎/炸',
        value: '12'
      }, {
        imageUrl: '../../image/ic_dun.png',
        text: '焖/炖',
        value: '13'
      }, {
        imageUrl: '../../image/ic_bake.png',
        text: '烘焙',
        value: '14'
      },
      {
        imageUrl: '../../image/ic_other.png',
        text: '其他',
        value: '15'
      }
    ],
    foods: [{
        imageUrl: '../../image/ic_meat.png',
        text: '肉类',
        value: '5'
      },
      {
        imageUrl: '../../image/ic_egg.png',
        text: '蛋/奶',
        value: '6'
      },
      {
        imageUrl: '../../image/ic_bean.png',
        text: '豆制品',
        value: '7'
      },
      {
        imageUrl: '../../image/ic_fish.png',
        text: '鱼虾水产',
        value: '8'
      },
      {
        imageUrl: '../../image/ic_corn.png',
        text: '五谷杂粮',
        value: '9'
      }, {
        imageUrl: '../../image/ic_vegetable.png',
        text: '蔬菜',
        value: '10'
      },
      {
        imageUrl: '../../image/ic_friut.png',
        text: '水果',
        value: '11'
      },
      {
        imageUrl: '../../image/ic_yanxun.png',
        text: '烟熏类',
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