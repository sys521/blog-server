const router = require('koa-router')()
const {sendOk, 
  sendFail, 
  deleteFile,
  createDir,
  createFile} = require('./tool.js')
const {USER, ARTICAL, ARTICALIMGS, CONCERN, LOVE} = require('../db/model.js')
const fs = require('fs')
const path = require('path')
const {uploadHeaderImg, uploadArticalImg} = require('../storage')

// 用户相关
router.post('/user/check', async (ctx, next) => {
  let u_name = ctx.request.body.u_name
  if (!u_name ) {
    ctx.response.body = sendFail()
  } else {
    let u_name = ctx.request.body.u_name
    let data =  await USER.findOne({where: {user_name: u_name}})
    if (data) {
      ctx.response.body = sendOk('NotUnique','NotUnique')
    } else {
      ctx.response.body = sendOk('unique', 'unique')
    }
  }
})
router.post('/user/add', async (ctx, next) => {
  let {u_name, u_password, u_email} = ctx.request.body
  try {
    let res = await USER.create({user_name:u_name, user_password: u_password, user_email: u_email})
    ctx.response.body = sendOk('注册成功', 'success')
  } catch(err) {
    ctx.response.body = sendFail(err.message, 'fail')
  }
})
router.post('/user/login', async (ctx, next) => {
  let user = ctx.request.body
  if (user.u_name && user.u_password) {
    try {
      let res = await USER.findOne({where: {user_name: user.u_name}})
      if (res.dataValues.user_password === user.u_password){
        ctx.session.user = {name: user.u_name}
        ctx.response.body = sendOk('登录成功', 'success')
      } else {
        ctx.response.body = sendFail('登录失败', 'fail')
      }
    } catch(err) {
      
      ctx.response.body =sendFail(err.message, 'fail')
    }
  } else {
    ctx.response.body = sendFail('not right commit', 'fail')
  }
})
router.get('/user/info', async (ctx, next) => {
  console.log(ctx.session)
  let userName = ctx.session.user.name
  let res = await USER.findAll({attributes: ['user_email', 'user_displayName', 'user_header',], where: {user_name: userName}})
  console.log(res[0].dataValues)
  if (res[0].dataValues) {
    ctx.response.body = sendOk('success', res[0].dataValues)
  } else {
    ctx.response.body = sendFail('未找到该用户', 'fail')
  }
})
router.post('/user/update/header', uploadHeaderImg.single('user_header'), async (ctx, next) => {
  let fileName = ctx.req.file.filename
  let userName = ctx.session.user.name
  let oldFile = await USER.findAll({attributes: ['user_header'], where: {user_name: userName}})
  if (oldFile[0].dataValues) {
    deleteFile(path.join(__dirname, '../public/header-imgs'), oldFile[0].dataValues.user_header)
  }
  let res = await USER.update({'user_header': fileName},{where: {user_name: userName}})
  console.log(fileName)
  ctx.response.body = sendOk('success', fileName)
})
router.post('/user/displayname/update', async (ctx) => {
  let {user_displayName} = ctx.request.body
  let userName = ctx.session.user.name
  if (user_displayName) {
    let res = await USER.update({'user_displayName': user_displayName}, {where: {user_name: userName}})
    if (res[0] === 1) {
      ctx.response.body = sendOk('success', 'success')
    } else {
      ctx.response.body = sendFail('fail', 'somethingError')
    }
  } else {
    ctx.response.body = sendFail('fail', '请输入合适的名称')
  }
})

// 文章相关
router.post('/artical/imgs/add/:id', uploadArticalImg.any(),async(ctx) => {
  let userName = ctx.session.user.name
  let files = ctx.req.files
  console.log(files)
  let artical_id = ctx.params.id
  let res = await USER.findAll({attributes: ['user_id'], where:{user_name: userName}})
  let addimgs = files.map(e => {
    return ARTICALIMGS.create({artical_id, imgs_url: e.filename})
  })
  try {
    let abb = await Promise.all(addimgs)
    ctx.response.body = sendOk('success', 
    files.map(e => {
      return [e.fieldname, e.filename]
    }))
  } catch (err) {
    ctx.response.body = sendFail('fail', err)
  }
})

