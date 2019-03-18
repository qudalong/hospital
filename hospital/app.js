App({
  onLaunch: function () {

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.request({
            url: this.globalData.url + 'userControl/onOpenid',
            // url: this.globalData.url + 'ShopControl/onLogin.htm',
            method: 'POST',
            data: {
              // platform: 1,
              code: res.code
            },
            header: {
              'content-type': 'application/json;charset=utf-8'
            },
            success: function (res) {
              // console.log(res)
              if (res.statusCode == 200) {
                wx.setStorageSync('openid', res.data.openid);
                wx.setStorageSync('sessionid', res.data.session_key);
              } else { }
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况·
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    // url: 'https://www.shanjuancha.com/cleanpro/'
    // url: 'https://xcx.lebeitong.com/',
    url: 'http://192.168.32.204:8098/medicine/sModule/'
  }
})