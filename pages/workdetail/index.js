const WxParse = require('../../wxParse/wxParse.js');
const request = require('../../utils/wxRequest.js');
const api = require('../../api/config.js').api;
const wxapi = require("../../api/base.js").wxapi;
const util = require('../../utils/util.js');
import pageState from '../../common/pageState/pageState.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    workInfo: {},
    commentInfo: [],
    courseInfo: {},
    workId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      workId: options.id
    })
    this.onRetry()
  },
  onRetry:function(){
    var that = this;
    pageState(that).loading()
    request.fetch(api.getWorkDetail, {
      workId: this.data.workId
    }, request.method.post, false).then(data => {
      pageState(that).finish()
      that.setData({
        workInfo: data.data.workInfo,
        commentInfo: data.data.commentInfo,
        courseInfo: data.data.courseInfo,
      })
    }).catch(e => {
      if (e == request.status.notFound) {
        pageState(that).notFound('该作品不存在！')
      } else {
        pageState(that).error()
      }
    })
  },
  previewImage: function(e) {
    var current = e.target.dataset.idx
    var imageUrls = this.data.workInfo.phoUrl
    wx.previewImage({
      current: imageUrls[current], // 当前显示图片的http链接  
      urls: imageUrls // 需要预览的图片http链接列表  
    })
  },
  goCoursePage: function(e) {
    wx.redirectTo({
      url: '../detail/index?id=' + this.data.courseInfo.courseId
    })
  }
})