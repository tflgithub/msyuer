//app.js
const wxapi = require("./api/base.js").wxapi;
const ald = require('./utils/ald-stat.js')
App({
  onLaunch: function(options) {
    console.log("场景值：" + options.scene)
    let scene = options.scene
    if (scene == 1011 || scene == 1047 || scene == 1089 || scene == 1038) {
      this.globalData.officialAccount = true
    }
    wxapi("getUserInfo").then(userInfoRes => {
      console.log("昵称：" + JSON.stringify(userInfoRes.userInfo.nickName) + "头像：" + JSON.stringify(userInfoRes.userInfo.avatarUrl))
      this.globalData.userInfo.avatarUrl = userInfoRes.userInfo.avatarUrl
      this.globalData.userInfo.nickName = userInfoRes.userInfo.nickName
      this.globalData.iv = userInfoRes.iv
      this.globalData.encryptedData = userInfoRes.encryptedData
    })
  },
  globalData: {
    officialAccount: false,
    iv: null,
    encryptedData: null,
    userInfo: {
      avatarUrl: null,
      nickName: null
    }
  },
})