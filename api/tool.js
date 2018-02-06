success = {
  status: 'success',
  message: '',
  data: ''
}

fail = {
  status: 'fail',
  message: '',
  data: ''
}

function sendOk(text, obj) {
  return Object.assign(success, {message:text, data:obj})
}

function sendFail (text, obj) {
  return Object.assign(fail, {message:text, data:obj})
}

module.exports = {
  sendOk,
  sendFail
}