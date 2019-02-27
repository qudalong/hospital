import {
  request
} from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    imageList:[],
    hostoryList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const username = options.username;
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
        hotData.images.forEach((el, i, arr) => {
          this.data.imageList.push(arr[i].path);
        });
        this.setData({
          hostoryList: hotData.images,
          imageList: this.data.imageList
        });
      }
    });
  },

  previewImage(e) {
    const current = e.target.dataset.path;
    wx.previewImage({
      current: current, 
      urls: this.data.imageList 
    })
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