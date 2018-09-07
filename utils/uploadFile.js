function upload(options) {
  var url = options.url,
    path = options.path,
    name = options.name,
    extra = options.extra,
    success = options.success,
    progress = options.progress,
    fail = options.fail

  console.log("upload url:" + url)
  const uploadTask = wx.uploadFile({
    url: url,
    filePath: path,
    name: name,
    header: {
      "Content-Type": "multipart/form-data"
    },
    formData: extra,
    success: function(res) {
      console.log(res);
      var data = res.data
      try {
        data = JSON.parse(res.data)
        console.log(data)
      } catch (e) {
        console.log(data)
        throw (e)
      }
      if (res.statusCode == 200 && data.code == 1000) {
        if (success) {
          success(data)
        }
      } else {
        if (fail) {
          fail(data)
        }
      }
    },
    fail: function(res) {
      console.log(res)
      if (fail) {
        fail(res)
      }
    }
  })

  uploadTask.onProgressUpdate((res) => {
    console.log('上传进度', res.progress)
    console.log('已经上传的数据长度', res.totalBytesSent)
    console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    if (progress)(
      progress(res)
    )
  })
}

module.exports = {
  upload: upload
}