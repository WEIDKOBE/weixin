Vue.filter('extract', function (value, keyToExtract) {
  return value.map(function (item) {
    return item[keyToExtract]
  })
});

Vue.filter('reverse', function (value) {
  return value.split('').reverse().join('')
}) 

Vue.filter('wrap', function (value, begin, end) {
  return begin + value + end
})

Vue.filter('concat', function (value, input) {
  // 这里 `input` === `this.userInput`
  return value + input
})

Vue.filter('datetime', function (date) {
    var now = +new Date;
    var text='';
    var distance = now - date;
    if(distance <= 86400*1000 ){
        text = "大约" + Math.round((now - date)/3600000)+ "小时以前";
    }else if(distance < 86400000*30){
        text = Math.round((now - date)/86400000)+ "天以前";
    }else if(distance < 86400000*30*12){
        text = Math.round((now - date)/86400000/30)+ "个月以前";
    }else{
        text = "一年以前";
    }
    return text;
})