var Alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'];
var isc=new iScroll("container");
function init(){
    var cityId = localStorage.getItem("cityId");
    var cityName = localStorage.getItem("cityName");
    $("#cur_city").text(cityName);
    showHotCity();
    showCitys();
    $("#return").click(function(){
      $(this).attr("href",'../index.html?city_id='+cityId+'&city_name='+encodeURI(cityName));
    })
}

// 显示热门城市
function showHotCity(){
   $.ajax({
      url:"../data/hotcity.json",
      type:"get",
      dataType:"json",
      success:function(data){
         renderHotCity(data);
      }
   })
}

// 渲染热门城市
function renderHotCity(data){
    var cityHtml="";
    $.each(data,function(k,name){
        cityHtml+='<li>'
                     +'<a href="../index.html?city_id='+k+'&city_name='+encodeURI(name)+'">'+name+'</a>'
                  +'</li>';
    })
    $("#hot_city").html(cityHtml);
}

//渲染城市
function showCitys(){
  var i,str = "",s = '',html = '';
  for(i=0;i<Alphabet.length;i++){
    var s = Alphabet[i];
    //锚点链接
    str += '<li>'
            /*+'<a href="#city'+i+'">'+s+'</a>'*/
            +'<a href="javascript:void(0)">'+s+'</a>'
        +"</li>";
      //iscroll
      //str += '<li class="li">'+s+'</li>'
      html += '<section id="city'+i+'">'
              +'<div class="tipbg">'+s+'</div>'
              +'<ul>'
                //console.log(s);
      $.each(CITIES,function(k,arr){
        if(arr[1].charAt(0)==s){
            html+='<li>'
                  +'<a href="../index.html?city_id='+k+'&city_name='+encodeURI(arr[0])+'">'+arr[0]+'</a>'
                +'</li>'
          }
      })
      html += '</ul></section>';
      $("#city_box").html(html);
  }
  $("#more_list").html(str);
  isc.refresh();

  //点击字母
  $("ul li a").live("tap",function(){
    var txt = $(this).text();
    var li = $("#city_box").find(".tipbg");
    for(var i=0,len=li.size();i<len;i++){
      var aa=$(li[i]).text();
      if(aa == txt){
        var top=$(li[i]).offset().top-40;
        $('#container').scrollTop(top)
        //$('#container').css('margin-top',-top);
      }
    }
   
       
  })
}


init();