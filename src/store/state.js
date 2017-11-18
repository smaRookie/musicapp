import {playMode} from '../common/js/config'
/*
* playing: 是否播放
* fullScreen: 显示全屏播放器还是迷你播放器
* playList： 播放的列表
* sequenceList： 顺序播放的列表
* mode： 播放模式
* currentIndex：当前播放的索引
* */
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1
}

export default state
