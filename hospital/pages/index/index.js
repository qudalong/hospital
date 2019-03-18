import {
  request
} from '../../utils/request.js'
import {
  date
} from '../../utils/util.js'
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 400,
    bannerList: [],
    bindFlag: 1, //有没有绑定信息
    register_flag: 1, //能不能挂号
    curr_week_msg: '', //当前日期
    msg: '', //无法挂号提示
    weeks: [], //挂号日期
    orderTime: '', //设置的可预约时间
    showHotNewDesc: true, //最新一条咨询开始显示
    hotNewsFirst: '',
    knowledgeThress: []
  },
  onLoad: function() {
  
    wx.showLoading({
      title: '加载中...',
    });
    // wx.showNavigationBarLoading('11');
    // wx.hideNavigationBarLoading()
    const seachDisplayImg = this.seachDisplayImg();
    //查询用户绑定信息
    const bindUserTag = this.bindUserTag();
    //获取当前日期是否可挂号
    const getRegister = this.getRegister();
    const seachArticlesFirst = this.seachArticlesFirst();
    const knowledgeThress = this.knowledgeThress();

    Promise.all([seachDisplayImg, bindUserTag, getRegister, seachArticlesFirst, knowledgeThress])
      .then(res => {
        if (res.length) {
          const seachDisplayImgData = res[0].data;
          const bindData = res[1].data;
          const regData = res[2].data;
          const articData = res[3].data;
          const knowleData = res[4].data;
          if (!bindData.status_flag) {
            wx.setTabBarItem({
              index: 1,
              text: ' ',
              iconPath: 'image/tab_blank.png',
              selectedIconPath: 'image/tab_blank.png'
            });
          } else {
            wx.setTabBarItem({
              index: 1,
              text: '健康档案',
              iconPath: 'image/tab_order_gray.png',
              selectedIconPath: 'image/tab_order_purple.png'
            });
          }
          this.setData({
            // 轮播图
            bannerList: seachDisplayImgData.infos,
            // 是否绑定
            bindFlag: bindData.status_flag,
            //挂号信息
            register_flag: regData.register_flag,
            msg: regData.msg,
            curr_week_msg: regData.curr_week_msg,
            weeks: regData.weeks[0] || '',
            // 咨询第一条
            hotNewsFirst: articData.register_infos[0] || '',
            //小知识前三条
            knowledgeThress: knowleData.register_infos.splice(0, 3) || []
          });
          wx.hideLoading();
        }
      });
  },

  // 用户授权
  userInfoHandler(e) {
    let {
      bindFlag,
      register_flag,
      curr_week_msg,
      msg,
      weeks
    } = this.data;
    const saveInfoOk = wx.getStorageSync('saveInfoOk');
    if (e.detail.userInfo) {
      wx.setStorageSync('avatarUrl', e.detail.userInfo.avatarUrl);
      wx.setStorageSync('nickName', e.detail.userInfo.nickName);
      // 判断有没有录入个人信息
      if (!bindFlag) {
        wx.navigateTo({
          url: `/pages/myInfo/myInfo`
        });
      } else {
        // 判断可不可以挂号
        if (register_flag) {
          wx.navigateTo({
            url: `/pages/order/order?weeks=${JSON.stringify(weeks)}`
          });
        } else {
          wx.showModal({
            title: `${curr_week_msg}`,
            content: `${msg}`,
            showCancel: false
          });
        }
      }
    }
  },

  seachDisplayImg() {
    return request({
      url: 'registerController/seachDisplayImg',
      method: 'POST',
      data: {}
    });
  },
  bindUserTag() {
    return request({
      url: 'userControl/bindUserTag',
      method: 'POST',
      data: {
        openid: wx.getStorageSync('openid')
      }
    });
  },
  getRegister() {
    return request({
      url: 'registerController/getRegister',
      method: 'POST',
      data: {}
    });
  },

  seachArticlesFirst() {
    return request({
      url: 'registerController/seachArticles',
      method: 'POST',
      data: {
        i_type: 3,
        page: 0
      }
    });
  },
  knowledgeThress() {
    return request({
      url: 'registerController/seachArticles',
      method: 'POST',
      data: {
        i_type: 2,
        page: 0
      }
    });
  },

  //地址定位
  getAddress() {
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        const latitude = 34.786449;
        const longitude = 113.700211;
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 17,
          name: '拯济堂中医诊所',
          address: '郑州市金水区东明路北38号'
        });
      }
    });
  },

  // 打电话
  tel: function() {
    wx.makePhoneCall({
      phoneNumber: '13525551399',
    });
  },

  // 中药煎药
  toHotMedicine(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/hotMedicine/hotMedicine?i_type=${type}`
    });
  },
  //医馆资讯
  toHospitalNews(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/hospitalNews/hospitalNews?i_type=${type}`
    });
  },
  // 中药小知识
  toLoreMedicine(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/loreMedicine/loreMedicine?i_type=${type}`
    });
  },
  // 中药小知识详情
  toArticleDesc(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/articleDesc/articleDesc?id=${id}`
    });
  },

  // 轮播图跳转
  bannerToPage(e) {
    const link = e.currentTarget.dataset.link;
    if (link == 'pages/healthRecord/healthRecord') {
      wx.switchTab({
        url: '/pages/healthRecord/healthRecord'
      })
    } else {
      wx.navigateTo({
        url: `/${link}`
      });
    }
  },

  // 显示咨询更多开关
  showMoreFlag: function() {
    let {
      showHotNewDesc
    } = this.data;
    showHotNewDesc ? showHotNewDesc = false : showHotNewDesc = true
    this.setData({
      showHotNewDesc
    });
  },
  onShow() {
    //更新绑定状态
    this.updateBindUserTag();
    //更新挂号状态
    this.updateGetRegister();
  },

  updateBindUserTag() {
    request({
      url: 'userControl/bindUserTag',
      method: 'POST',
      data: {
        openid: wx.getStorageSync('openid')
      }
    }).then(res => {
      if (res.data.status_flag) {
        wx.setStorageSync('patientId', res.data.t_userbind_info.id);
        wx.setStorageSync('patient', res.data.t_userbind_info.v_user_name);
        this.setData({
          bindFlag: res.data.status_flag
        })
        wx.setTabBarItem({
          index: 1,
          text: '健康档案',
          iconPath: 'image/tab_order_gray.png',
          selectedIconPath: 'image/tab_order_purple.png'
        });
      }
    });
  },
  updateGetRegister() {
    request({
      url: 'registerController/getRegister',
      method: 'POST',
      data: {}
    }).then(res => {
      this.setData({
        register_flag: res.data.register_flag
      })
    });
  }

})