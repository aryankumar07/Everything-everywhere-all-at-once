import axios from "axios"
import { accessTokenAtom } from "@/store/auth";
import { getDefaultStore } from "jotai";

const BASE_URL = "http://localhost:8080/api/v1";

let isRefereshing = false;

type QueueItem = {
  resolve: (value: string) => void;
  reject: (reason: string) => void;
};

const failedQueue: QueueItem[] = []


const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (!error) {
      resolve(token!)
    } else {
      reject("login again")
    }
  })
}


export const Axios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
})


Axios.interceptors.request.use((config) => {
  const store = getDefaultStore()
  const token = store.get(accessTokenAtom)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const store = getDefaultStore()
    const orignalRequest = error.config

    console.log("inside the refresh token", orignalRequest)
    console.log(error.response.status, orignalRequest._retry, orignalRequest.url)

    if (error.response.status !== 401 || orignalRequest._retry || orignalRequest.url?.includes("/refresh")) {
      console.log("rejecting the promise")
      return Promise.reject(error)
    }

    if (isRefereshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        orignalRequest.headers.Authorization = `Bearer ${token}`
        return Axios(orignalRequest)
      })
    }

    isRefereshing = true
    orignalRequest._retry = true

    try {
      console.log("refreshing the accessToken")
      const response = await axios.post('http://localhost:8080/api/v1/refresh', {}, { withCredentials: true })
      const token = response.data.accessToken
      store.set(accessTokenAtom, token)
      processQueue(null, token)
      orignalRequest.headers.Authorization = `Bearer ${token}`
      console.log(orignalRequest.headers.Authorization)
      return Axios(orignalRequest)
    } catch (err) {
      processQueue(error, null);
      store.set(accessTokenAtom, null)
      return Promise.reject(err)
    } finally {
      isRefereshing = false
    }
  }
)
