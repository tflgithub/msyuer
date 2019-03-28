// pages/uploadworks/index.js
var count = 9
const request = require('../../utils/wxRequest.js');
const api = require('../../api/config.js').api
const util = require('../../utils/util.js')
const wxapi = require("../../api/base.js").wxapi
const qiniuUploader = require("../../lib/qiniuUploader");
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hideModal: true,
    hiddenAdd: false,
    files: [],
    courseId: '',
    placeholder: '',
    content: '',
    max: 320,
    avatarUrl: null,
    nickName: null,
    imageUrls: [],
    items: [{
      name: '0',
      value: '匿名发布'
    }],
    courseName: '选择课程',
    style: '',
    anonymous: '1',
    workId: null,
    isIphoneX: app.globalData.systemInfo.model == "iPhone X" || app.globalData.systemInfo.model == "iPhone XR<iPhone11,8>" ? true : false,
    commitDisabled:false
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
        if (that.data.files.length === count) {
          that.setData({
            hiddenAdd: true
          })
        }
      }
    })
  },
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var anonymous = "1"
    if (e.detail.value) {
      this.setData({
        anonymous: "0"
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.courseId && options.courseName) {
      this.setData({
        courseId: options.courseId,
        courseName: options.courseName
      })
    }
    if (options.style) {
      if (options.style == '0') {
        wx.setNavigationBarTitle({
          title: '提问',
        })
        this.setData({
          placeholder: '不知道自己哪儿出了错，用图片和文字把问题说的明明白白，米勺老师会火速前来回答的～',
          style: options.style
        })

      } else if (options.style == '1') {
        wx.setNavigationBarTitle({
          title: '晒图',
        })
        this.setData({
          placeholder: '把成功的经验分享给小伙伴们，你会收获更多哦～',
          style: options.style
        })
      }
    }
  },
  submit: function(e) {
    var that = this
    wxapi("getSetting").then(res => {
      if (res.authSetting['scope.userInfo']) {
        wxapi("getUserInfo").then(userInfoRes => {
          that.setData({
            avatarUrl: userInfoRes.userInfo.avatarUrl,
            nickName: userInfoRes.userInfo.nickName
          })
        })
        if (that.data.courseName == '选择课程') {
          util.showToast('请选择课程', 'none', 2000)
          return
        }
        if (that.data.files.length === 0) {
          util.showToast('至少需要上传一张图片', 'none', 2000)
          return
        }
        if (that.data.content.length === 0) {
          util.showToast('说点什么吧？', 'none', 2000)
          return
        }
        wx.showLoading({
          title: '正在提交...',
        })
        that.setData({
          commitDisabled:true
        })
        request.fetch(api.getQiuniuToken).then(res => {
          for (let i = 0; i < that.data.files.length; i++) {
            qiniuUploader.upload(that.data.files[i], (res) => {
              console.log(JSON.stringify(res))
              that.data.imageUrls.push(res.imageURL)
              if (that.data.files.length === that.data.imageUrls.length) {
                var postData = {
                  courseId: that.data.courseId,
                  content: that.data.content,
                  urls: that.data.imageUrls,
                  flag_fail: that.data.style,
                  anonymous: that.data.anonymous,
                  wxFormId: e.detail.formId
                }
                request.fetch(api.publicWork, postData).then(res => {
                  wx.hideLoading()
                  console.log(JSON.stringify(res))
                  that.setData({
                    hideModal: false,
                    commitDisabled:false,
                    workId: res.data.id
                  })
                }).catch(res => {
                  wx.hideLoading()
                  console.log('作业提交失败：' + res)
                  util.showToast(res, 'none', 2000)
                  that.setData({
                    commitDisabled: false
                  })
                })
              }
            }, (error) => {
              console.log('error: ' + error);
            }, {
              region: 'SCN', // 华南区
              domain: api.image_url,
              shouldUseQiniuFileName: false,
              key: 'upload/' + util.formatTime(new Date()) + '/' + Math.random().toString(36) + '.png',
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
          that.setData({
            commitDisabled: false
          })
        })
      }
    })
  },
  deleteImage: function(e) {
    var files = this.data.files;
    var index = e.currentTarget.dataset.index;
    files.splice(index, 1);
    this.setData({
      files: files
    });
    if (this.data.files.length < 9) {
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
  modalCancel: function(e) {
    this.setData({
      hideModal: true
    })
    wx.navigateBack({
      delta: 1
    })
  },
  onShareAppMessage: function(e) {
    console.log('分享...')
    var that = this
    setTimeout(function() {
      that.setData({
        hideModal: true
      })
      wx.navigateBack({
        delta: 1
      })
    }, 500);
    return {
      title: '我的作品,分享给你呀',
      path: '/pages/workdetail/index?id=' + that.data.workId,
      imageUrl: that.data.files[0],
      success: function(shareTickets) {
        console.info(shareTickets + '成功');
        util.showToast('分享成功', 'none', 2000)
        // 转发成功
      },
      fail: function(res) {
        console.log(res + '失败');
        // 转发失败
        util.showToast('分享失败', 'none', 2000)
      },
      complete: function(res) {
        // 不管成功失败都会执行
        that.setData({
          hideModal: true
        })
      }
    }
  }
})