function init(){
   showCity();
   showDate();
   bindEvent();
}

function showCity(){
   var params=getParams(),
       $cityName=$("#city_name"),
       $cityId=$("#city_id");
   // 如果地址栏中没有参数，则显示默认值
   if(!params){
      $cityName.text("北京");
      $cityId.val("28");
   }else{
      $cityName.text(params.city_name);
      $cityId.val(params.city_id);
   }
   ls.setItem("cityId",$cityId.val());
   ls.setItem("cityName",$cityName.text());
}

//显示日历
function showDate(){
  //显示入住日期和离店日期
  $("#date_in").val(createDate());
  $("#date_out").val(createDate(1));

  //激活文本框是调用日历组件
  var today = new Date();
  //激活入住
  $("#date_in").focus(function(){
     var minDate = new Date(today.getFullYear(),today.getMonth(),today.getDate());
     var maxDate = new Date(today.getFullYear(),today.getMonth(),today.getDate()+90);
     showCalendar($(this),minDate,maxDate);
  })
  //激活
  $("#date_out").focus(function(){
     var minDate = new Date(today.getFullYear(),today.getMonth(),today.getDate());
     var maxDate = new Date(today.getFullYear(),today.getMonth(),today.getDate()+91);
     showCalendar($(this),minDate,maxDate);
  })
}

function bindEvent(){
  //搜索
  $("#search").click(function(){
    var cityId = $("#city_id").val(),
        dateIn = $("#date_in").val(),
        dateOut = $("#date_out").val(),
        name =encodeURI( $.trim($("#name").val()) ),
        url = 'html/hotel.html?city_id='+cityId+'&date_in='+dateIn+'&date_out='+dateOut+'&name='+name;
    $(this).attr("href",url);
    console.log(cityId);
  })
}

init();