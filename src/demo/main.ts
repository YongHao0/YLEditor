import { MockCategoryList } from '@/mock'
import CompositionApi, { createApp, h } from '@vue/composition-api'
import Vue from 'vue'
import Editor from '../index'

import App from './App.vue'

Vue.use(Editor, {
  getCategories: () => {
    return Promise.resolve(MockCategoryList)
  },
  uploadFile: () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('https://inforec-video.nos-eastchina1.126.net/inforec-20210421-976a246f38702cf045615fd2f3b99642.mp4')
      });
    })
  },
  getAuthorList(name: string) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { id: '1420676997570420737', authorName: '孙悟空' },
          { id: '14206769975704237', authorName: '猪八戒' },
          { id: '142067699757042', authorName: '沙和尚' }
        ])
      }, 800);
    })
  }
})
Vue.use(CompositionApi)

createApp({
  render: () => h(App),
}).mount(
  document.getElementById('root')
  || document.body
)