router.get('/artical/add', async(ctx) => {
  let userName = ctx.session.user.name
  let res = await USER.findAll({attributes: ['user_id'], where: {user_name: userName}})
  let {user_id} = res[0].dataValues
  if (user_id) {
    try {
      let res = await ARTICAL.create({user_id: user_id})
      let artical_id = res.dataValues.artical_id
      console.log(artical_id)
      ctx.response.body = sendOk('success', artical_id)
    } catch (err) {
      ctx.response.body = sendFail('fail', err)
    }
  } else {
    ctx.response.body = sendFail('fail', '没有此用户')
  }
})
router.post('/artical/update/', async(ctx) => {
  console.log('我被更新了')
  let userName = ctx.session.user.name
  let { artical_id, artical_content, artical_abstract, artical_name} = ctx.request.body
  try {
    let res = await USER.findAll({attributes: ['user_id'], where:{user_name:userName}})
    let user_id = res[0].dataValues.user_id
    if (!artical_content) {
      ctx.response.body = sendFail('fail', '文章内容为空，保存失败')
    } else {
      let artical = await ARTICAL.update({artical_content, artical_abstract, artical_name, artical_clicktimes:0},{where: {artical_id, user_id}})
      ctx.response.body = sendOk('success', '文章保存成功')
    }
  } catch(err) {
    ctx.response.body = sendFail('fail', '文章保存失败')
    console.log(err)
  }
})
router.post('/artical/editor', async(ctx) => {
  let userName = ctx.session.user.name
  let {artical_id} = ctx.request.body
  try {
    let user = await USER.findAll({attributes: ['user_id'], where:{user_name:userName}})
    let user_id = user[0].dataValues.user_id
    let artical = await ARTICAL.findAll({attributes: ['artical_content'], where: {user_id, artical_id}})
    console.log(artical)
    ctx.response.body = sendOk('success', artical[0].dataValues)
  } catch (err) {
    ctx.response.body = sendFail('fail', err)
  }
})
router.post('/artical/remove/', async(ctx) => {
  let user_name = ctx.session.user.name
  console.log(user_name)
  console.log(ctx.request.body)
  let {artical_id} = ctx.request.body
  console.log(artical_id)
  try {
    let user = await USER.findAll({attributes: ['user_id'], where:{user_name}})
    let user_id = user[0].dataValues.user_id
    let res = await ARTICAL.destroy({where:{artical_id,user_id}})
    if (res === 1) {
      ctx.response.body = sendOk('success')
    }
  } catch(err) {
    console.log(err)
    ctx.response.body = sendFail('error', err)
  }
})
router.get('/artical/list', async (ctx) => {
  let user_name = ctx.session.user.name
  try {
    let user = await USER.findAll({attributes: ['user_id'], where:{user_name}})
    let user_id = user[0].dataValues.user_id
    let artical =  ARTICAL.findAll({attributes:['artical_id','artical_name','artical_abstract', 'artical_status', 'artical_clicktimes'], where:{user_id}})
    let love =  LOVE.count({attributes:['artical_id'],group:'artical_id', where:{user_id}})
    let [articalCount, loveCount] = await Promise.all([artical,love])
    let data = articalCount.map(e => {
      loveCount.forEach(item => {
        if (e.dataValues.artical_id === item.artical_id) {
          e.dataValues.love = item.count
        } else {
          e.dataValues.love = null
        }
      })
      return e.dataValues
    })
    console.log(data)
    ctx.response.body = sendOk('success', data)
  } catch (err) {
    console.log(err)
    ctx.response.body = sendFail('fail', err)
  }
})
// author 相关
router.get('/author/info', async (ctx) => {
  let user_name = ctx.session.user.name
  try {
    let res = await USER.findAll({where:{user_name}})
    let user_id = res[0].dataValues.user_id
    let articalNum = ARTICAL.count({where:{user_id, artical_content:{
      $not: null
    }}})
    let loveNum = LOVE.count({where:{user_id}})
    let concernNum = CONCERN.count({where:{from_id: user_id}})
    let data = await Promise.all([articalNum, loveNum, concernNum])
    let obj = {articalNum: data[0], loveNum: data[1], concernNum: data[2]}
    ctx.response.body = sendOk('success', obj)
  } catch(err) {
    console.log(err)
    ctx.repsponse.body = sendFail('fail', err)
  }
})
// concern 相关
router.get('/concern/already', async (ctx) => {
  let user_id = ctx.state.user_id
  let concern = await CONCERN.findAll({where:{from_id: user_id}})
  try{
    let to_id = concern.map(e => {
      return USER.findAll({attributes: ['user_id','user_displayName', 'user_header'], where:{user_id: e.to_id}})
    })
    let data = await Promise.all(to_id)
    data = data.map(e => e[0])
    ctx.response.body = sendOk('sucess', data)
  } catch(err) {
    ctx.response.body = sendFail('fail', err)
  }

})
router.get('/concern/recomend', async(ctx) => {
  let user_id = ctx.state.user_id
  try {
    let concern = await CONCERN.findAll({where:{from_id: user_id}})
    let to_id = concern.map(e => {
      return e.to_id
    })
    to_id = to_id.concat([user_id])
    let recomend = await USER.findAll({attributes: ['user_id', 'user_displayName', 'user_header'], where:{user_id:{$notIn: to_id}}})
    ctx.response.body = sendOk('success', recomend)
  } catch(err) {
    console.log(err)
    ctx.response.body = sendFail('fail', err)
  }
})
router.post('/concern/add', async(ctx) => {
  let user_id = ctx.state.user_id
  let to_id = ctx.request.body.to_id
  if (to_id) {
    try {
      let res = await CONCERN.upsert({to_id, from_id: user_id})
      ctx.response.body = sendOk('success', 'success')
    } catch(err) {
      ctx.response.body = sendFail('fail', err)
    }
  } else {
    ctx.response.body = sendFail('fail', '请传入正确的用户id')
  }
})
module.exports = router