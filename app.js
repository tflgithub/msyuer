//app.js
const fundebug = require('./lib/fundebug.0.9.0.min.js');
fundebug.init({
  setUserInfo: true,
  setSystemInfo: true,
  apikey: '1b3a3c2c2471f60db7a32450786aba7157b5f5d9e1ccfa5929296c0b3b682518'
})
const ald = require('./utils/ald-stat.js')
App({
  onLaunch: function(options) {
    //隐藏系统tabbar
    wx.hideTabBar();
    //获取设备信息
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
        console.log(JSON.stringify(t.globalData.systemInfo))
      }
    });
  },
  editTabbar: function () {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  onShow:function(){
    wx.hideTabBar();
  },
  globalData: {
    systemInfo: null,//客户端设备信息
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#979795",
      "selectedColor": "#1c1c1b",
      "list": [
        {
          "pagePath": "/pages/home/home",
          "iconPath": "icon/ic_home_default.png",
          "selectedIconPath": "icon/ic_home_click.png",
          "text": "首页"
        },
        {
          "pagePath": "/pages/uploadworks/index",
          "iconPath": "icon/btn_add.png",
          "isSpecial": true,
          "text": ""
        },
        {
          "pagePath": "/pages/profile/profile",
          "iconPath": "icon/ic_mine_default.png",
          "selectedIconPath": "icon/ic_mine_click.png",
          "text": "我的"
        }
      ]
    }
  },
})