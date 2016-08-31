Vue.config.debug = true

// 取消 Vue.js 所有的日志与警告。
// Vue.config.silent = true


// 如果关闭了异步模式，Vue 在检测到数据变化时同步更新 DOM。在有些情况下这有助于调试，但是也可能导致性能下降，并且影响 watcher 回调的调用顺序。async: false不推荐用在生产环境中。
Vue.config.async = false

// 1.0.8 添加。开启这个选项后，Vue 可以转换和观察由 Object.defineProperty 定义的 getters/setter。默认关闭，因为会付出一些性能代价，并且不是常用功能。
Vue.config.convertAllProperties = true