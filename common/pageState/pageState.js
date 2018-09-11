const loading = (that) => {
  return () => {
    that.setData({
      pageState: {
        state: 'loading',
        message: '正在努力加载中...'
      }
    })
  }
}

const error = (that, message) => {
  return (message = '请检查您的网络连接') => {
    that.setData({
      pageState: {
        state: 'error',
        message
      }
    })
  }
}

const empty = (that, message, icon) => {
  return (message = '空空如也', icon = icon) => {
    console.log(icon)
    that.setData({
      pageState: {
        state: 'empty',
        icon: icon,
        message
      }
    })
  }
}

const finish = (that) => {
  return () => {
    that.setData({
      pageState: {
        state: 'finish',
        message: ''
      }
    })
  }
}

export default (that) => {
  return {
    loading: loading(that),
    error: error(that),
    empty: empty(that),
    finish: finish(that)
  }
}