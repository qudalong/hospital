import {
  request
} from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:0,
    more:true,
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRegisterByUserId();
  },

  //根据用户id查询用户所有挂号记录
  getRegisterByUserId() {
    request({
      url: 'registerController/getRegisterByUserId',
      method: 'POST',
      data: {
        i_user_id: wx.getStorageSync('patientId'),
        page:this.data.page
      }
    }).then(res => {
      const hotData = res.data;
      this.setData({
        orderList: hotData.register_infos,
        page: hotData.page,
        more: hotData.more
      })
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
    wx.showLoading({
      title: '刷新中...'
    });
    request({
      url: 'registerController/seachArticles',
      method: 'POST',
      data: {
        i_user_id: wx.getStorageSync('patientId'),
        page: this.data.page
      }
    }).then(res => {
      wx.stopPullDownRefresh();
      const hotData = res.data;
      this.setData({
        orderList: hotData.register_infos.concat(hotData.register_infos),
        page: hotData.page,
        more: hotData.more
      });
      wx.hideLoading();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.more) {
      wx.showLoading({
        title: '加载更多...'
      });
      request({
        url: 'registerController/seachArticles',
        method: 'POST',
        data: {
          i_user_id: wx.getStorageSync('patientId'),
          page: this.data.page
        }
      }).then(res => {
        const hotData = res.data;
        this.setData({
          orderList: hotData.register_infos.concat(hotData.register_infos),
          page: hotData.page,
          more: hotData.more
        });
        wx.hideLoading();
      });
    } else {
      wx.showToast({
        title: '没有更多数据',
        icon: 'none'
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})