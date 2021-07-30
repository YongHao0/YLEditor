export type T_Category = {
  categoryId: number,
  name: string,
  path: string,
  childList: T_Category[]
}

export type T_Author = {
  createTime: string, // 创建时间
  updateTime: string, // 修改时间
  id: string, // 创作者编号
  bizId: string, // 业务编号
  authorName: string, // 创作者名称
  avatar: string,// 头像
  initCategoryId: string, // 初始类目编号
  authorOriginType: { // 来源
    label: string,
    value: number
  },
  introduction: string, // 简介
  attest: string, // 认证信息
  initCategory: { // 初始类目信息
    id: string,
    name: string
  }
}

export type T_Content = {
  title: string,
  url: string, // 视频地址
  categoryId: string,
  coverPics: string[],
  coverType: string,
  authorId: string,
  text: string
}