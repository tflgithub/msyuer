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
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回       
              this.login()
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
          wx.reLaunch({
            url: '../home/home',
          })
        }
      }
    })
  },
  login:function(){
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log("登录成功：" + res.code);
          wx.request({
            url: `${app.globalData.API_URL}/api/wxa/v1/login/wxCode`,
            method: 'post',
            data: {
              code: res.code
            },
            success: function (res) {
              if (res.data.code === 0) {
                app.globalData.token = res.data.token;
                app.globalData.setUserInfo = res.data.setUserInfo;
              }
            },
            fail: function (res) { }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }
})