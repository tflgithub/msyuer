function wxapi(function_name, obj) {
  return new Promise((resole, reject) => {
    wx[function_name]({
      ...obj,
      success: res => resole(res),
      faile: res => reject(res),
      complete:res=>reject(res)
    })
  })
}
module.exports = { wxapi }