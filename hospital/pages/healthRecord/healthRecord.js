const app = getApp();
import {
  request
} from '../../utils/request.js'
import {
  uploadOneByOne
} from '../../utils/util.js'
Page({
  data: {
    aUploadImgList: [],
    aUploadImgList_low: [],
    page: 0,
    more: true,
    historyList: []
  },

  onLoad: function(options) {
    this.seachPrescriptionByUserId();
  },

  //根据用户id，查询所有上传处方的批次记录
  seachPrescriptionByUserId() {
    request({
      url: 'registerController/seachPrescriptionByUserId',
      method: 'POST',
      data: {
        i_user_id: wx.getStorageSync('patientId'),
        page: this.data.page
      }
    }).then(res => {
      const hotData = res.data;
      this.setData({
        historyList: hotData.register_infos,
        page: hotData.page,
        more: hotData.more
      })
    });
  },

  // 传照片
  uploadImg() {
    let {
      aUploadImgList,
      aUploadImgList_low
    } = this.data;
    if (aUploadImgList.length >= 2) {
      wx.showToast({
        title: '最多上传两张图片哦',
        icon: 'none'
      });
      return;
    }
    wx.showActionSheet({
      itemList: ['拍照', '从手机相册选择'],
      success: (res) => {
        if (res.tapIndex == 0) {
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['camera'],
            success: (res) => {
              let successUp = 0;
              let failUp = 0;
              let length = res.tempFilePaths.length;
              let count = 0;
              uploadOneByOne(app.globalData.url, res.tempFilePaths, successUp, failUp, count, length);
            }
          })
        } else if (res.tapIndex == 1) { //相册
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album'],
            success: (res) => {
              let successUp = 0;
              let failUp = 0;
              let length = res.tempFilePaths.length;
              let count = 0;
              uploadOneByOne(app.globalData.url, res.tempFilePaths, successUp, failUp, count, length);
            }
          });
        }
      }
    })
  },
  toPatientInfo(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/patientInfo/patientInfo?id=${id}`
    })
  },
  toUpload() {
    wx.navigateTo({
      url: `/pages/upload/upload`
    })
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
    request({
      url: 'registerController/seachArticles',
      method: 'POST',
      data: {
        i_user_id: wx.getStorageSync('patientId'),
        page: 0
      }
    }).then(res => {
      wx.stopPullDownRefresh();
      const hotData = res.data;
      this.setData({
        historyList: hotData.register_infos.concat(hotData.register_infos),
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
      request({
        url: 'registerController/seachPrescriptionByUserId',
        method: 'POST',
        data: {
          i_user_id: wx.getStorageSync('patientId'),
          page: this.data.page
        }
      }).then(res => {
        const hotData = res.data;
        this.setData({
          historyList: hotData.register_infos.concat(hotData.register_infos),
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