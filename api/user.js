import { request } from '@/plugins/request'


// 用户登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/api/users/login',
    data
  })
}

// 用户注册
export const register = data => {
  return request({
    method: 'POST',
    url: '/api/users',
    data
  })
}

// 获取当前用户
export const getCurrentUser = () => {
  return request({
    method: 'GET',
    url: '/api/user'
  })
}

// 更新用户信息
export const updateUser = data => {
  return request({
    method: 'PUT',
    url: '/api/user',
    data
  })
}

// 获取用户信息
export const getProfile = username => {
  return request({
    method: 'GET',
    url: `/api/profiles/${username}`
  })
}

// 关注用户
export const followUser = username => {
  return request({
    method: 'POST',
    url: `/api/profiles/${username}/follow`
  })
}

// 取消关注
export const unfollowUser = username => {
  return request({
    method: 'DELETE',
    url: `/api/profiles/${username}/follow`
  })
}