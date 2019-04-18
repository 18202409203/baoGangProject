export default {
    // 除子节点
    removeAllChildren(div) {
      while (
        div.hasChildNodes() //当div下还存在子节点时 循环继续
      ) {
        div.removeChild(div.firstChild);
      }
    },
    // 补零函数
    addZero(d, n = 2){
      return ( Array(n).fill(0).join("") + d ).slice(-n);
    },
    // 时间格式化
    timeFormat(val) {
      let y = val.getFullYear()
      let m = ('0' + (+val.getMonth () + 1)).slice(-2)
      let d = ('0' + val.getDate ()).slice(-2)
      let h = ('0' + val.getHours()).slice(-2)
      let min = ('0' + val.getMinutes()).slice(-2)
      let s = ('0' + val.getSeconds()).slice(-2)
      return y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s
    }
  }