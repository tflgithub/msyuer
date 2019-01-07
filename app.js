//app.js
var fundebug = require('./lib/fundebug.0.9.0.min.js');
fundebug.init({
  setUserInfo: true,
  setSystemInfo: true,
  apikey: '1b3a3c2c2471f60db7a32450786aba7157b5f5d9e1ccfa5929296c0b3b682518'
})
const wxapi = require("./api/base.js").wxapi;
const ald = require('./utils/ald-stat.js')
App({
  onLaunch: function(options) {
    console.log("场景值：" + options.scene)
    let scene = options.scene
    if (scene == 1011) {
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