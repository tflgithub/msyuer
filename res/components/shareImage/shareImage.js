// res/components/shareImage/shareImage.js
const app = getApp();
const {
  util
} = app
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    drawDataList: {
      type: Object,
      value: {},
      observer(value) {
        console.log(value)
        if (JSON.stringify(value) != '{}') {
          this.initData(value)
          this.ctx = wx.createCanvasContext('image', this)
          this.drawImgInit()
        }
      }
    },
    hideModal: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hideModal: true,
    saveImgBtnHidden: false,
    openSettingBtnHidden: true,
    canvasData: {},
    drawList: [],
    drawData: []
  },
  /**
   * 组件的方法列表
   */
  methods: {
    modal_mask_click: function() {
      this.setData({
        hideModal: true
      })
    },
    // 数据初始化
    initData(value) {
      this.setData({
        canvasData: value.canvasData || '',
        drawList: value.content || ''
      })
    },
    drawImgInit() {
      let that = this
      let {
        canvasData,
        drawList
      } = that.data
      let imageList = []
      let textList = []
      // 分离图片和文字
      if (drawList.length) {
        drawList.forEach((item, index) => {
          switch (item.type) {
            case 'image':
              imageList.push(item)
              break;
            case 'text':
              textList.push(item)
              break;
          }
        })
      }
      for (let i in textList) {
        textList[i].left = parseInt(textList[i].left/2) || 0
        textList[i].top = parseInt(textList[i].top/2) || 0
        textList[i].fontSize = parseInt(textList[i].fontSize) || 16
        textList[i].lineHeight = parseInt(textList[i].lineHeight/2) || 16
        textList[i].maxWidth = parseInt(textList[i].maxWidth/2) || 300
      }
      imageList.unshift(canvasData)
      let index = 0;
      util.showToast('正在生成...')
      //下载图片到本地后
      for (let i in imageList) {
        imageList[i].left = parseInt(imageList[i].left/2) || 0
        imageList[i].top = parseInt(imageList[i].top/2) || 0
        imageList[i].width = parseInt(imageList[i].width/2) || 100
        imageList[i].height = parseInt(imageList[i].height/2) || 100
        that.downLoadImg(imageList[i].url, imageList[i].comment).then(res => {
          imageList[i].url = res
          index++;
          if (index === imageList.length) {
            util.hideToast()
            that.data.drawData = [...imageList, ...textList]
            //开始绘制
            that.beginDraw()
          }
        }, err => {
          util.showModal('错误提示', err, false)
        })
      }

    },
    downLoadImg(imgurl, msg) {
      return new Promise((resolve, reject) => {
        let that = this
        wx.downloadFile({
          url: imgurl,
          complete: function(res) {
            if (res.statusCode === 200) {
              util.hideToast()
              resolve(res.tempFilePath)
            } else {
              
              reject(new Error('downloadFail fail'))
            }
          }
        })
      })
    },
    // 裁剪圆形头像
    circleImg(params) {
      const {
        url,
        left,
        top,
        width
      } = params
      let r = parseInt(width / 2) // 半径
      this.ctx.save()
      let d = 2 * r
      let cx = left + r
      let cy = top + r
      this.ctx.arc(cx, cy, r, 0, 2 * Math.PI)
      this.ctx.clip()
      this.ctx.drawImage(url, left, top, d, d)
      this.ctx.restore()
    },
    drawImg(params) {
      let that = this
      const {
        url = '', top = 0, left = 0, width = 50, height = 50, shape = 'square'
      } = params
      if (params.shape == 'circle') {
        that.circleImg(params)
      } else {
        console.log("下载的图片地址：" + url)
        that.ctx.drawImage(url, left, top, width, height)
      }
    },
    // 绘制文字
    fillText(params) {
      const {
        fontSize = 16, color = '#FFFFFF', content, left = 0, top = 0, textAlign = 'center', lineHeight = 16, maxLineNum = 2, maxWidth = 300, weight = 'normal'
      } = params
      let arrText = content.split('')
      let line = '',
        _top = top,
        lineNum = 1,
        testLine = ''
      this.ctx.setFillStyle(color)
      this.ctx.setTextAlign(textAlign)
      this.ctx.font = 'normal ' + weight + ' ' + fontSize + 'rpx ' + 'sans-serif'
      for (let i = 0; i < arrText.length; i++) {
        testLine += [arrText[i]]
        let testWidth = this.ctx.measureText(testLine).width || 0
        if (testWidth > maxWidth) {
          this.ctx.fillText(testLine, left, _top, maxWidth)
          testLine = ''
          _top += lineHeight
        }
      }
      this.ctx.fillText(testLine, left, _top, maxWidth)
    },
    beginDraw() {
      let that = this
      let {
        drawData
      } = that.data
      for (let i in drawData) {
        switch (drawData[i].type) {
          case 'image':
            that.drawImg({
              ...drawData[i]
            })
            break;
          case 'text':
            that.fillText({
              ...drawData[i]
            })
            break;
        }
      }
      that.ctx.draw()
      //绘制完成就显示出来
      that.setData({
        hideModal: false
      })
    },
    savaImageToPhoto() {
      let that = this
      util.showToast('生成中...')
      wx.canvasToTempFilePath({
        canvasId: 'image',
        fileType: 'jpg',
        success(res) {
          util.hideToast()
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              util.showModal('保存至相册', '图片成功保存至本地相册,赶快去朋友圈分享吧!', false)
              that.setData({
                hideModal: true
              })
            }
          })
        },
        fail(err) {
          util.hideToast()
          util.showModal('错误提示', err, false)
        }
      }, that)
    },
    save: function() {
      var that = this;
      //获取相册授权
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() { //这里是用户同意授权后的回调
                that.savaImageToPhoto();
              },
              fail() { //这里是用户拒绝授权后的回调
                that.setData({
                  saveImgBtnHidden: true,
                  openSettingBtnHidden: false
                })
              }
            })
          } else { //用户已经授权过了
            that.savaImageToPhoto();
          }
        }
      })
    },
    handleSetting: function(e) {
      let that = this;
      // 对用户的设置进行判断，如果没有授权，即使用户返回到保存页面，显示的也是“去授权”按钮；同意授权之后才显示保存按钮
      if (!e.detail.authSetting['scope.writePhotosAlbum']) {
        wx.showModal({
          title: '警告',
          content: '若不打开授权，则无法将图片保存在相册中！',
          showCancel: false
        })
        that.setData({
          saveImgBtnHidden: true,
          openSettingBtnHidden: false
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '您已授权，赶紧将图片保存在相册中吧！',
          showCancel: false
        })
        that.setData({
          saveImgBtnHidden: false,
          openSettingBtnHidden: true
        })
      }
    }
  }
})