//解析地址栏中的参数
var isc=new iScroll("hotel_scroll");
var params = getParams(),
	cityId = params.city_id,
	dateIn = params.date_in,
	dateOut = params.date_out,
	name = params.name,
	pageNo=1,
	pageSize=3,
	//传给服务器端的参数列表
	POST = {
		cityId:cityId,
		dateIn:dateIn,
		dateOut:dateOut,
		pageNo:pageNo,
		pageSize:pageSize
	};
	if(name){
		POST.name = name;
	}
	console.log(params)
//显示入住日期的离店日期
$("#inText").text(showMonDay(dateIn));
$("#outText").text(showMonDay(dateOut));
$("#date_in").val(dateIn);
$("#date_out").val(dateOut);

function init(){
	bindEvent();
	getDataFromList();
	showHideNav();
	renderSort();
	renderPrice();
	renderBrand();
	renderStar();

}

//ajax请求列表页
function getDataFromList(action){
	common.access_server("../server/hotel2.php",POST,function(data){
		//console.log(POST);
		renderHotelList(data,action);
		
	});
}
//渲染数据酒店信息
function renderHotelList(data,action){
	if(data.errcode!=0){
		$("#tipbox").css("display","block");
		$(".load_more").css("display","none");
		$("#hotel_list").html('');
	}else{
		//总的数据
		var count = data.count;
		var list = data.result.hotel_list;
		var $list = $("#hotel_list");
		var html = '';
		var $load = $(".load_more");
		var pageCount = Math.ceil(count/pageSize);  // 分页的总页数
		$("#tipbox").css("display","none");
		$.each(list,function(i,obj){
			//console.log(obj);
			html += '<div class="rows">'
					+'<a href="detail.html?city_id='+cityId+'&date_in='+$("#date_in").val()+'&date_out='+$("#date_out").val()+'&hotel_id='+obj.hotel_id+'">'
						+'<dl>'
							+'<dt>'
								+'<img src="'+obj.image+'"/>'
							+'</dt>'
							+'<dd>'
								+'<h2>'+obj.name+'</h2>'
								+'<p class="tip">'
									+'<span>4.5分</span>'
									+'<em>礼</em>'
									+'<em>促</em>'
									+'<em>返</em>'
								+'</p>'
								+'<p class="stars">'+obj.stars+'</p>'
								+'<p class="address">'+obj.addr+'</p>'
							+'</dd>'
							+'<dd>'
							+'<p>'+obj.low_price/100+'</p>'
							+'</dd>'
						+'</dl>'
					+'</a>'
				+'</div>';
		})
	}
	if(action) $("#hotel_list").empty();
	$(html).appendTo($("#hotel_list"));
	//判断当前页小于总页数
	if(POST.pageNo<pageCount){
		$(".load_more").css("display","block");
	}else{
		$(".load_more").css("display","none");
	}
	isc.refresh();
}


function bindEvent(){
	//修改日期
	$("#modify").on("click",function(){
	    var today = new Date();
	    //激活入住
	    var minDate = new Date(today.getFullYear(),today.getMonth(),today.getDate());
	    var maxDate = new Date(today.getFullYear(),today.getMonth(),today.getDate()+90);
	    showCalendar($("#date_in"),minDate,maxDate,$(this).data("type"));
	})

	//点击加载更多
	$(".load_more").on("click",function(){
		POST.pageNo += 1;
		getDataFromList();
	})

	//点击导航切换选项
	$("#ftnav").on("click",'a',function(){
		var index = $(this).index();
		common.showMask();
		var $layer = $("#item_layer");
		$layer.css({
			"transition":"height 0.3s ease-in-out",
			"height" : "17rem"
		})
		$(this).addClass("cur_item").siblings().removeClass();
		//显示对应的弹出层
		$layer.children("div").eq(index).addClass("cur_layer").siblings().removeClass();
	})
}
//排序
var sort = {
	"all":"不限",
	"hot" : '人气最高',
	"priceMax" : '价格从高到低',
	"priceMin" : '价格从低到高'
}
//价格
var price = {
	//"all" : "不限",
	"0":["不限",-1,-1],
	"1":["0-100",0,100],
	"2":["101-200",101,200],
	"3":["201-300",201,300],
	"4":["301-400",301,400],
	"5":["401-500",401,500],
	"6":["500以上",501,-1]
}

//品牌
/*var brand= {
	"all" : "不限",
	"0" : "旺客隆",
	"1" : "迪拜",
	"2" : "香格里拉",
	"3" : "喜来登"
}*/
var brand= {
	"0" : "不限",
	"1" : "7天",
	"2" : "万豪",
	"3" : "汉庭",
	"4" : "如家",
	"5" : "布丁"
}
//星级
var star= {
	"1" : "不限",
	"2" : "二星以下（经济型）",
	"3" : "三星",
	"4" : "四星",
	"5" : "五星"
}

