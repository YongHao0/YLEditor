<template>
  <div class="editor-article-container">
    <div :id="ContentId" />

    <div class="editor-covers-title ant-col ant-form-item-label">
      <label title="封面图" class="">封面图</label>
    </div>
    <div class="editor-covers">
      <a-tabs
        v-model="activeCoverType"
      >
        <a-tab-pane
          v-for="(coverTabItem, type) in CoverTabs"
          :key="type"
          :tab="coverTabItem.name"
        >
          <component
            :is="coverTabItem.component" :file-list="covers[type]"
            :title="content.title"
            @remove="remove($event, type)"
          />
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="editor-covers-opts">
      <!-- <a-button>使用正文图片</a-button> -->
      <a-upload
        class="editor-upload-btn"
        :file-list="[]"
        :multiple="false"
        :before-upload="onFileChanged"
      >
        <a-button>上传图片</a-button>
      </a-upload>
    </div>

    <!-- 摘要 -->
  </div>
</template>

<script>
import { CoverType } from '@/constant/content'
import { defineComponent, onMounted, nextTick, reactive, ref } from '@vue/composition-api'
import ATab from 'ant-design-vue/lib/tabs'
import AButton from 'ant-design-vue/lib/button'
import 'ant-design-vue/lib/button/style'
import 'ant-design-vue/lib/tabs/style'
import WangEditor from 'wangeditor'
import SingleCover from './covers/Single.vue'
import BigCover from './covers/Big.vue'
import ThreeCover from './covers/Three.vue'
import AUpload from 'ant-design-vue/lib/upload'
import { options } from '@/index'
import $message  from 'ant-design-vue/lib/message'
import 'ant-design-vue/lib/message/style'

const CoverTabs = {
  [CoverType.THREE_IMAGE]: { name: '三图', component: ThreeCover, maxCovers: 3 },
  [CoverType.SINGLE_IMAGE]: { name: '单图', component: SingleCover, maxCovers: 1 },
  [CoverType.BIG_IMAGE]: { name: '大图', component: BigCover, maxCovers: 1 },
}

function createEditor(id, props, emit) {
  const editor = new WangEditor(`#${id}`)
  
  editor.config.uploadImgServer = true
  editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 限制 2M
  editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
  editor.config.uploadImgMaxLength = 1 // 一次最多上传 5 个图片
  editor.config.customUploadImg = function (resultFiles, insertImgFn) {
    const file = resultFiles[0]
    const hide = $message.loading('正在上传')
    options.uploadFile && options.uploadFile(file).then(url => {
      insertImgFn(url)
    }).catch(({ message }) => {
      $message.error(message)
    }).finally(() => {
      hide && hide()
    })
  }

  editor.config.onchange = function (newHtml) {
    const content = props.content
    content.text = newHtml
    emit('change', content)
  }
  
  editor.create()
}

export default defineComponent({
  components: {
    'a-tabs': ATab,
    'a-tab-pane': ATab.TabPane,
    'a-button': AButton,
    'a-upload': AUpload
  },
  model: {
    prop: 'content',
    event: 'change'
  },
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const ContentId = 'ArticleContent'
    const covers = reactive({
      [CoverType.THREE_IMAGE]: [],
      [CoverType.SINGLE_IMAGE]: [],
      [CoverType.BIG_IMAGE]: []
    })
    const activeCoverType = ref(CoverType.THREE_IMAGE)

    onMounted(() => {
      nextTick(() => {
        createEditor(ContentId, props, emit)
      })
    })

    function onFileChanged(file) {
      const tabOptions = CoverTabs[activeCoverType.value]
      const fileList = covers[activeCoverType.value]
      if (fileList.length >= tabOptions.maxCovers) {
        return $message.error('封面图已满')
      }

      const hide = $message.loading('正在上传')
      options.uploadFile(file).then(url => {
        const content = props.content
        covers[activeCoverType.value].push(url)
        content.coverPics = covers[activeCoverType.value]
        emit('change', content)
      }).catch(({ message }) => {
        $message.error(message)
      }).finally(() => {
        hide && hide()
      })
      return false
    }

    function remove(fileParams, type) {
      covers[type].splice(fileParams.i, 1)
      covers[type] = covers[type].filter((cover) => cover)
      const content = props.content
      content.coverPics = covers[type]
      emit('change', content)
    }

    return {
      activeCoverType,
      ContentId,
      CoverTabs,
      CoverType,
      covers,
      // coverList,
      onFileChanged,
      remove
    }
  }
})
</script>

<style lang="less" scoped>
.editor-covers-title {
  margin-top: 20px;
}

.editor-covers-opts {
  margin-top: 10px;
}

.editor-covers {
  width: 400px;
  border: 1px solid #e1e5e9;
}
.editor-upload-btn {
  display: inline-block;
  margin-left: 0;
}
</style>

<style lang="less">
.editor-article-container {
  .ant-tabs-nav {
    width: 100%;
    >div {
      display: flex;
      .ant-tabs-tab {
        flex: 1;
        margin: 0;
        text-align: center;
      }
    }
  }
}
.ant-message {
  z-index: 30000;
}
</style>