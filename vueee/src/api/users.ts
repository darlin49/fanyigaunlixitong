import axios from 'axios'

// 更新 User 接口定义，添加缺失的属性
export interface User {
  id?: number;
  username: string;
  password?: string;
  nickname?: string;
  email?: string;
  role?: string;
  status?: number;
  createTime?: Date;
  updateTime?: Date;
  avatar?: string;  // 添加头像属性
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

const api = axios.create({
  baseURL: 'http://localhost:8888/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

export const userApi = {
  getUsers() {
    return api.get<ApiResponse<User[]>>('/users')
  },
  addUser(user: User) {
    return api.post<ApiResponse<User>>('/users', user)
  },
  updateUser(id: number, user: User) {
    return api.put<ApiResponse<User>>(`/users/${id}`, user)
  },
  deleteUser(id: number) {
    return api.delete<ApiResponse<void>>(`/users/${id}`)
  }
}

export default userApi