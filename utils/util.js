const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join(' ') + [hour, minute, second].map(formatNumber).join(' ')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/*获取当前页url*/
function getCurrentPageUrl() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  console.log("当前页面：" + url)
  return url
}
// 用户授权检查
const checkPermission = (type, onSuccess, content) => {
  let that = this
  type = 'scope.' + type;
  wx.getSetting({
    success(getRes) {
      const setting = getRes.authSetting;
      if (setting[type] === false) {
        that.showModal('温馨提示', content, false, '我知道了', res => {
          if (res.confirm) {
            wx.openSetting({
              success(openRes) {
                if (openRes.authSetting[type] === true) {
                  typeof onSuccess === 'function' && onSuccess();
                }
              }
            });
          }
        })
      } else if (setting[type] === true) {
        //如果已有授权直接执行对应动作
        typeof onSuccess === 'function' && onSuccess();
      } else {
        //如果未授权，直接执行对应动作，会自动查询授权
        typeof onSuccess === 'function' && onSuccess();
      }
    }
  })
}

const showToast = (title = '加载中...', icon = 'loading', duration = 60000) => {
  wx.showToast({
    title: title,
    mask: true,
    icon: icon,
    duration: duration
  })
}

const hideToast = () => {
  wx.hideToast()
}

const showModal = (title = '系统提示', str = '', showCancel = true, confirmText = '确定', fn, color = {
  cancelColor: '#999999',
  confirmColor: '#72B9C3'
}, cancelText = "取消") => {
  wx.showModal({
    title: title,
    content: str,
    showCancel: showCancel,
    cancelText: cancelText,
    confirmText: confirmText,
    confirmColor: color.confirmColor,
    cancelColor: color.cancelColor,
    success: res => {
      return typeof fn == 'function' && fn(res)
    }
  })
}

function imageUtil(e) {
  var imageSize = {};
  var originalWidth = e.detail.width; //图片原始宽  
  var originalHeight = e.detail.height; //图片原始高  
  var originalScale = originalHeight / originalWidth; //图片高宽比  
  //获取屏幕宽高  
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = 200;
      var windowHeight = 200;
      var windowscale = windowHeight / windowWidth; //屏幕高宽比  
      if (originalScale < windowscale) { //图片高宽比小于屏幕高宽比  
        //图片缩放后的宽为屏幕宽  
        imageSize.imageWidth = windowWidth;
        imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
      } else { //图片高宽比大于屏幕高宽比  
        //图片缩放后的高为屏幕高  
        imageSize.imageHeight = windowHeight;
        imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
      }
    }
  })
  console.log('缩放后的宽: ' + imageSize.imageWidth)
  console.log('缩放后的高: ' + imageSize.imageHeight)
  return imageSize;
}

function getNetWork() {
  var netWorkType = null
  wx.getNetworkType({
    success: function (res) {
      netWorkType = res.networkType
    }
  })
  return netWorkType
}

module.exports = {
  formatTime: formatTime,
  getCurrentPageUrl: getCurrentPageUrl,
  checkPermission,
  showToast,
  hideToast,
  showModal,
  imageUtil: imageUtil,
  getNetWork
}