//针对activity数据表的基础操作
let getActivitys = (ctx, cb) => {

    let tableId = getApp().globalData.activityTableId,
        activitys = new wx.BaaS.TableObject(tableId)

    activitys.find()
        .then(res => cb(res))
        .catch(err => console.dir(err))
}

let addActivity = (ctx, cb) => {

    let tableId = getApp().globalData.activityTableId,
        activitys = new wx.BaaS.TableObject(tableId),
        activity = activitys.create(),
        activityName = ctx.data.activity_title

    let data = {
        'activity_title': activityName,
        //'ActivityAuthor': ActivityAuthor,
    }

    activity.set(data)
        .save()
        .then(res => cb(res))
        .catch(err => console.dir(err))

}

// let updateActivity = (ctx, cb) => {
//     let tableId = getApp().globalData.activityTableId,
//         recordId = ctx.data.curRecordId,
//         ActivityName = ctx.data.editingActivityName,
//         ActivityAuthor = ctx.data.editingActivityAuthor

//     let Activitys = new wx.BaaS.TableObject(tableId),
//         Activity = Activitys.getWithoutData(recordId)

//     //注意数据格式
//     let data = {
//         'ActivityName': ActivityName,
//         'ActivityAuthor': ActivityAuthor,
//     }

//     Activity.set(data)
//         .update()
//         .then(res => cb(res))
//         .catch(err => console.dir(err))
// }

// let deleteActivity = (ctx, cb) => {
//     let tableId = getApp().globalData.activityTableId,
//         recordId = ctx.data.curRecordId

//     let Activitys = new wx.BaaS.TableObject(tableId)

//     Activitys.delete(recordId)
//         .then(res => cb(res))
//         .catch(err => console.dir(err))
// }

module.exports = {
    getActivitys,
    addActivity,
    // updateActivity,
    // deleteActivity,
}