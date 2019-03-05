const app = getApp();
import {
  request
} from '../../utils/request.js'

Page({
  data: {
    aUploadImgList: [],
    aUploadImgList_low: []
  },
  onLoad: function(options) {
    let aUploadImgList = JSON.parse(options.aUploadImgList);
    let aUploadImgList_low = JSON.parse(options.aUploadImgList_low);
    this.setData({
      aUploadImgList,
      aUploadImgList_low
    })
  },
  //提交上传的照片
  submit() {
    request({
      url: 'registerController/savaPrescriptionImg',
      method: 'POST',
      data: {
        i_user_id: wx.getStorageSync('patientId'),
        imgPaths: this.data.aUploadImgList_low.join(',') //图片相对路径（多个已逗号隔开）
      }
    }).then(res => {
      const hotData = res.data;
      if (hotData.status_flag) {
        wx.showToast({
          title: hotData.status_msg
        });
        wx.navigateBack({
          delta:1
        });
      } else {
        wx.showToast({
          title: hotData.status_msg,
          icon: 'none'
        });
      }
    });
  },

 //删除图片
  deleteImg(e){
    let { aUploadImgList, aUploadImgList_low}=this.data;
    const index = e.currentTarget.dataset.index;
    aUploadImgList.splice(index,1);
    aUploadImgList_low.splice(index,1);
    this.setData({
      aUploadImgList,
      aUploadImgList_low
    })
  },
  // 传照片
  uploadImg() {
    let {
      aUploadImgList
    } = this.data;
    if (aUploadImgList.length>=2){
      wx.showToast({
        title: '最多只能上传两张哦',
        icon:'none'
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
              this.uploadOneByOne(res.tempFilePaths, successUp, failUp, count, length);
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
              this.uploadOneByOne(res.tempFilePaths, successUp, failUp, count, length);
            }
          });
        }
      }
    })
  },

  uploadOneByOne(imgPaths, successUp, failUp, count, length) {
    wx.showLoading({
      title: '上传中...',
      icon: 'none'
    })
    let { aUploadImgList_low, aUploadImgList } = this.data;
    wx.uploadFile({
      url: `${app.globalData.url}registerController/uploadImages`,
      filePath: imgPaths[count],
      name: `chufa`,
      success: (e) => {
        if (e.statusCode == 200) {
          let hotData = JSON.parse(e.data);
          aUploadImgList.push(hotData.resultPath);
          aUploadImgList_low.push(hotData.resultPathLow);
          aUploadImgList.concat(aUploadImgList);
          aUploadImgList_low.concat(aUploadImgList_low);
          successUp++;
          this.setData({
            aUploadImgList,
            aUploadImgList_low
          });
        }
      },
      fail: (e) => {
        failUp++;
      },
      complete: (e) => {
        count++;
        if (count == length) {
          wx.hideLoading();
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 2000
          });
        } else {
          this.uploadOneByOne(imgPaths, successUp, failUp, count, length);
        }
      }
    })
  },

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})