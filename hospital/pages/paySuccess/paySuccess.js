import {
  request
} from '../../utils/request.js'
Page({
  data: {
    register_info:null
  },

  onLoad: function (options) {
    this.getRegisterByOuttradeNo(options.outTradeNo);
  },

  //根据订单号查询挂号详情信息
  getRegisterByOuttradeNo(out_trade_no){
    request({
      url: 'registerController/getRegisterByOuttradeNo',
      method: 'POST',
      data: {
        out_trade_no: out_trade_no
      }
    }).then(res => {
      const hotData = res.data;
      if (hotData.status_flag) {
      this.setData({
        register_info: hotData.register_info
      })
      }
    });
  },

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    wx.navigateTo({
      url: `/pages/myOrder/myOrder?info=${JSON.stringify(this.data.register_info)}`
    })
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