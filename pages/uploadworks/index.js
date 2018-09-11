// pages/uploadworks/index.js
var count = 6
const request = require('../../api/request.js');
const app = getApp()
const {
  util
} = app
const uploadFile = require("../../utils/uploadFile.js")
const promisify = require("../../utils/promisify.js")
//转为promise对象
const uploadImage = promisify(uploadFile.upload)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenAdd: false,
    files: [],
    detailId: '',
    content: '',
    max: 320,
    currentWordNumber: 0,
    images: []
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
      detailId: option.id
    })
  },
  commit: function() {
    var that = this
    if (this.data.files.length === 0) {
      util.showToast('至少需要上传一张图片', 'none', 2000)
      return
    }
    request.getQiniuToken().then(res => {
      that.uploadMultiImage(that.data.files, res.data.token)
    }).catch(res => {
      console.log('获取七牛服务器token失败')
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
    var len = parseInt(value.length);
    if (len > this.data.min)
      this.setData({
        texts: " "
      })
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len //当前字数  
    });
  },
  uploadMultiImage: function(paths, token) {
    let that = this
    let url = 'https://v.miskitchen.com'
    const promises = paths.map(function(path) {
      return uploadImage({
        url: url,
        path: path,
        name: 'file',
        extra: {
          token: token
        },
      })
    })
    wx.showLoading({
      title: '正在上传...',
    })
    Promise.all(promises).then(datas => {
      //所有上传完成后
      wx.hideLoading()
      // 服务器返回的路径
      let paths = datas.map(data => {
        return data.data
      })
      // 保存，这里可以选择发送一个请求，保存这几条路径
      images = images.concat(paths)
      that.setData({
        images: images
      })
      while (that.files.length === images.length) {
        request.publishWorks(that.data.detailId, that.data.content, images).then(res => {
          util.showToast('发布成功', 'none', 2000)
        }).catch(res => {
          console.log('发布作品失败：' + res)
          util.showToast(res, 'none', 2000)
        })
        break;
      }
    }).catch(res => {
      wx.hideLoading()
      util.showToast(res, 'none', 2000)
    })
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