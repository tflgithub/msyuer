Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  login: function() {
    wx.reLaunch({
      url: '../bindaccount/bindaccount'
    })
  }
})