// pages/uploadworks/index.js
var count = 6
const request = require('../../api/request.js');
const app = getApp()
const {
  util
} = app
const qiniuUploader = require("../../lib/qiniuUploader");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenAdd: false,
    files: [],
    detailId: '',
    title: '',
    content: '',
    max: 320,
    imageUrls: []
  },
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      count: count - that.data.files.length,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        })
        if (that.data.files.length === 6) {
          that.setData({
            hiddenAdd: true
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      detailId: options.id,
      title: options.title
    })
  },
  commit: function() {
    var that = this
    if (this.data.files.length === 0) {
      util.showToast('至少需要上传一张图片', 'none', 2000)
      return
    }
    wx.showLoading({
      title: '正在提交...',
    })
    request.getQiniuToken().then(res => {
      for (let i = 0; i < that.data.files.length; i++) {
        qiniuUploader.upload(that.data.files[i], (res) => {
          console.log(JSON.stringify(res))
          that.data.imageUrls.push(res.imageURL)
          if (that.data.files.length === that.data.imageUrls.length) {
            request.publishWorks(that.data.detailId, that.data.content, that.data.imageUrls).then(res => {
              wx.hideLoading()
              util.showToast('发布成功', 'none', 2000)
              wx.redirectTo({
                url: '../detail/detail?id=' + that.data.detailId,
              })
            }).catch(res => {
              wx.hideLoading()
              console.log('发布作品失败：' + res)
              util.showToast(res, 'none', 2000)
            })
          }
        }, (error) => {
          console.log('error: ' + error);
        }, {
          region: 'SCN', // 华南区
          domain: 'http://v.miskitchen.com',
          shouldUseQiniuFileName: false,
          key: app.globalData.token + '_' + util.formatTime(new Date()) + '_' + i + '.png',
          uptoken: res.data.token
        }, (progress) => {
          console.log('上传进度', progress.progress)
          console.log('已经上传的数据长度', progress.totalBytesSent)
          console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend)
        });
      }
    }).catch(res => {
      console.log('提交失败：' + res)
      wx.hideLoading()
      util.showToast(res, 'none', 2000)
    })
  },
  deleteImage: function(e) {
    var files = this.data.files;
    var index = e.currentTarget.dataset.index;
    files.splice(index, 1);
    this.setData({
      files: files
    });
    if (this.data.files.length === 0) {
      this.setData({
        hiddenAdd: false
      })
    }
  },
  bindinput: function(e) {
    var value = e.detail.value;
    this.setData({
      content: value
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})