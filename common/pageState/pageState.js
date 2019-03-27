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
  return (message = '哎呀,服务器飞走啦～') => {
    that.setData({
      pageState: {
        state: 'error',
        message
      }
    })
  }
}

const notFound = (that, message) => {
  return (message = '数据不存在') => {
    that.setData({
      pageState: {
        state: 'notFound',
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

const auth = (that, message) => {
  return (message = '请授权小程序进行下一步操作') => {
    that.setData({
      pageState: {
        state: 'auth',
        message
      }
    })
  }
}

export default (that) => {
  return {
    loading: loading(that),
    error: error(that),
    notFound: notFound(that),
    empty: empty(that),
    auth:auth(that),
    finish: finish(that)
  }
}