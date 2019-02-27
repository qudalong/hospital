import {
  request
} from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    hostoryList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const username = options.username;
    console.log(username)
    const id = options.id;
    wx.setNavigationBarTitle({
      title: username
    });
    this.seachArticlesDetail(id);
  },

  //根据资讯id获取资讯详情
  seachArticlesDetail(id) {
    request({
      url: 'registerController/seachPrescriptionImgById',
      method: 'POST',
      data: {
        id: id
      }
    }).then(res => {
      const hotData = res.data;
      if (hotData.status_flag) {
        this.setData({
          hostoryList: hotData.images
        });
      }
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