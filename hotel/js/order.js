//解析地址栏中的参数
var isc=new iScroll('orderbox',{
	onBeforeScrollStart:function(e){
		var element=e.target.tagName.toLowerCase();
		if(element!='input' && element!='select' && element!='textarea'){
			e.preventDefault();
		}
	}
});

var params = getParams(),
	cityId = params.city_id,
	dateIn = params.date_in,
	dateOut = params.date_out,
	hotelName = params.hotel_name,
	roomType = params.room_type,
	roomId = params.room_id,
	price = params.price,
	img = params.img;
	console.log(params)

//显示入住日期的离店日期
$("#inText").text(showMonDay(dateIn));
$("#outText").text(showMonDay(dateOut));
$("#date_in").val(dateIn);
$("#date_out").val(dateOut);


function render(){
	$('#pics').attr('src','')
	$('#hotel_name').text(hotelName)
	$('#type_name').text(roomType)
	$('#book_price').text(price)
	$('#tprice').text(price)
	$('#rprice').val(price)
	$('#pics').attr('src',img)
	bindEvent();
}

function bindEvent(){
	//点击数量增加
	$('#add').on('click',function(){
		if($(this).hasClass('no')){
			common.showDialog('您最多只能定5间房！','关闭')
			return;
		}
		var count = parseInt($('#roomcount').val());
		count=count>=5?5:(count+1);
		if(count>=5) $(this).addClass('no')
		$('#sub').removeClass('no')
		$('#roomcount').val(count)
		changeTotal(count)
		appendNode(count)
	})
	//点击数量减少
	$('#sub').on('click',function(){
		if($(this).hasClass('no')){
			common.showDialog('您不能取消订单！','关闭')
			return;
		}
		var count = parseInt($('#roomcount').val());
		count=count<=1?1:(count-1);
		if(count<=1) $(this).addClass('no')
		$('#add').removeClass('no')
		$('#roomcount').val(count)
		changeTotal(count)
		removeNode(count+1)
	})
	//点击预订，检测文本框内容
	$('#booknow').on('click',function(){
		if(!bookOrder()){
			console.log(bookOrder())
			return;
		} 
		var url='orderSubmit.html'
		//location.href=url;
	})
}

function changeTotal(num){
	var totalPrice=num*price;
	$('#tprice').text(totalPrice)
	$('#rprice').val(totalPrice)
}

//添加入住人信息
function appendNode(i){
	var html = '<div class="userInfo" id="info'+i+'">'+
		     		'<ul class="infos">'+
		     			'<li><i>姓名'+i+'</i><input type="text" placeholder="没间只需填写一个姓名" id="userName'+i+'" name="userName'+i+'"><span class="clear_input">x</span></li>'+
		     		'</ul>'+
		     		'<ul class="infos">'+
		     			'<li><i>证件'+i+'</i><input type="text" placeholder="入住人身份证好/证件号" id="idcard'+i+'" name="idcard'+i+'"><span class="clear_input">x</span></li>'+
		     		'</ul>'+
		     	'</div>';
	$('#info').append(html)
	isc.refresh();
	$('#userName'+i).showClear();
	$('#idcard'+i).showClear();
	$('.clear_input').clearInput();
}
//删除入住人信息
function removeNode(i){
	$('#info'+i).remove();
	isc.refresh();
}
//检测入住人信息
function bookOrder(){
	var $inputs=$('#info-boxs').find('input[type=text]');
	var i,size=$inputs.size();
	for(i=0;i<size;i++){
		//console.log(i)
		var $input=$inputs.eq(i)
		var v=$.trim($input.val());
		if(!v){
			common.showDialog('入住人信息填写不完整！','确定',function(){
				$input.focus();
			});
			return false;
		}else{
			if(i%2!=0 && $input.attr('id')!='phone'){
				if(!common.checkCard(v)){
					common.showDialog('请输入有效的证件号','确定',function(){
						$input.focus();
					})
				}
			}
			if($input.attr('id')=='phone'){
				if(!common.checkPhone(v)){
					common.showDialog('请输入有效的手机号','确定',function(){
						$input.focus();
					})
				}
			}
		}
	}
	return true;

}

render();

//封装一个插件

(function($){

	/*$.fn.extend({
		showClear:function(){
			console.log('showClear')
		}
	})*/

	$.fn.showClear=function(){
		$(this).on('input propertychange',function(){
			var $span=$(this).next();
			if($(this).val()!=''){
				$span.css('display','block')
			}else{
				$span.css('display','none')
			}
		})
	}
	$.fn.clearInput=function(){
		$(this).on('click',function(){
			$input=$(this).prev();
			$input.val('');
			$(this).css('display','none');
		})
	}
})(Zepto)

$('#info-boxs').find('input[type=text]').each(function(){
	$(this).showClear();
})

//点击X文本框清空，X图标隐藏
$('#info-boxs').find('.clear_input').each(function(){
	$(this).clearInput();
})

