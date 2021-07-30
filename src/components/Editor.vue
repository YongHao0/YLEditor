<template>
  <a-form-model class="yl-editor-box">
    <a-form-model-item label="标题">
      <a-input v-model="currentContent.title" class="eidtor-input" placeholder="请输入标题" />
    </a-form-model-item>

    <a-form-model-item label="类目">
      <a-tree-select
        v-model="currentContent.categoryId"
        class="eidtor-input"
        dropdown-class-name="eidtor-category-dropdown"
        placeholder="请选择指定类目"
        :dropdown-style="{ maxHeight: '350px' }"
        :tree-data="categories"
        :replace-fields="{
          children: 'childList',
          key: 'path',
          value: 'path',
          title: 'name'
        }"
      />
    </a-form-model-item>

    <a-form-model-item label="创作者">
      <a-select
        class="eidtor-input"
        show-search
        :value="searchAuthorName"
        label-in-value
        placeholder="请输入创作者姓名"
        :filter-option="false"
        :not-found-content="isAuthorLoading ? undefined : null"
        @search="fetchAuthors"
        @change="handleAuthorChange"
      >
        <template #notFoundContent>
          <a-spin v-if="isAuthorLoading" size="small" />
        </template>
        
        <a-select-option v-for="author in authorList" :key="author.id">
          {{ author.authorName }}
        </a-select-option>
      </a-select>
    </a-form-model-item>

    <a-form-model-item :label="isVideo ? '视频' : '正文'">
      <component :is="editorComponent" v-model="currentContent" />
    </a-form-model-item>

  </a-form-model>
</template>

<script>
import { ContentType } from '@/constant/content'
// import { T_Content } from '@/types/library'
import { defineComponent, reactive, ref } from '@vue/composition-api'
import Article from './Article.vue'
import Video from './Video.vue'
import AFormModel from 'ant-design-vue/lib/form-model/Form'
import AFormModelItem from 'ant-design-vue/lib/form-model/FormItem'
import AInput from 'ant-design-vue/lib/input'
import ASelect from 'ant-design-vue/lib/select'
import ATreeSelect from 'ant-design-vue/lib/tree-select'
import ASpin from 'ant-design-vue/lib/spin'
import 'ant-design-vue/lib/spin/style'
import 'ant-design-vue/lib/tree-select/style'

import 'ant-design-vue/lib/form-model/style'
import 'ant-design-vue/lib/input/style'
import $message  from 'ant-design-vue/lib/message'
import 'ant-design-vue/lib/message/style'

import { options } from '@/index'

const EditorComponent = {
  [ContentType.ARTICLE]: Article,
  [ContentType.VIDEO]: Video
}

export default defineComponent({
  components: {
    'a-form-model': AFormModel,
    'a-form-model-item': AFormModelItem,
    'a-input': AInput,
    'a-tree-select': ATreeSelect,
    'a-select': ASelect,
    'a-select-option': ASelect.Option,
    'a-spin': ASpin
  },
  props: {
    contentType: {
      type: String,
      default: ContentType.ARTICLE
    },
    content: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  emits: [''],
  setup(props) {
    const categories = reactive([])
    const isAuthorLoading = ref(false)
    const authorList = reactive([])
    const currentContent = reactive(props.content)
    const searchAuthorName = ref(undefined)

    const isVideo = props.contentType === ContentType.VIDEO

    options.getCategories && options.getCategories().then((list) => {
      categories.push(...list)
    }).catch(({ message }) => {
      $message.error(`获取类目失败, ${message}`)
    })

    function fetchAuthors(name) {
      isAuthorLoading.value = true
      options.getAuthorList(name).then(list => {
        authorList.splice(0, authorList.length)
        authorList.push(...list)
      }).finally(() => {
        isAuthorLoading.value = false
      })
    }

    function handleAuthorChange(value) {
      currentContent.authorId = value.key
      searchAuthorName.value = value
    }

    return {
      editorComponent: EditorComponent[props.contentType],
      categories,
      isAuthorLoading,
      fetchAuthors,
      authorList,
      handleAuthorChange,
      currentContent,
      isVideo,
      searchAuthorName
    }
  },
})
</script>

<style lang="less" scoped>
.eidtor-input {
  width: 400px;
}
</style>

<style lang="less">
.yl-editor-box {
  .ant-form-item-label label {
    font-size: 15px;
  }
  .ant-row {
    margin-bottom: 20px;
  }
}
.eidtor-category-dropdown {
  z-index: 20000;
}
.w-e-toolbar {
  z-index: 101 !important;
}
.w-e-text-container {
  z-index: 100 !important;
}
</style>