//解析地址栏中的参数
var isc = new iScroll("section");
var	params=getParams(),
    dateIn=params.date_in,
    dateOut=params.date_out,
    cityId=params.city_id,
    name=params.name?params.name:"",
    pageSize=4,  // 每页显示的记录数
    pageNo=1,    // 页数
    hotelId=params.hotel_id,
    POST = {
		cityId:cityId,
		dateIn:dateIn,
		dateOut:dateOut,
		pageNo:pageNo,
		pageSize:pageSize
	};
console.log(params)
//渲染房间数据
function getRoomFormList(){
	common.access_server("../data/hotelDetail.json",POST,function(data){
		console.log(data)
		renderRoomList(data);
		
	});
}

function renderRoomList(hotelData){
	var data=hotelData.result,
		$list=$('#hotel_info_list').children(),
		star=['','','二星以下(经济型)','三','四','五'],
		img=data.images.split(';')[0];
	//console.log(data)
	$('#hotel_img img').attr('src','../'+img+'')
	$('#hotel_name').text(data.name)
	$list.eq(0).text(star[data.star]+'星级酒店')
	$list.eq(1).text(data.tel.replace(/,/g," "))
	$list.eq(2).text(data.addr)
	$('#description').html(data.desc)
	$('#sheshi').html(data.facilities)
	console.log(data.room_types)

	//渲染房间床类型的信息
	randerRoomData(data)
}

function randerRoomData(data){
	var list=data.room_types,
		img=data.images.split(';')[0],
		html='',
		obj={};
	for(var i=0,len=list.length;i<len;i++){
		obj=list[i];
		var name=obj.name;
		$.each(obj.goods,function(k,room){
			var price=(Math.min.apply(null,room.price))/100,
			//var str=room.room_state==0?'<span class="full">满客</span>':'<span>预定</span>';
				str='';
			if(room.room_state==0){
				str='<span class="full">满客</span>'
			}else{
				str='<span data-img="../'+img+'" data-type="'+name+'" data-price="'+price+'" data-bed="'+obj.bed_type+'" data-facilities="'+data.facilities+'" data-id="'+room.room_id+'">预定</span>'
			}
			html += '<div class="room-box">'+
						'<dl>'+
							'<dt>'+obj.name+'</dt>'+
							'<dd>'+
								'<span>'+obj.bed_type+'</span>'+
								'<span>早餐</span>'+
							'</dd>'+
						'</dl>'+
						'<p>￥'+
							'<em>'+price+'起</em>'+
						'</p>'+
						'<div>'+str+'</div>'+
					'</div>';
		})
	}
	if(typeof(action)==='undefined')  $('#detail_list').html("");
	$('#detail_list').append(html)
	isc.refresh();
}
getRoomFormList();

function bindEvent(){
	$('.base_info').on('click','li',function(){
		$(this).addClass('on').siblings().removeClass('on')
		var index=$(this).index();
		$('.content_wrap>div').eq(index).addClass('cur_info').siblings().removeClass('cur_info')
	})
	//介绍信息收起展开
	$('.hotel_btn').on('click',function(){
		if($(this).text()=='展开详情'){
			$(this).text('收起')
			$(this).prev().css({
				'height':'auto',
				'-webkit-transition':'height .3s ease-out'
			})
		}else{
			$(this).text('展开详情')
			$(this).prev().css({
				'height':'3.2rem',
				'-webkit-transition':'height .3s ease-out'
			})
		}
	})

	$('#detail_list').on('click','span',function(){
		if($(this).hasClass('full')) return;
		common.showMask();
		$('#layer').css({
			'height':'28rem',
			'-webkit-transition':'height .3s ease-out'
		})
		$('#pics').attr('src',$(this).data("img"))
		$('#bed_name').text($(this).data("type"))
		$('#book_price').text($(this).data("price"))
		$('#bed_type').text($(this).data("bed"))
		$('#provide').text($(this).data("facilities"))
		$('#room_name').val($(this).data("type"))
		$('#room_id').val($(this).data("id"))
	})

	//关闭
	$('.close').on('click',function(){
		common.hideMask();
		$('#layer').css({
			'height':'0rem',
			'-webkit-transition':'height .3s ease-out'
		})
	})

	//点击立即绑定
	$('#gotoOrder').on('click',function(){
		//获取订单页url地址
		var url = 'order.html?city_id='+cityId+'&date_in='+$('#date_in').val()+
					'&date_out='+$('#date_out').val()+'&hotel_id='+hotelId+
					'&hotel_name='+encodeURI($('#room_name').val())+'&room_type='+
					encodeURI($('#bed_type').text())+'&room_id='+$('#room_id').val()+
					'&price='+$('#book_price').text()+'&img='+$('#pics').attr('src');
		//判断用户是否登录
		console.log(url)
		ifLogined(url);
	})

}

bindEvent()

//显示入住日期的离店日期
$("#inText").text(showMonDay(dateIn));
$("#outText").text(showMonDay(dateOut));
$("#date_in").val(dateIn);
$("#date_out").val(dateOut);

function editTime(){
	//修改日期
	$("#modify").on("click",function(){
	    var today = new Date();
	    //激活入住
	    var minDate = new Date(today.getFullYear(),today.getMonth(),today.getDate());
	    var maxDate = new Date(today.getFullYear(),today.getMonth(),today.getDate()+90);
	    showCalendar($("#date_in"),minDate,maxDate,$(this).data("type"));
	})
}

editTime()