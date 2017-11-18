// 创建一个歌手的类 保存歌手id, name的信息

export default class signer {
  // 传入对象 可以不用考虑传入的顺序
  constructor ({id, name}) {
    this.id = id
    this.name = name
    // 对象图片地址 根据id来获取
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
  }
}
