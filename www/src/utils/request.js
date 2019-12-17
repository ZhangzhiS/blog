import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
    baseUrl:process.env.VUE_APP_BASE_URL,
    timeout: 5*60
})


// request 拦截器
service.interceptors.request.use(
    config => {
        if (store.getters.token) {
            config.headers['X-Token'] = getToken()
          }
        return config
    },
    error => {
        // console.log(error)
        return Promise.reject(error)
    }
)


// response 拦截器
service.interceptors.response.use(
    response => {
        const resp = response.data
        if (resp.code !== 20000) {
            Message({
                message: resp.message || "Error",
                type: "error",
                duration: 5*1000,
            })
            return Promise.reject(new Error(resp.message || "Error"))
        } else {
            return resp
        }
    },
    error => {
        // console.log("error", error)  // debug
        Message({
            message: error.message || "Error",
                type: "error",
                duration: 5*1000,
        })
    }
)