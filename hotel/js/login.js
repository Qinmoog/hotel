function init(){
	bindEvent();

}

function bindEvent(){
	$('#phone').on('input propertychange',function(){
		var txt=$(this).val()
		$(this).val(txt.replace(/\D/g,''))
		checkInput();
	})
	$('#password').on('input propertychange',checkInput);
	//点击登陆
	$('#login').on('click',checkLogin);
}

function checkInput(){
	var phone=$.trim($('#phone').val());
	var pwd=$.trim($('#password').val());
	if(phone && pwd){
		$('#login').addClass('activ')
	}else{
		$('#login').removeClass('activ')
	}
}

function checkLogin(){
	if(!$(this).hasClass('activ')) return;
	var phone=$.trim($('#phone').val());
	var pwd=$.trim($('#password').val());
	if(!common.checkPhone(phone)){
		common.showDialog('请输入有效的手机号','确定',function(){
			$('#phone').val('')
		});
		return;
	}
	if(!common.checkPwd(pwd)){
		common.showDialog('密码格式输入错误','确定',function(){
			$('#password').val('')
		});
		return;
	}
	//ajax渲染
	common.access_server('../server/checkuser.php',{phone:phone,pwd:pwd},function(data){
		console.log(data)
		var msg=data.msg;
		if(data.code==1){
			common.showDialog(msg,'确定',function(){
				location.href='register.html'
			})
		}else if(data.code==2){
			common.showDialog(msg,'确定',function(){
				$('#password').val("");
			})
		}else{
			location.href=ls.getItem('orderUrl');
		}
	})
}

init();