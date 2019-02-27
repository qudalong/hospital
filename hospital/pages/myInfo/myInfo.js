import {
  request
} from '../../utils/request.js'
import {
  date
} from '../../utils/util.js'
Page({
  data: {
    bindFlag: false,
    id: 0, 
    name: '',
    sex: 1,
    tel: '',
    date: '',
    age: '',
    avatarUrl: '',
    nickName: '',
    today: '',
    sexList: [{
        sex: 1,
        value: '男',
        checked: true
      },
      {
        sex: 0,
        value: '女',
        checked: false
      }
    ],
    infoData: []
  },

  onLoad: function(options) {
    const today = date(new Date());
    const avatarUrl = wx.getStorageSync('avatarUrl');
    const nickName = wx.getStorageSync('nickName');
    this.setData({
      avatarUrl,
      nickName,
      today
    });
    //查询用户绑定信息
    this.bindUserTag();
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
          id: hotData.id,
          name: hotData.v_user_name,
          sex: hotData.v_sex,
          tel: hotData.v_phone,
          tel_head: hotData.v_phone,
          date: hotData.v_birthday,
          age: hotData.v_age,
          openid: hotData.openid
        })
      } else {
        console.log('用户未绑定')
      }
    });
  },

  //绑定用户(提交)
  submit() {
    let {
      name,
      tel,
      date,
      sex,
      age
    } = this.data;

    const telReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!name.trim()) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      });
      return
    } else if (!tel.trim()) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return
    } else if (!telReg.test(tel) && tel != 11) {
      wx.showToast({
        title: '请输入正确的手机号!',
        icon: 'none'
      });
      return false;
    } else if (!date.trim()) {
      wx.showToast({
        title: '请输入出生日期',
        icon: 'none'
      });
      return
    } else if (!age) {
      wx.showToast({
        title: '您选择的出生日期有误',
        icon: 'none'
      });
      return
    }
    let v_sex = '';
    sex ? v_sex = '男' : v_sex = '女';
    this.setData({
      v_sex
    });
    request({
      url: 'userControl/bindUser',
      method: 'POST',
      data: {
        openid: wx.getStorageSync('openid'),
        v_user_name: this.data.name,
        v_sex: this.data.v_sex,
        v_phone: this.data.tel,
        v_birthday: this.data.date
      }
    }).then(res => {
      if (res.data.status_flag) {
        const infoData = res.data.t_userbind_info;
        this.setData({
          infoData,
          bindFlag: res.data.status_flag,
          id: infoData.id,
          name: infoData.v_user_name,
          sex: infoData.v_sex,
          tel: infoData.v_phone,
          date: infoData.v_birthday,
          age: infoData.v_age,
          openid: infoData.openid
        });
        wx.setStorageSync('patientId', infoData.id);
        wx.setStorageSync('patient', infoData.v_user_name); 
        wx.showToast({
          title: '绑定成功!',
          icon: 'none'
        });
        wx.switchTab({
          url: `/pages/index/index`
        });
      } else {
        wx.showToast({
          title: '绑定失败!',
          icon: 'none'
        });
      }
    });
  },
  //修改用户
  modifyBindUser() {
    let {
      name,
      tel,
      date,
      sex,
      age
    } = this.data;

    const telReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!name.trim()) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      });
      return
    } else if (!tel.trim()) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return
    } else if (!telReg.test(tel) && tel != 11) {
      wx.showToast({
        title: '请输入正确的手机号!',
        icon: 'none'
      });
      return false;
    } else if (!date.trim()) {
      wx.showToast({
        title: '请输入出生日期',
        icon: 'none'
      });
      return
    } else if (!age) {
      wx.showToast({
        title: '您选择的出生日期有误',
        icon: 'none'
      });
      return
    }
    let v_sex = '';
    sex ? v_sex = '男' : v_sex = '女';
    this.setData({
      v_sex
    });
    request({
      url: 'userControl/modifyBindUser',
      method: 'POST',
      data: {
        id: this.data.id,
        v_user_name: this.data.name,
        v_sex: this.data.v_sex,
        v_phone: this.data.tel,
        v_birthday: this.data.date
      }
    }).then(res => {
      if (res.data.status_flag) {
        wx.showToast({
          title: '修改成功!',
          icon: 'none'
        });
      } else {
        wx.showToast({
          title: '修改失败!',
          icon: 'none'
        });
        return
      }
      wx.switchTab({
        url: `/pages/index/index`
      });
    });
  },


  // 获取各个类别信息
  name(e) {
    this.setData({
      name: e.detail.value
    });
  },
  sex(e) {
    this.setData({
      sex: e.detail.value
    });
  },
  tel(e) {
    this.setData({
      tel: e.detail.value
    });
  },
  // 根据日期计算年龄
  date(e) {
    let {
      today
    } = this.data;
    const date = e.detail.value;
    const aToday = today.split('-');
    const aDate = date.split('-');
    let age = ((aToday[0] * 360 + aToday[1] * 30 + aToday[2]) - (aDate[0] * 360 + aDate[1] * 30 + aDate[2])) / 36000;
    if (age > 1) {
      age = Math.ceil(age);
    } else if (age > 0) {
      age = 1;
    } else {
      wx.showToast({
        title: '您选择的出生日期有误',
        icon: 'none'
      });
      age = '';
    }
    this.setData({
      date,
      age
    })
  }
})