import {
  request
} from '../../utils/request.js'
const WxParse = require('../../wxParse/wxParse.js');
Page({

  data: {
    knowledgeItem:''
  },

  onLoad: function (options) {
    this.seachArticlesDetail(options.id);
  },

  //根据资讯id获取资讯详情
  seachArticlesDetail(id) {
    request({
      url: 'registerController/seachArticlesDetail',
      method: 'POST',
      data: {
        id: id
      }
    }).then(res => {
      const hotData = res.data;
      if (hotData.status_flag){
        const article = hotData.info;
        WxParse.wxParse('article', 'html', article, that, 5);
        this.setData({
          knowledgeItem: hotData.info
        });
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