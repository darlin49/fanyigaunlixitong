<template>
  <div class="basic-layout">
    <div class="sidebar">
      <div class="logo">单词管理系统</div>
      <nav class="menu">
        <router-link to="/dashboard" class="menu-item" active-class="active">
          <span class="icon">📊</span>
          首页
        </router-link>
        <router-link to="/users" class="menu-item" active-class="active">
          <span class="icon">👥</span>
          用户管理
        </router-link>
        <router-link to="/words" class="menu-item" active-class="active">
          <span class="icon">📚</span>
          单词管理
        </router-link>
      </nav>
    </div>
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BasicLayout'
})
</script>

<style scoped lang="scss">
.basic-layout {
  display: flex;
  min-height: 100vh;

  .sidebar {
    width: 240px;
    background: linear-gradient(180deg, #B19CD9 0%, #D8BFD8 100%);
    color: white;
    padding: 20px 0;
    
    .logo {
      padding: 16px 24px;
      font-size: 18px;
      font-weight: bold;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 16px;
    }

    .menu {
      .menu-item {
        display: flex;
        align-items: center;
        padding: 12px 24px;
        color: rgba(255, 255, 255, 0.9);
        text-decoration: none;
        transition: all 0.3s;
        
        .icon {
          margin-right: 10px;
          font-size: 18px;
        }

        &:hover {
          color: white;
          background: rgba(255, 255, 255, 0.15);
        }

        &.active {
          color: white;
          background: rgba(255, 255, 255, 0.25);
          position: relative;

          &::after {
            content: '';
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 24px;
            background: white;
            border-radius: 2px 0 0 2px;
          }
        }
      }
    }
  }

  .main-content {
    flex: 1;
    background-color: #f5f5f5;
    padding: 24px;
  }
}
</style> 