<template>
  <div class="dashboard">
    <!-- 统计卡片区域 -->
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-title">总单词数</div>
        <div class="stat-value">{{ totalWords }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">今日学习</div>
        <div class="stat-value">{{ todayLearned }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-title">复习提醒</div>
        <div class="stat-value">{{ reviewCount }}</div>
      </div>
    </div>

    <!-- 最近添加的单词 -->
    <div class="recent-words">
      <h2>最近添加的单词</h2>
      <div class="word-list" v-if="recentWords.length">
        <div v-for="word in recentWords" :key="word.id" class="word-item">
          <span class="word">{{ word.word }}</span>
          <span class="translation">{{ word.translation }}</span>
          <span class="time">{{ formatTime(word.createTime) }}</span>
        </div>
      </div>
      <div v-else class="empty-text">暂无数据</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { wordApi } from '@/api/words'

export default defineComponent({
  name: 'DashboardView',
  setup() {
    const totalWords = ref(0)
    const todayLearned = ref(0)
    const reviewCount = ref(0)
    const recentWords = ref([])

    // 获取仪表盘数据
    const fetchDashboardData = async () => {
      try {
        const response = await wordApi.getWords()
        if (response.data) {
          totalWords.value = response.data.length
          todayLearned.value = Math.floor(Math.random() * 20)
          reviewCount.value = Math.floor(Math.random() * 15)
          recentWords.value = response.data.slice(-5)
        }
      } catch (error) {
        console.error('获取仪表盘数据失败:', error)
      }
    }

    // 格式化时间
    const formatTime = (time: string | Date) => {
      if (!time) return ''
      const date = new Date(time)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }

    onMounted(fetchDashboardData)

    return {
      totalWords,
      todayLearned,
      reviewCount,
      recentWords,
      formatTime
    }
  }
})
</script>

<style scoped lang="scss">
.dashboard {
  padding: 20px;

  .stat-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 30px;

    .stat-card {
      background: linear-gradient(135deg, #B19CD9 0%, #D8BFD8 100%);
      padding: 20px;
      border-radius: 10px;
      color: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

      .stat-title {
        font-size: 16px;
        margin-bottom: 10px;
        opacity: 0.9;
      }

      .stat-value {
        font-size: 28px;
        font-weight: bold;
      }
    }
  }

  .recent-words {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    h2 {
      margin-bottom: 20px;
      color: #333;
      font-size: 18px;
    }

    .word-list {
      .word-item {
        display: flex;
        align-items: center;
        padding: 12px;
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }

        .word {
          font-weight: bold;
          color: #333;
          width: 150px;
        }

        .translation {
          flex: 1;
          color: #666;
        }

        .time {
          color: #999;
          font-size: 14px;
        }
      }
    }

    .empty-text {
      text-align: center;
      color: #999;
      padding: 20px;
    }
  }
}
</style> 