//---------------渲染排序
function renderSort(){
	var htmlArr = ["<ul>"],html = "<ul>";
	/*$.each(sort,function(k,val){   //拼接字符串渲染数据
		html += '<li id="'+k+'">'
				+'<a href="javascript:void(0)">'
					+'<span onclick="checkSort(\''+k+'\')"></span>'
					+'<b>'+val+'</b>'
				+'</a>'
			+'</li>';
	})
	html += '</ul>';
	$("#sort").html(html).find("li").eq(0).addClass("on");*/
	//通过遍历数组的方式渲染数据
	$.each(sort,function(k,v){
		htmlArr.push('<li id="'+k+'">',
						'<a href="javascript:void(0)">',
							'<span onclick="checkSort(\''+k+'\')"></span>',
							'<b>'+v+'</b>',
						'</a>',
					'</li>');
	})
	htmlArr.push('</ul>')
	$('#sort').html(htmlArr.join('')).find('li').eq(0).addClass('on')
}
//选择排序
function checkSort(k){
	$("#"+k).addClass('on').siblings().removeClass();
	//隐藏弹层
	hideLayer();
	k=k === 'all' ? -1 : k ;
	$('#order').val(k);
	POST.sortType = $('#order').val();
	POST.pageNo=1;
	//再次调用ajax
	getDataFromList('order')
}

//---------------渲染价格
function renderPrice(){
	var htmlArr = ["<ul>"],html = "<ul>";
	$.each(price,function(k,v){
		html += '<li id="'+k+'">'
				+'<a href="javascript:void(0)">'
					+'<span onclick="checkPrice(\''+k+'\',\''+v[1]+'\',\''+v[2]+'\')"></span>'
					+'<b>'+v[0]+'</b>'
				+'</a>'
			+'</li>';
	})
	html += '</ul>';
	$("#price").html(html).find("li").eq(0).addClass("on");
}
//选择价格
function checkPrice(k,min,max){
	$("#"+k).addClass('on').siblings().removeClass();
	//隐藏弹层
	hideLayer();
	min=min === -1 ? -100 : min*100 ;
	max=max === -1 ? -100 : max*100 ;
	console.log(min)
	$('#min').val(min);
	$('#max').val(max);
	POST.minPrice = $('#min').val();
	POST.maxPrice = $('#max').val();
	POST.pageNo=1;
	//再次调用ajax
	getDataFromList('price')
}

//----------------渲染品牌
function renderBrand(){
	var htmlArr = ["<ul>"],html = "<ul>";
	$.each(brand,function(k,v){
		html += '<li id="b'+k+'">'
				+'<a href="javascript:void(0)">'
					+'<span onclick="checkBrand(\''+k+'\',\''+v+'\')"></span>'
					+'<b>'+v+'</b>'
				+'</a>'
			+'</li>';
	})
	html += '</ul>';
	$("#brand").html(html).find("li").eq(0).addClass("on");
}
//选择品牌
function checkBrand(k,v){
	$("#b"+k).addClass('on').siblings().removeClass();
	//隐藏弹层
	hideLayer();
	k=k === 0 ? -1 : v ;
	$('#brand').val(v);
	POST.brand = $('#brand').val();
	POST.pageNo=1;
	//再次调用ajax
	getDataFromList('brand')
}

//-----------------渲染星级
function renderStar(){
	var htmlArr = ["<ul>"],html = "<ul>";
	$.each(star,function(k,v){
		html += '<li id="s'+k+'">'
				+'<a href="javascript:void(0)">'
					+'<span onclick="checkStars('+k+')"></span>'
					+'<b>'+v+'</b>'
				+'</a>'
			+'</li>';
	})
	html += '</ul>';
	$("#star").html(html).find("li").eq(0).addClass("on");
}
//选择星级
function checkStars(k){
	$("#s"+k).addClass('on').siblings().removeClass();
	//隐藏弹层
	hideLayer();
	k=k === 1 ? -1 : k ;
	$('#star').val(k);
	POST.stars = $('#star').val();
	POST.pageNo=1;
	//再次调用ajax
	getDataFromList('star')
}
//隐藏弹层
function hideLayer(){
	setTimeout(function(){
		common.hideMask();
		$("#item_layer").css({
			"transition" : "height 0.3s ease-in-out",
			"height" : '0'
		})
	},500)
}

//触摸滑动显示和隐藏底部导航
function showHideNav(){
	var startY, offsetY,$ftnav=$("#ftnav");
	$("#hotel_scroll").on("touchstart",function(e){
		startY = e.touches[0].clientY;
	})
	$("#hotel_scroll").on("touchmove",function(e){
		offsetY = e.touches[0].clientY-startY;
	})
	$("#hotel_scroll").on("touchend",function(e){
		var abs_offsetY=Math.abs(offsetY);
		//console.log(abs_offsetY);
		if(abs_offsetY>20){
			if(offsetY<0){
				$ftnav.css({
					"transition":"height 0.3s linear",
					"height" : '3rem'
				})
			}else{
				$ftnav.css({
					"transition":"height 0.3s linear",
					"height" : '0rem'
				})
			}
		}
		
	})
}

init();