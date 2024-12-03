<template>
  <div class="users">
    <div class="header">
      <h2>用户管理</h2>
      <div class="header-buttons">
        <button class="test-btn" @click="testApi">测试连接</button>
        <button class="add-btn" @click="handleAdd">添加用户</button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      加载中...
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- 用户列表 -->
    <div v-else class="table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th></th>
            <th>用户名</th>
            <th>邮箱</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in pagedUsers" :key="user.id">
            <td>
              <div class="avatar">
                <img 
                  :src="user.avatar || '/images/default-avatar.png'" 
                  :alt="user.username"
                >
              </div>
            </td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <button class="edit-btn" @click="handleEdit(user)">编辑</button>
              <button 
                class="delete-btn" 
                @click="user.id && handleDelete(user.id)"
              >删除</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 分页组件 -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          class="page-btn" 
          :disabled="currentPage === 1"
          @click="handlePageChange(currentPage - 1)"
        >
          上一页
        </button>
        <span class="page-info">
          第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
        </span>
        <button 
          class="page-btn" 
          :disabled="currentPage === totalPages"
          @click="handlePageChange(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </div>

    <!-- 添加/编辑用户对话框 -->
    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog">
        <h3>{{ currentUser.id ? '编辑用户' : '添加用户' }}</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-item avatar-upload">
            <label>头像</label>
            <div class="avatar-wrapper">
              <img 
                :src="avatarPreview || currentUser.avatar || '/images/default-avatar.png'" 
                alt="头像预览"
              >
              <input 
                type="file" 
                accept="image/*"
                @change="handleAvatarChange"
                ref="fileInput"
              >
              <button type="button" class="upload-btn" @click="triggerFileInput">
                更换头像
              </button>
            </div>
          </div>
          <div class="form-item">
            <label>用户名<span class="required">*</span></label>
            <input 
              v-model="currentUser.username" 
              type="text" 
              required
              placeholder="请输入用户名"
            >
          </div>
          <div class="form-item">
            <label>邮箱<span class="required">*</span></label>
            <input 
              v-model="currentUser.email" 
              type="email"
              required
              placeholder="请输入邮箱"
            >
          </div>
          <div class="form-item">
            <label>密码{{ !currentUser.id ? '*' : '' }}</label>
            <input 
              v-model="currentUser.password" 
              type="password"
              :required="!currentUser.id"
              placeholder="请输入密码"
            >
          </div>
          <div class="dialog-footer">
            <button type="button" class="cancel-btn" @click="closeDialog">取消</button>
            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              {{ isSubmitting ? '提交中...' : '确定' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { userApi, type User } from '@/api/users'
import config from '@/config'
import axios from 'axios'

const PAGE_SIZE = 10
const baseURL = config.baseURL

export default defineComponent({
  name: 'UsersView',
  setup() {
    const users = ref<User[]>([])
    const loading = ref(false)
    const error = ref('')
    const showDialog = ref(false)
    const isSubmitting = ref(false)
    const currentPage = ref(1)
    const fileInput = ref<HTMLInputElement | null>(null)
    const avatarPreview = ref('')
    const currentUser = ref<User>({
      username: '',
      email: '',
      password: ''
    })

    const pagedUsers = computed(() => {
      const start = (currentPage.value - 1) * PAGE_SIZE
      const end = start + PAGE_SIZE
      return users.value.slice(start, end)
    })

    const totalPages = computed(() => Math.ceil(users.value.length / PAGE_SIZE))

    const fetchUsers = async () => {
      loading.value = true
      error.value = ''
      try {
        console.log('开始获取用户列表...')
        const response = await userApi.getUsers()
        if (response.data) {
          users.value = Array.isArray(response.data) ? response.data : []
          console.log('获取到用户列表:', users.value)
        } else {
          throw new Error('返回数据格式不正确')
        }
      } catch (err: any) {
        console.error('获取用户列表失败:', err)
        error.value = err.response?.data?.message || 
                     err.message || 
                     '获取用户列表失败，请稍后重试'
      } finally {
        loading.value = false
      }
    }

    // 在组件挂载时获取用户列表
    onMounted(() => {
      console.log('组件已挂载，开始获取用户列表')
      fetchUsers()
    })

    const handlePageChange = (page: number) => {
      if (page < 1 || page > totalPages.value) return
      currentPage.value = page
    }

    const handleAdd = () => {
      currentUser.value = {
        username: '',
        email: '',
        password: ''
      }
      avatarPreview.value = ''
      showDialog.value = true
    }

    const handleEdit = (user: User) => {
      currentUser.value = { ...user }
      avatarPreview.value = user.avatar || ''
      showDialog.value = true
    }

    const handleDelete = async (id: number) => {
      if (!confirm('确定要删除这个用户吗？')) return
      try {
        const response = await userApi.deleteUser(id)
        if (response.data?.success) {
          await fetchUsers()
        } else {
          throw new Error(response.data?.message || '删除失败')
        }
      } catch (err: any) {
        console.error('删除用户失败:', err)
        alert(err.response?.data?.message || err.message || '删除失败，请重试')
      }
    }

    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    const handleAvatarChange = async (event: Event) => {
      const input = event.target as HTMLInputElement
      if (!input.files?.length) return

      const file = input.files[0]
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        return
      }

      // 预览图片
      const reader = new FileReader()
      reader.onload = (e) => {
        avatarPreview.value = e.target?.result as string
      }
      reader.readAsDataURL(file)

      // 上传图片
      const formData = new FormData()
      formData.append('avatar', file)

      try {
        const response = await fetch(`${baseURL}/upload`, {
          method: 'POST',
          body: formData
        })
        const data = await response.json()
        currentUser.value.avatar = data.url
      } catch (error) {
        console.error('上传头像失败:', error)
        alert('上传头像失败，请重试')
      }
    }

    const handleSubmit = async () => {
      if (!currentUser.value.username || !currentUser.value.email) {
        alert('请填写必填字段')
        return
      }

      isSubmitting.value = true
      try {
        let response
        if (currentUser.value.id) {
          response = await userApi.updateUser(currentUser.value.id, currentUser.value)
        } else {
          response = await userApi.addUser(currentUser.value)
        }

        if (response.data?.success) {
          await fetchUsers()
          showDialog.value = false
        } else {
          throw new Error(response.data?.message || '操作失败')
        }
      } catch (err: any) {
        console.error('保存用户失败:', err)
        alert(err.response?.data?.message || err.message || '保存失败，请重试')
      } finally {
        isSubmitting.value = false
      }
    }

    const closeDialog = () => {
      showDialog.value = false
      currentUser.value = {
        username: '',
        email: '',
        password: ''
      }
      avatarPreview.value = ''
    }

    const testApi = async () => {
      try {
        console.log('测试 API 连接...')
        console.log('配置信息:', {
          baseURL,
          fullUrl: `${window.location.origin}${baseURL}/users`
        })

        // 使用 axios 直接测试
        const response = await axios.get(`${baseURL}/users`)
        console.log('测试成功:', response)
        alert('API 连接成功！')
      } catch (err: any) {
        console.error('测试失败:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          config: err.config
        })
        alert(`API 连接失败: ${err.message}`)
      }
    }

    return {
      pagedUsers,
      loading,
      error,
      showDialog,
      currentUser,
      isSubmitting,
      currentPage,
      totalPages,
      fileInput,
      avatarPreview,
      handleAdd,
      handleEdit,
      handleDelete,
      handleSubmit,
      handlePageChange,
      handleAvatarChange,
      triggerFileInput,
      closeDialog,
      testApi
    }
  }
})
</script>

