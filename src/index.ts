import { VueConstructor } from 'vue/types/umd';
import Editor from './components/Editor.vue'
import { T_Author, T_Category } from './types/library';

type T_Options = {
  getAuthorList?: (name: string) => Promise<T_Author[]>,
  getCategories?: () => Promise<T_Category[]>,
  uploadFile?: (file: File) => Promise<string>
}

export const options: T_Options = {}

function install(Vue: VueConstructor, opts: T_Options): void {
  Vue.component('YlEditor', Editor)
  Object.assign(options, opts)
}
export default {
  install
}