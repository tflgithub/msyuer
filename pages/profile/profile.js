// pages/profile/profile.js
const request = require('../../utils/wxRequest.js');
var wxapi = require("../../api/base.js").wxapi;
const api = require('../../api/config.js').api;
import pageState from '../../common/pageState/pageState.js'
const util = require('../../utils/util.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    avatarUrl: null,
    nickName: null,
    works: [],
    startTime: null,
    endTime: null,
    pageSize: 15,
    currentPage: 0,
    haveNext: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.editTabbar()
    var that = this;
    wxapi("getSetting").then(res => {
      if (res.authSetting['scope.userInfo']) {
        that.completeAuth()
      } else {
        pageState(that).auth()
      }
    })
  },
  onRetry: function() {
    this.completeAuth()
  },
  completeAuth: function() {
    var that = this
    pageState(that).loading()
    wxapi("getUserInfo").then(userInfoRes => {
      console.log("昵称：" + JSON.stringify(userInfoRes.userInfo.nickName) + "头像：" + JSON.stringify(userInfoRes.userInfo.avatarUrl))
      that.setData({
        avatarUrl: userInfoRes.userInfo.avatarUrl,
        nickName: userInfoRes.userInfo.nickName
      })
      var postData = {
        pageSize: that.data.pageSize
      }
      request.fetch(api.getUserWorks, postData).then(data => {
        console.log(JSON.stringify(data))
        if (data.data.items.length == 0) {
          pageState(that).empty('你还没有作品喔～')
        } else {
          that.setData({
            currentPage: data.data.lastStamp,
            haveNext: data.data.haveNext,
            works: data.data.items
          })
          pageState(that).finish()
        }
      }).catch(e => {
        console.log(JSON.stringify(e))
        if (e == request.status.noNetWork) {
          pageState(that).error('您的网络好像出问题啦～')
        } else {
          pageState(that).error()
        }
      })
    })
  },
  bindTouchStart: function(e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function(e) {
    this.endTime = e.timeStamp;
  },
  goDetail: function(e) {
    if (this.endTime - this.startTime < 350) {
      wx.navigateTo({
        url: '../workdetail/index?id=' + e.currentTarget.dataset.id
      })
    }
  },
  openDelete: function(e) {
    var that = this
    var color = {
      cancelColor: '#999999',
      confirmColor: '#FF0000'
    }
    util.showModal('删除作业', '作业删除后，将无法恢复', true, '删除', res => {
      if (res.confirm) {
        wx.showLoading({
          title: '正在删除...',
        })
        var postData = {
          workId: e.currentTarget.dataset.id,
        }
        var index = e.currentTarget.dataset.index
        request.fetch(api.deleteWork, postData).then(data => {
          wx.hideLoading()
          util.showToast('删除作业成功！', 'none', 2000)
          var arr = that.data.works;
          arr.splice(index, 1)
          that.setData({
            works: arr
          })
        }).catch(e => {
          wx.hideLoading()
          util.showToast('删除作业失败！', 'none', 2000)
        })
      }
    }, color)
  },
  onPullDownRefresh: function(e) {
    var that = this;
    wx.showNavigationBarLoading()
    var postData = {
      pageSize: that.data.pageSize
    }
    request.fetch(api.getUserWorks, postData).then(data => {
      console.log(JSON.stringify(data))
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
      if (data.data.items.length > 0) {
        pageState(that).finish()
        that.setData({
          works: data.data.items,
          currentPage: data.data.lastStamp,
          haveNext: data.data.haveNext,
        })
      }
    }).catch(e => {
      console.log(JSON.stringify(e))
      util.showToast(e, 'none', 2000)
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
    })
  },
  getMoreData: function() {
    var that = this
    var postData = {
      lastStamp: this.data.currentPage,
      pageSize: this.data.pageSize
    }
    wx.showLoading({
      title: '正在努力加载...',
    })
    request.fetch(api.getUserWorks, postData).then(data => {
      wx.hideLoading()
      var list = that.data.works;
      list = list.concat(data.data.items);
      that.setData({
        works: list,
        haveNext: data.data.haveNext,
        currentPage: data.data.lastStamp
      })
    }).catch(res => {
      wx.hideLoading()
      util.showToast(res, 'none', 2000)
    })
  },
  onReachBottom: function() {
    if (this.data.haveNext) {
      this.getMoreData()
    } else {
      util.showToast('没有更多啦～', 'none', 2000)
    }
  }
})