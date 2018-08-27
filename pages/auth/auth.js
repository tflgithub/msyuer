var app = getApp();
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onAuth() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回       
              this.login();
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
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
                wx.clearStorage();
                wx.setStorage({
                  key: 'loginStatus',
                  data: res.data.data,
                  success: function(res) {
                    wx.reLaunch({
                      url: '../home/home',
                    })
                  },
                  fail: function(res) {
                    console.log("保存登录状态失败：" + JSON.stringify(res))
                  }
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
  onShow:function()
  {
   
  },
  onLoad:function(){
    
  }
})