;(function(win, doc) {
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
});
  Vue.component("c-footer", {
  className: 'footer',
  template: "\n\n<div class=\"footer\">\n    仅供学习FIS3与vuejs使用，设计与内容版权归简书所有。<a target=\"_blank\" href=\"http://fis.baidu.com\">FIS首页</a>\n</div>\n",
  ready: function(){
      var self = this;
  }
});;


  Vue.partial('my-partial', '<p>This is a partial! {{msg}}</p>')

  var vm = new Vue({
    el: '#list-example',
    data: {
      partialId: 'my-partial',
      users: [
        {
          name: 'Chuck Norris',
          email: 'chuck@norris.com'
        },
        {
          name: 'Bruce Lee',
          email: 'bruce@lee.com'
        }
      ],
      users1: [
        { name: 'Bruce' }, 
        { name: 'Chuck' }
      ],
      selectedUser: 'Chuck'
    },
    computed: {
      fullName: {
        get: function(){
          // return this.firstName + '  ' + this.lastName;
        },
        set: function(newValue){
          // var names = newValue.split(' ');
          // this.firstName = names[0];
          // this.lastName = names[names.length-1]
        }
      }
    },
    methods: {
      toggle: function (item) {
        // item.done = !item.done
      },
      submit: function (msg, e) {
        console.log(e);
        // e.stopPropagation()
      },
      submit1: function(e){
        // console.log(e.target.value);
      }
    }
  })

})(window, document);