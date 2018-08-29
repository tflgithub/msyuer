var app = getApp();
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  login: function() {
    var that = this
    wx.showLoading({
      title: '正在登录...'
    })
    wx.login({
      success: function(res) {
        if (res.code) {
          console.log("登录成功：" + res.code);
          wx.request({
            url: `${app.globalData.API_URL}/api/wxa/v1/login/wxCode`,
            method: 'post',
            data: {
              code: res.code
            },
            success: function(res) {
              console.log("登录：" + JSON.stringify(res))
              if (res.data.code === 0) {
                wx.hideLoading()
                app.saveLoginStatus(res.data.data).then(res => {
                  console.log("保存登录状态成功")
                  wx.reLaunch({
                    url: '../home/home'
                  })
                }).catch(res=>{
                  console.log("保存登录状态失败："+JSON.stringify(res))
                })
              } else {
                console.log("登录失败：" + res.data.msg)
                wx.hideLoading()
                wx.showToast({
                  title: '登录失败',
                  icon: 'none'
                })
              }
            },
            fail: function(res) {
              console.log("登录失败：" + JSON.stringify(res))
              wx.showToast({
                title: '登录失败',
                icon: 'none'
              })
              wx.hideLoading()
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
          wx.hideLoading()
        }
      }
    })
  },
  onShow: function() {

  },
  onLoad: function() {

  }
})