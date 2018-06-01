// pages/release/release.js
//index.js  
//获取应用实例  
var app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    hasLocation: false,
    location: null,
    activity_poster: '', //主题海报   
    category_id: 0, //活动标签签一级id
    category_one_id: 0, //活动标二级
    activityes_id: 0, //活动形式id

    images: [],//ycy
    imagePaths: '',
    is_auth: 0, //是否认证  
    tempFilePaths: '',
    date: '开始日期',
    time: '开始时间',
    dateend: '结束日期',
    timeend: '结束时间',
    index: 0,
    showModalStatus: false,
    array: [],
    formArr: [],
    index: 0,
    //活动标签
    brands: [],
    objectArray: [],
    object: [],
    thisobjArr: [],
    brandindex: 0,
    index1: 0,
    address: "请设置详细地址",
    areaInfo: "请选择所在城市"
  },
  //删除
  dele: function (e) {
    var index = e.target.dataset.index
    var src = e.target.dataset.src
    var srrImg = this.data.images
    srrImg.splice(index, 1)

    var imagePaths = this.data.imagePaths
    var arrimagepa = imagePaths.split(',');
    arrimagepa.splice(index, 1)
    imagePaths = arrimagepa.toString()
    console.log(imagePaths)
    this.setData({
      images: srrImg,
      imagePaths: imagePaths
    });
  },
  //选择位置位置
  chooseLocation: function (e) {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          hasLocation: true,
          location: {
            longitude: res.longitude,
            latitude: res.latitude,
            address: res.address,
            name: res.name
          },
          address: res.address
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  formSubmit: function (e) {
    if (e.detail.value.agree != 1) {
      wx.showToast({
        title: '请勾选我同意',
        icon: 'loading'
      })
      return false
    }
    if (e.detail.value.activity_title == "") {
      wx.showModal({
        title: '提示',
        content: '请填写活动主题',
        showCancel: false
      })
      return false
    }
    //主题海报可以默认不上传。
    // if (this.data.activity_poster == "") {
    //   wx.showToast({
    //     title: '请上传主题海报',
    //     icon: 'loading'
    //   })
    //   return false
    // }

    if (this.data.date == "开始日期") {
      wx.showToast({
        title: '请选择开始日期',
        icon: 'loading'
      })
      return false
    }
    if (this.data.time == "开始时间") {
      wx.showToast({
        title: '请选择开始时间',
        icon: 'loading'
      })
      return false
    }

    if (this.data.dateend == "结束日期") {
      wx.showToast({
        title: '请选择结束日期',
        icon: 'loading'
      })
      return false
    }

    if (this.data.timeend == "结束时间") {
      wx.showToast({
        title: '请选择结束时间',
        icon: 'loading'
      })
      return false
    }

    //结束日期必须大于开始日期
    var starttime = util.strToTime(this.data.date + ' ' + this.data.time)
    var endtime = util.strToTime(this.data.dateend + ' ' + this.data.timeend)//ycy
    if (starttime >= endtime) {
      wx.showModal({
        title: '提示',
        content: '开始时间不能大于等于结束时间',
        showCancel: false
      })
      return false;
    }

    if (this.data.areaInfo == "请选择所在城市") {
      wx.showToast({
        title: '请选择所在城市',
        icon: 'loading'
      })
      return false
    }
    if (this.data.address == "请设置详细地址") {
      wx.showModal({
        title: '提示',
        content: '请选择详细地点',
        showCancel: false
      })
      return false
    }

    if (e.detail.value.activity_cost == "") {//ycy activity_bonus
      wx.showModal({
        title: '提示',
        content: '请填写费用',
        showCancel: false
      })
      return false
    }
    if (e.detail.value.activity_content == "") {//ycy
      wx.showModal({
        title: '提示',
        content: '请填写详情描述',
        showCancel: false
      })
      return false
    }

    var sysLoginInfo = wx.getStorageSync('user');

    var sedData = {
      activity_starttime: this.data.date + ' ' + this.data.time,//ycy
      activity_endtime: this.data.dateend + ' ' + this.data.timeend,//ycy
      activity_poster: this.data.activity_poster,
      activityes_id: this.data.activityes_id,
      category_id: this.data.category_id,
      category_one_id: this.data.category_one_id,
      openid: sysLoginInfo.openid,
      activity_address: this.data.address,//ycy
      areaInfo: this.data.areaInfo,
      imagePaths: this.data.imagePaths //ycy activity_images
    }

    var data = Object.assign(sedData, e.detail.value)  //组合提交数据
    





    //活动发布——需要修改###############################
    var that = this;
    // wx.request({
    //   url: app.globalData.domain + '/api/mation/insertactivity',
    //   data: data,
    //   method: "POST",
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     var info = res.data
    //     if (info.state == 2) {
    //       wx.showModal({
    //         title: '提示',
    //         content: res.data.message,
    //         showCancel: false,
    //         success: function (event) {
    //           wx.switchTab({
    //             url: '/pages/index/index'
    //           })
    //         }
    //       })
    //     } else {
    //       wx.showModal({
    //         title: '提示',
    //         content: res.data.message,
    //         showCancel: false
    //       })
    //     }
    //   }
    // })

  },
  onShow: function () {

    // wx.openSetting({
    //   success: (res) => {
    //     console.log('授权结果')
    //     if(res.authSetting['scope.userInfo']){
    //         //登录逻辑
    //     }else{
    //       //跳转首页
    //       wx.switchTab({
    //         url: '/pages/index/index'
    //       })
    //     }

    //   }
    // })

    this.setData({
      areaInfo: wx.getStorageSync('rcityname')
    })
  },
  onLoad: function (options) {

    var that = this;
    var sysLoginInfo = wx.getStorageSync('user'); //user 
    //
    //检测用户是否认证###############################
    // wx.request({
    //   url: app.globalData.domain + '/api/mation/checksponsor',
    //   data: { openid: sysLoginInfo.openid },
    //   method: "POST",
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     var authinfo = res.data.res
    //     if (res.data.state == 2) {
    //       if (authinfo.auth_state == 2) {
    //         //认证通过
    //         that.setData({
    //           is_auth: 2
    //         })

    //       } else {
    //         wx.showModal({
    //           title: '提示',
    //           content: res.data.message,
    //           showCancel: false,
    //           success: function (res) {
    //             if (res.confirm) {

    //               wx.redirectTo({
    //                 url: '/pages/rz_type/rz_type'
    //               })
    //             } else if (res.cancel) {
    //               console.log('用户点击取消')
    //             }

    //           }
    //         })

    //       }
    //     } else {
    //       wx.showModal({
    //         title: '提示',
    //         content: res.data.message,
    //         showCancel: false,
    //         success: function (res) {
    //           if (res.confirm) {
    //             console.log('用户点击确定')
    //             wx.switchTab({
    //               url: '/pages/center/center'
    //             })
    //           } else if (res.cancel) {
    //             console.log('用户点击取消')
    //           }

    //         }
    //       })
    //     }

    //   }
    // })

    //获取活动标签

    // wx.request({
    //   url: app.globalData.domain + '/api/mation/categorylist',
    //   data: {
    //     all: 1
    //   },
    //   method: "POST",
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {

    //     var objectArray = res.data.res
    //     var brands = []
    //     var object = []
    //     for (var i = 0; i < objectArray.length; i++) {
    //       brands.push(objectArray[i].c_title, )
    //     }
    //     for (var i = 0; i < objectArray[0]['category'].length; i++) {
    //       object.push(objectArray[0]['category'][i].c_title, )
    //     }

    //     that.setData({
    //       category_one_id: objectArray[0]['category'][0]['id'], //活动标签一级id
    //       category_id: objectArray[0]['id'], //活动标签二级
    //       objectArray: objectArray,
    //       brands: brands,
    //       object: object
    //     })
    //   }
    // })

    // //获取活动形式列表 formlist

    // wx.request({
    //   url: app.globalData.domain + '/api/mation/formlist',
    //   data: {},
    //   method: "POST",
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     var objectArray = res.data.res
    //     var arr = []
    //     var object = []
    //     for (var i = 0; i < objectArray.length; i++) {
    //       arr.push(objectArray[i].form_name, )
    //     }

    //     that.setData({
    //       activityes_id: objectArray[0]['id'], //默认第一个活动形式id
    //       array: arr,
    //       formArr: res.data.res
    //     })
    //   }
    // })

  },
  bindPickerChange0: function (e) {

    this.setData({ brandindex: e.detail.value, index1: 0 })
    var objectArray = this.data.objectArray

    var thisSecCategory = objectArray[this.data.brandindex].category
    var object = []
    for (var i = 0; i < thisSecCategory.length; i++) {
      object.push(thisSecCategory[i].c_title, )
    }

    this.setData({
      object: object,
      category_id: objectArray[this.data.brandindex].id, //活动标签一级id
      thisobjArr: objectArray[this.data.brandindex].category //当前二级分类
    })
  },
  bindPickerChange1: function (e) {
    var thisObject = this.data.thisobjArr[e.detail.value]
    this.setData({
      index1: e.detail.value,
      category_one_id: thisObject.id
    })
  },
  //海报图片上传
  chooseimage: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.domain + '/api/mation/uploadfile',
          filePath: tempFilePaths[0],
          name: 'image',
          header: {
            'content-type': 'multipart/form-data'
          },
          success: function (resa) {
            console.log(resa)
            _this.setData({
              activity_poster: resa.data
            })
          }
        })
        _this.setData({
          tempFilePaths: res.tempFilePaths
        })
      }
    })
  },
  chooseimages: function () {
    var _this = this;
    wx.chooseImage({
      count: 9, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        var images = res.tempFilePaths
        var lastimages = _this.data.images
        var c = lastimages.concat(images)

        for (var i = 0; i < images.length; i++) {
          wx.uploadFile({
            url: app.globalData.domain + '/api/mation/uploadfile',
            filePath: images[i],
            name: 'image',
            header: {
              'content-type': 'multipart/form-data'
            },
            success: function (resa) {

              _this.setData({
                imagePaths: _this.data.imagePaths + resa.data + ','
              })
            }
          })
        }


        _this.setData({
          images: c
        })
      }
    })
  },
  //  点击活动形式组件确定事件  
  bindPickerChange: function (e) {
    var thisObject = this.data.formArr
    this.setData({
      index: e.detail.value,
      activityes_id: thisObject[e.detail.value].id,
    })
  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  //  点击时间组件确定事件  
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  //  点击时间结束组件确定事件  
  bindTimeendChange: function (e) {
    this.setData({
      timeend: e.detail.value
    })
  },
  //  点击日期结束组件确定事件  
  bindDateendChange: function (e) {
    this.setData({
      dateend: e.detail.value
    })
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  // 点击地点组件确定事件 
  // bindPickerChange: function (e) {
  //   console.log(e.detail.value)
  //   this.setData({
  //     index: e.detail.value
  //   })
  // }
}) 