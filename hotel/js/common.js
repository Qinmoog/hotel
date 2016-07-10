document.addEventListener("touchmove",function(e){e.preventDefault()},false);
var ls=window.localStorage;
// 解析地址栏中的参数
function getParams(){
   var url=location.search;
   if(!url) return false;
   url=url.substr(1);
   //url=city_id=20&city_name=北京
   // 将所有参数存放到一个对象里
   var arr=url.split("&"),i,len,params,obj={};
   for(i=0,len=arr.length;i<len;i++){
       params=arr[i].split("=");
       obj[params[0]]=decodeURI(params[1]);
   }
   return obj;
}
//第二种利用正则
/*function getParams(name){
   var url=location.search;
   if(!url)return;
   url=url.substr(1);
   //url=city_id=20&city_name=北京&date_in=2016-05-18
   var reg=new RegExp('(^|&)'+name+'=([^&]*)');
   var arr=url.match(reg);
   if(arr==null) return false;
   return decodeURI(arr[2]);
}
var cityId=getParams("city_type");
console.log(cityId);*/

//模块化编程（）
// require.js sea.js
/*;(function($){
   var common=function(){
       var index=function(){
          alert("这是index页");
       }
       var list=function(){
          alert("这是list页");
       }
       return {
           index:index,
           list:list
       }
   }()
   window.common=common;
})(Zepto)*/


function Common(){

}
Common.prototype={
  //封装一个get请求的ajax
  //get请求，data,url是参数，callback是成功之后执行的回调函数，async是异步还是同步
  access_server : function(url,data,callback,asy){
    var that = this;
    //显示加载动画
    this.showLoading();
    //asy是可选的，默认是true
    //asy = typeof(asy) === "undefined"?true:asy; 
    $.ajax({
      url : url,
      data : data,
      type : "get",
      dataType : 'json',
      async : asy,
      success : function(data){
        //删除加载动画
       // console.log(data)
        setTimeout(function(){
          that.hideLoading();
          callback && callback(data);
        },500)
      },
      error : function(){
        that.hideLoading();
        //显示弹出层
        //that.showDialog("请求失败,请重新刷新","确认",function(){})
      } 
    })
  },
  //显示遮罩层
  showMask:function(){
    if($("#ui-id-mark").length==0){
      $("<div class='ui-id-mark' id='ui-id-mark'></div>").appendTo($("body"));
    }
  },
  //隐藏遮罩层
  hideMask:function(){
    if($("#ui-id-mark").length>0){
      $("#ui-id-mark").remove();
    }
    
  },
  //显示加载动画
  showLoading:function(){
    this.showMask();
    if($("#ui-id-loading").length==0){
      $("<div class='ui-id-loading' id='ui-id-loading'><img src='../img/loading.gif'/></div>").appendTo($('body'));
    }
  },
   //隐藏加载动画
  hideLoading:function(){
    this.hideMask();
    $("#ui-id-loading").remove();
  },
  //显示弹出框
  showDialog : function(msg,btn,callback){
      var that = this;
      this.showMask();
      //创建弹出框
      if($("#ui-id-dialog").length==0){
        var html = '<div class="ui-id-dialog" id="ui-id-dialog">'
                     +'<div class="tipcontainer">'
                      +'<div class="content">'+msg+'</div>'
                      +'<p><a href="javascript:void(0)" id="ui-id-btn">'+btn+'</a></p>'
                     +'</div>'
                    +'</div>';
        $(html).appendTo($("body"));
      }
      $("#ui-id-btn").on("click",function(){
        that.hideMask();
        $("#ui-id-dialog").remove();
        callback && callback();
      })
  },
  //检测手机号码
  checkPhone : function(phone){
    var reg=/^1[34578]\d{9}$/;
    if(reg.test(phone)){
      return true;
      //console.log('电话号码正确')
    }else{
      return false;
      //console.log('电话号码错误')
    }
  },
  //检测登录密码
  checkPwd : function(pwd){
    var reg=/^[\w\.]{6,12}$/;
    if(reg.test(pwd)){
      return true;
    }else{
      return false;
    }
  },
  //检测身份证
  checkCard : function(card){
    var reg=/^\d{17}(\d|x)$/;
    if(reg.test(card)){
      return true;
    }else{
      return false;
    }
  }
}

