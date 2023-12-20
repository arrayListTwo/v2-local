/**
 * 封装 axios
 */
import axios from 'axios'
import router from '../../router/index.js'

const config = {
  // baseURL: Config.baseURL || '',
  timeout: 20 * 1000, // 请求超时时间设置
  crossDomain: true,
  // withCredentials: true, // Check cross-site Access-Control
  // 定义可获得的http响应状态码
  // return true、设置为null或者undefined，promise将resolved,否则将rejected
  validateStatus (status) {
    return status >= 200 && status < 510
  },
}

// /**
//  * 错误码是否是refresh相关
//  * @param { number } code 错误码
//  */
// function refreshTokenException (code) {
//   // TODO 此处的错误码，根据实际情况自定义
//   const codes = [ 10000, 10042, 10050, 10052, 10012 ]
//   return codes.includes(code)
// }

// 创建请求实例
const _axios = axios.create(config)

_axios.interceptors.request.use(
  originConfig => {
    // TODO 有 API 请求重新计时

    const reqConfig = { ...originConfig }

    // step1: 容错处理
    if (!reqConfig.url) {
      console.error('request need url')
    }

    reqConfig.method = reqConfig.method.toLowerCase() // 大小写容错

    // 参数容错
    if (reqConfig.method === 'get') {
      if (!reqConfig.params) {
        reqConfig.params = reqConfig.data || {}
      }
    } else if (reqConfig.method === 'post') {
      if (!reqConfig.data) {
        reqConfig.data = reqConfig.params || {}
      }

      // 检测是否包含文件类型, 若包含则进行 formData 封装
      let hasFile = false
      Object.keys(reqConfig.data).forEach(key => {
        if (typeof reqConfig.data[key] === 'object') {
          const item = reqConfig.data[key]
          if (item instanceof FileList || item instanceof File || item instanceof Blob) {
            hasFile = true
          }
        }
      })

      // 检测到存在文件使用 FormData 提交数据
      if (hasFile) {
        const formData = new FormData()
        Object.keys(reqConfig.data).forEach(key => {
          formData.append(key, reqConfig.data[key])
        })
        reqConfig.data = formData
      }
    }

    return reqConfig
  },
  error => Promise.reject(error),
)

// Add a response interceptor
_axios.interceptors.response.use(
  async res => {
    const { code } = res.data

    return new Promise(async (resolve, reject) => {
      const { url } = res.config
      if (res.config.responseType === 'blob') {
        return resolve(res.data)
      }
      if (res.status.toString().charAt(0) === '2') {
        // 如果code是token失效了
        if (code === 4100 || code === 4013) {
          return reject(res.data)
        }
        return resolve(res.data)
      }
      reject(res.data)
    })
  },
  error => {
    if (!error.response) {
      // ElMessage.error('请检查 API 是否异常')
      console.log('error', error)
    }

    // 判断请求超时
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      // ElMessage.warning('请求超时')
    }
    return Promise.reject(error)
  },
)

// 导出常用函数

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export function post (url, data = {}, params = {}) {
  return _axios({
    method: 'post',
    url,
    data,
    params,
  })
}

/**
 * @param {string} url
 * @param {object} params
 */
export function get (url, params = {}) {
  return _axios({
    method: 'get',
    url,
    params,
  })
}

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export function put (url, data = {}, params = {}) {
  return _axios({
    method: 'put',
    url,
    params,
    data,
  })
}

/**
 * @param {string} url
 * @param {object} params
 */
export function _delete (url, params = {}) {
  return _axios({
    method: 'delete',
    url,
    params,
  })
}

export default _axios
