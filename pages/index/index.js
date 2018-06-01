// pages/index/index.js
var app = getApp();
var data = null
var index = 0
var page = 1
var noMoreDataList = false
var keywords = ''
var areaInfo = ''
Page({
  data: {
    quanbu: true,
    areaInfo: '全国',
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    sections: null, //前10一级分类
    sectionsnext: null, //后n个一级分类
    articles: null, //活动列表
    noMoreDataList: false, //是否还有数据
    expertList: [],
    // 轮播
    imgUrls: null,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    userInfo: {},
    indicatorDots: true,
    id: 0
    // 轮播
  },
  /**
     * 弹窗
     */
  onArticleClick: function (e) {

    var aid = e.currentTarget.dataset.aid
    //详情页跳转
    wx.navigateTo({
      url: '/pages/index-details/index-details?aid=' + aid,
    })

  },
  //搜索，
  searchSubmit: function (e) {

    index = 0
    this.loadArticles(0, false, e.detail.value, '')
  },
  onLocation: function () {
    wx.navigateTo({
      url: '/pages/location/location?areaInfo=' + this.data.areaInfo,
    })
  },
  //城市
  onShow: function () {
    var cityname = wx.getStorageSync('cityname')
    var that = this
    if (cityname == "") {
      //首次进入获取全国数据不需要定位当前城市
      this.loadArticles(index, false, '', '')
    } else {
      this.setData({
        areaInfo: cityname
      })

      this.loadArticles(index, false, '', cityname)
    }
    wx.hideToast()
  },
  onSectionClicked: function (e) {
    //分类点击事件
    page = 1
    var id = e.currentTarget.dataset.id
    for (var i in data) {
      //清空所有点击样式
      data[i]['active'] = false
      if (data[i]['id'] == id) {
        index = i
      }
    }
    if (id == 0) {
      this.setData({
        quanbu: true
      })
    } else {
      //给当前点击添加样式
      data[index]['active'] = true
      this.setData({
        quanbu: false
      })
    }



    this.setData({
      id: id,
      sections: data
    })
    this.hideModal();
    this.loadArticles(id, false, '', this.data.areaInfo) //请求数据


  },
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  // onConfirm: function () {
  //   this.hideModal();
  // },

  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  loadArticles: function (id, ifLoadMore, keywords, areaInfo) {

    var that = this
    if (ifLoadMore) {
      page++
    } else {
      page = 1
    }
    var redata = {
      areaInfo: areaInfo,
      keywords: keywords,
      id: id,
      page: page
    }
    //########################请求数据——需要修改成为新的访问内容表的代码#################
    // wx.request({
    //   url: app.globalData.domain + '/api/mation/activityclasslist',
    //   data: redata,
    //   method: "POST",
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   success: function (res) {

    //     if (res.data.state == 1) {
    //       if (ifLoadMore) {
    //         //没有更多了
    //         noMoreDataList = true
    //         that.setData({
    //           noMoreDataList: noMoreDataList
    //         })
    //       } else {
    //         that.setData({
    //           articles: res.data.res,
    //           noMoreDataList: noMoreDataList
    //         })
    //       }
    //     } else {
    //       if (ifLoadMore) {
    //         data[index]['articles'] = data[index]['articles'].concat(res.data.res)
    //       } else {
    //         data[index]['articles'] = res.data.res
    //       }
    //       that.setData({
    //         articles: data[index]['articles'],
    //         noMoreDataList: noMoreDataList
    //       })
    //     }
    //     //缓存列表数据
    //     //停止当前刷新页面 
    //     wx.stopPullDownRefresh()
    //   }
    // })
  },
  onPullDownRefresh: function () {
    //下拉刷新
    if (this.data.id == 0) {
      this.loadArticles(0, false, '', this.data.areaInfo)
    } else {
      this.loadArticles(data[index]['id'], false, '', this.data.areaInfo)
    }

  },
  onReachBottom: function () {
    //加载更多
    if (this.data.id == 0) {
      this.loadArticles(0, true, '', this.data.areaInfo)
    } else {
      this.loadArticles(data[index]['id'], true, '', this.data.areaInfo)
    }

  },

  onLoad: function () {

    wx.showToast({
      title: '数据加载中...',
      icon: 'loading'
    })
    var that = this;

    //获取一级分类
    // wx.request({
    //   url: app.globalData.domain + '/api/mation/getonecategory',
    //   data: {},
    //   method: "POST",
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     data = res.data.res
    //     //给第一个分类设置默认样式
    //     //data[index]['active'] = true
    //     that.setData({
    //       sections: res.data.res
    //       // sectionsnext: res.data.res.slice(10,100)
    //     })
    //   }
    // })

    //获取轮播图

    // wx.request({
    //   url: app.globalData.domain + '/api/mation/bannerlist',
    //   data: {},
    //   method: "POST",
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     that.setData({
    //       imgUrls: res.data.res,
    //     })
    //   }
    // })

    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        //console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  footerTap: app.footerTap
})