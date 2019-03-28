// common/components/customTabbar/tabBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {
        "backgroundColor": "#ffffff",
        "color": "#979795",
        "selectedColor": "#1c1c1b",
        "list": [{
            "pagePath": "/pages/index/index",
            "iconPath": "icon/ic_home_default.png",
            "selectedIconPath": "icon/ic_home_click.png",
            "text": "首页"
          },
          {
            "pagePath": "/pages/uploadworks/index",
            "iconPath": "icon/btn_add.png",
            "isSpecial": true,
            "text": "发布"
          },
          {
            "pagePath": "/pages/profile/profile",
            "iconPath": "icon/ic_mine_default.png",
            "selectedIconPath": "icon/ic_mine_click.png",
            "text": "我的"
          }
        ]
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: app.globalData.systemInfo.model == "iPhone X" ? true : false,
    hideModal: true,
    animationData:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    open: function(e) {
      if (this.data.hideModal) {
        // this.setData({
        //   hideModal: false
        // })
        this.showModal()
      } else {
        // this.setData({
        //   hideModal: true
        // })
        this.hideModal()
      }
      //this.triggerEvent('open')
    },
    askQuestion: function (e) {
      this.closeModal()
      var style = '0'
      wx.navigateTo({
        url: '../uploadworks/index?style=' + style
      })
    },
    shareWork: function (e) {
      console.log('dddddd')
      this.closeModal()
      var style = '1'
      wx.navigateTo({
        url: '../uploadworks/index?style=' + style
      })
    },
    closeModal: function () {
      this.setData({
        hideModal: true
      })
    },
    showModal() {
      // 显示遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0  
      })
      this.animation = animation
      animation.scale(0).step()
      this.setData({
        animationData: animation.export(),// export 方法每次调用后会清掉之前的动画操作。
        hideModal:false
      })
      setTimeout(function () {
        animation.scale(1).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    },
    hideModal() {
      // 隐藏遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.scale(1).step()
      this.setData({
        animationData: animation.export()
      })
      setTimeout(function () {
        animation.scale(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
      setTimeout(function () {
        this.setData({
          hideModal: true
        })
      }.bind(this), 500)
    }
  }
})