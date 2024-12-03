<template>
  <div class="words">
    <h2>单词数据</h2>
    
    <!-- 搜索栏 -->
    <div class="operation-bar">
      <div class="search">
        <input type="text" placeholder="搜索单词..." v-model="searchKeyword">
        <button @click="handleSearch">搜索</button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>
    
    <!-- 错误提示 -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- 数据表格 -->
    <div v-if="!loading && !error" class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>单词</th>
            <th>翻译</th>
            <th>查询次数</th>
            <th>最后查询时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="word in words" :key="word.id">
            <td>{{ word.id }}</td>
            <td>{{ word.word }}</td>
            <td>{{ word.translation }}</td>
            <td>{{ word.count }}</td>
            <td>{{ word.lasttime }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { wordApi } from '@/api/words'

export default defineComponent({
  name: 'WordsView',
  setup() {
    const words = ref([])
    const loading = ref(false)
    const error = ref('')
    const searchKeyword = ref('')

    const fetchWords = async () => {
      loading.value = true
      try {
        const response = await wordApi.getWords()
        words.value = response.data
      } catch (err: any) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    onMounted(fetchWords)

    return {
      words,
      loading,
      error,
      searchKeyword
    }
  }
})
</script>

<style scoped lang="scss">
.words {
  padding: 20px;

  .operation-bar {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .search {
      input {
        padding: 8px;
        width: 200px;
        margin-right: 10px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
      }

      button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background: #1890ff;
        color: white;

        &:hover {
          background: #40a9ff;
        }
      }
    }
  }

  .loading, .error {
    text-align: center;
    padding: 20px;
  }

  .error {
    color: #ff4d4f;
  }

  .table-container {
    margin-bottom: 20px;
    
    table {
      width: 100%;
      border-collapse: collapse;
      
      th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #f0f0f0;
      }
      
      th {
        background: #fafafa;
        font-weight: 500;
      }
    }
  }
}
</style>