<style scoped lang="scss">
.users {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h2 {
      margin: 0;
      color: #333;
    }

    .header-buttons {
      display: flex;
      gap: 10px;
    }

    .test-btn {
      padding: 8px 16px;
      background-color: #52c41a;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #73d13d;
      }
    }

    .add-btn {
      padding: 8px 16px;
      background-color: #1890ff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #40a9ff;
      }
    }
  }

  .table-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow-x: auto;
  }

  .user-table {
    width: 100%;
    border-collapse: collapse;

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #f0f0f0;
    }

    th {
      background-color: #fafafa;
      font-weight: 600;
      color: #333;
    }

    tr:hover {
      background-color: #fafafa;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #f0f0f0;
      border: 2px solid #e8e8e8;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .edit-btn, .delete-btn {
      padding: 4px 8px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 8px;
    }

    .edit-btn {
      background-color: #1890ff;
      color: white;

      &:hover {
        background-color: #40a9ff;
      }
    }

    .delete-btn {
      background-color: #ff4d4f;
      color: white;

      &:hover {
        background-color: #ff7875;
      }
    }
  }

  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dialog {
    background: white;
    padding: 24px;
    border-radius: 8px;
    width: 500px;
    max-width: 90%;

    h3 {
      margin: 0 0 24px 0;
      color: #333;
    }

    .avatar-upload {
      .avatar-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;

        img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e8e8e8;
          background-color: #f0f0f0;
        }

        input[type="file"] {
          display: none;
        }

        .upload-btn {
          padding: 6px 12px;
          background-color: #f0f0f0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          color: #666;

          &:hover {
            background-color: #e0e0e0;
          }
        }
      }
    }

    .form-item {
      margin-bottom: 16px;

      label {
        display: block;
        margin-bottom: 8px;
        color: #666;

        .required {
          color: #ff4d4f;
          margin-left: 4px;
        }
      }

      input {
        width: 100%;
        padding: 8px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        font-size: 14px;

        &:focus {
          outline: none;
          border-color: #40a9ff;
          box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
        }
      }
    }

    .dialog-footer {
      margin-top: 24px;
      text-align: right;

      button {
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-left: 8px;

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .cancel-btn {
        background-color: white;
        border: 1px solid #d9d9d9;

        &:hover:not(:disabled) {
          border-color: #40a9ff;
          color: #40a9ff;
        }
      }

      .submit-btn {
        background-color: #1890ff;
        color: white;
        border: none;

        &:hover:not(:disabled) {
          background-color: #40a9ff;
        }
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    border-top: 1px solid #f0f0f0;

    .page-btn {
      padding: 6px 12px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      transition: all 0.3s;

      &:hover:not(:disabled) {
        color: #1890ff;
        border-color: #1890ff;
      }

      &:disabled {
        cursor: not-allowed;
        color: #d9d9d9;
        background: #f5f5f5;
      }
    }

    .page-info {
      margin: 0 16px;
      color: #666;
    }
  }

  .loading {
    text-align: center;
    padding: 40px;
    font-size: 16px;
    color: #666;
  }

  .error-message {
    text-align: center;
    padding: 20px;
    margin: 20px 0;
    background-color: #fff2f0;
    border: 1px solid #ffccc7;
    border-radius: 4px;
    color: #ff4d4f;
  }
}
</style>