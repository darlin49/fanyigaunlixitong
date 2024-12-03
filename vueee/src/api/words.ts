import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8888/api',  // 直接指向后端完整地址
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

export const wordApi = {
  getWords() {
    return api.get('/words')  // 使用新的路径
  },
  searchWord(name: string) {
    return api.get(`/words/search?name=${name}`)
  },
  addWord(word: any) {
    return api.post('/words', word)
  },
  updateWord(id: number, word: any) {
    return api.put(`/words/${id}`, word)
  },
  deleteWord(id: number) {
    return api.delete(`/words/${id}`)
  }
}

export default wordApi 