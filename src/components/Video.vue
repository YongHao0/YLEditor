<template>
  <div class="editor-video-box">
    <div class="editor-upload-video-box">
      <a-upload-dragger
        name="file"
        :multiple="false"
        :file-list="[]"
        :before-upload="onVideoChanged"
      >
        <video v-if="videoUrl" class="editor-video" :src="videoUrl" />
        <div v-else>
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">
            点击或拖拽进行上传
          </p>
        </div>
      </a-upload-dragger>      
    </div>

    <div class="editor-covers-title ant-col ant-form-item-label">
      <label title="封面图" class="">封面图</label>
    </div>
    <div class="editor-covers">
      <BigCover
        :file-list="coverPics"
        :title="content.title"
        @remove="remove($event)"
      />
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
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from '@vue/composition-api'
import BigCover from './covers/Big.vue'
import { options } from '@/index'
import AButton from 'ant-design-vue/lib/button'
import AUpload from 'ant-design-vue/lib/upload'
import AUploadDragger from 'ant-design-vue/lib/upload/Dragger'
import 'ant-design-vue/lib/upload/style'
import AIcon from 'ant-design-vue/lib/icon'
import 'ant-design-vue/lib/icon/style'

export default defineComponent({
  components: {
    BigCover,
    'a-upload': AUpload,
    'a-button': AButton,
    'a-upload-dragger': AUploadDragger,
    'a-icon': AIcon
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
    const coverPics = reactive(props.content.coverPics || [])
    const videoUrl = ref(props.content.url)

    function onVideoChanged(file) {
      options.uploadFile(file).then(url => {
        const content = props.content
        content.url = url
        videoUrl.value = url
        emit('change', content)
      })
      return false
    }

    function onFileChanged(file) {
      options.uploadFile(file).then(url => {
        coverPics.push(url)
        const content = props.content
        content.coverPics = coverPics
        emit('change', content)
      })
      return false
    }

    function remove() {
      coverPics.splice(0, coverPics.length)
      const content = props.content
      content.coverPics = coverPics
      emit('change', content)
    }

    return {
      onVideoChanged,
      coverPics,
      onFileChanged,
      remove,
      videoUrl
    }
  },
})
</script>

<style lang="less" scoped>
.editor-covers-title {
  margin-top: 20px;
}
.editor-covers {
  width: 450px;
  border: 1px solid #e1e5e9;
}
.editor-covers-opts {
  margin-top: 10px;
}
.editor-upload-video-box {
  width: 450px;
  height: 180px;
  position: relative;
  .editor-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
  }
}
</style>

<style lang="less">
.editor-video-box {
  .editor-cover-box {
    margin-bottom: 0;

  }
  .editor-covers .editor-cover-container {
    padding: 0;
    width: 100%;
    height: 100%;
    h3 {
      display: none;
    }
  }
}
</style>