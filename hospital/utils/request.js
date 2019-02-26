const app = getApp();
const host = app.globalData.url;

const request = ({url,data = {},method = 'GET'}) => {
  return new Promise(function(resolve, reject) {
    _request(url, resolve, reject, data, method)
  })
}

const _request = (url, resolve, reject, data = {}, method = 'GET') => {
  wx.request({
    url: host + url,
    header: {
      'content-type': 'application/json'
    },
    data: data,
    method: method,
    success: res => {
      resolve(res)
    },
    fail: () => {
      reject('接口请求失败')
    },
    complete: () => {
    }
  })
}


module.exports = {
  request
}