var common = new Common();

//common.access_server("data/hotels.json",{},function(){})

function addZero(num){
  //判断1,2,3……前加0;也就是不足2位用0补齐
  if(num<10){
    return '0'+num
  }else{
    return num;
  }
}

//生成指定日期
function createDate(n,option){
  //如果n没有值则用0否则用n
  n = typeof(n) === "undefined"?0:n;
  //获取当前日期
  var date = option?new Date(option.year,option.month-1,option.day):new Date();
  var times = date.getTime(); //从1970年开始s到现在的毫秒数
  //等价于var times = date*1;
  //设置一个目标日期
  var temp = new Date();
  //第一种方法
  //temp.setDate(date.getDate()+n)
  //console.log(temp.getMonth()+1+','+temp.getDate());
  //第二种方法
  //var temp = new Date(date.getFullYear(),date.getMonth(),date.getDate()+n);
  //console.log(temp.getMonth()+1+','+temp.getDate());
  //第三种方法
  temp.setTime(times+n*86400000);
  var year = temp.getFullYear();
  var month = addZero(temp.getMonth()+1);
  var day = addZero(temp.getDate());
  return year + '-' + month + '-' + day;

}

//显示日历组件
/*
    ele:在哪个DOM元素上调用
    minDate:起始日期
    maxDate:最大日期
*/

function showCalendar($ele,minDate,maxDate,pageType){
  $ele.calendar({
    minDate:minDate,
    maxDate:maxDate,
    //日历翻到上下页
    swipeable:true,
    hide:function(){
      changeDateOut(pageType);
    } //日历隐藏之后执行的回调函数
  }).calendar("show");

  $('.shadow').remove();
  $('.ui-slideup-wrap').addClass('calenderbox');
  var shadow=$('<span class="shadow"></span>');
  $('.calenderbox').append(shadow);
  $('.ui-slideup').addClass('calender');
}

//将日期格式的字符串转换为数字
function changeDateToNum(str){
  //第一种方法
  //var arr = str.split('-').join("");
  //console.log(arr);
  //第二种方法
  str = str.replace(/-/g,"");
  return str;//20160518
}

////将日期格式的字符串转换为字符串
function changeDateToArr(str){
  return str.split('-');
}

//日历隐藏之后执行的回调函数
function changeDateOut(action){
  //获取现在的入住日期和离店日期
  var dateIn = $("#date_in").val(),
      dateInArr = changeDateToArr(dateIn),
      newDateOut = dateOut = $("#date_out").val(),
      inNum = changeDateToNum(dateIn),
      outNum = changeDateToNum(dateOut);

  //如果入住日期大于等于离店日期
  if(inNum>=outNum){
    //生成当前日期的入住日期之后的1天的日期
    newDateOut = createDate(1,{year:dateInArr[0],month:dateInArr[1],day:dateInArr[2]})
     
  }
  $("#date_out").val(newDateOut);

  //如果action为undefined，是index页
  if (!action)return;
  //显示入住离店的月和日
  $("#inText").text(showMonDay(dateIn));
  $("#outText").text(showMonDay(newDateOut));

  //如果是列表页，否则是内容页
  if(action=='list'){
    POST.dateIn = dateIn
    POST.dateOut = newDateOut
    POST.pageNo = 1
    getDataFromList('list')
  }else{

  }

}

//显示入住离店的月和日
function showMonDay(str){
  //str = 2016-05-20
  var month = str.substr(5,2);
  var day = str.substr(8);
  return month + '月' + day + '日';
}

function ifLogined(url){
  common.access_server('../server/check.php',{},function(data){
    if(data.if_logined==0){
      location.href='login.html'
      ls.setItem('orderUrl',url)
    }else{
      location.href=url
    }
  })
}