import {
  request
} from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    more: true,
    hotList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const i_type = options.i_type;
    this.setData({
      i_type
    });
    this.seachArticles();
  },

  //获取所有资讯
  seachArticles() {
    const {
      i_type,
      page
    } = this.data;
    request({
      url: 'registerController/seachArticles',
      method: 'POST',
      data: {
        i_type: i_type,
        page: page
      }
    }).then(res => {
      const hotData = res.data;
      this.setData({
        hotList: hotData.register_infos,
        page: hotData.page,
        more: hotData.more,
      })
    });
  },

  toHotDesc(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/articleDesc/articleDesc?id=${id}`
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showLoading({
      title: '刷新中...'
    });
    const {i_type,page} = this.data;
    request({
      url: 'registerController/seachArticles',
      method: 'POST',
      data: {
        i_type: i_type,
        page: 0
      }
    }).then(res => {
      wx.stopPullDownRefresh();
      const hotData = res.data;
      this.setData({
        hotList: hotData.register_infos,
        page: hotData.page,
        more: hotData.more
      });
      wx.hideLoading();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.more) {
      wx.showLoading({
        title: '加载更多...'
      });
      const {
        i_type,
        page
      } = this.data;
      request({
        url: 'registerController/seachArticles',
        method: 'POST',
        data: {
          i_type: i_type,
          page: page
        }
      }).then(res => {
        const hotData = res.data;
        this.setData({
          hotList: this.data.hotList.concat(hotData.register_infos),
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
  onShareAppMessage: function() {

  }
})