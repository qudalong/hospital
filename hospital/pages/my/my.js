import {
  request
} from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    tel:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  bindUserTag() {
    request({
      url: 'userControl/bindUserTag',
      method: 'POST',
      data: {
        openid: wx.getStorageSync('openid')
      }
    }).then(res => {
      if (res.data.status_flag) {
        const hotData = res.data.t_userbind_info;
        this.setData({
          bindFlag: res.data.status_flag,
          name: hotData.v_user_name,
          tel: hotData.v_phone
        })
      } else {
        console.log('用户未绑定')
      }
    });
  },

  toMyInfo() {
    wx.navigateTo({
      url: `/pages/myInfo/myInfo`
    });
  },

  toMyOrder() {
    wx.navigateTo({
      url: `/pages/myOrder/myOrder?name=${this.data.name}&tel=${this.data.tel}`
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.bindUserTag();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})