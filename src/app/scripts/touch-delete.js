/*
* @Author: WD
* @Date:   2016-06-27 15:50:12
* @Last Modified by:   WD
* @Last Modified time: 2016-06-27 19:08:30
*/



//window.addEventListener('load',function(){

          window.addEventListener('touchstart',function(event){
              var initX;        //触摸位置
             var moveX;        //滑动时的位置
             var X = 0;        //移动距离
             var objX = 0;    //目标对象位置
            console.log(1);
              event.preventDefault();
              var obj = event.target.parentNode;
              if(obj.className == "touch"){
                  initX = event.targetTouches[0].pageX;
                  objX =(obj.style.WebkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
              }
              if( objX == 0){
                  window.addEventListener('touchmove',function(event) {
                      event.preventDefault();
                      var obj = event.target.parentNode;
                      if (obj.className == "touch") {
                          moveX = event.targetTouches[0].pageX;
                          X = moveX - initX;
                          if (X >= 0) {
                              obj.style.WebkitTransform = "translateX(" + 0 + "px)";
                          }
                          else if (X < 0) {
                              var l = Math.abs(X);
                              obj.style.WebkitTransform = "translateX(" + -l + "px)";
                              if(l>80){
                                  l=80;
                                  obj.style.WebkitTransform = "translateX(" + -l + "px)";
                              }
                          }
                      }
                  });
              }
              else if(objX<0){
                  window.addEventListener('touchmove',function(event) {
                      event.preventDefault();
                      var obj = event.target.parentNode;
                      if (obj.className == "touch") {
                          moveX = event.targetTouches[0].pageX;
                          X = moveX - initX;
                          if (X >= 0) {
                              var r = -80 + Math.abs(X);
                              obj.style.WebkitTransform = "translateX(" + r + "px)";
                              if(r>0){
                                  r=0;
                                  obj.style.WebkitTransform = "translateX(" + r + "px)";
                              }
                          }
                          else {     //向左滑动
                              obj.style.WebkitTransform = "translateX(" + -80 + "px)";
                          }
                      }
                  });
              }

          })
          window.addEventListener('touchend',function(event){
              event.preventDefault();
              var obj = event.target.parentNode;
              if(obj.className == "touch"){
                  objX =(obj.style.WebkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
                  if(objX>-40){
                      obj.style.WebkitTransform = "translateX(" + 0 + "px)";
                      objX = 0;
                  }else{
                      obj.style.WebkitTransform = "translateX(" + -80 + "px)";
                      objX = -80;
                  }
              }
          })
     //})