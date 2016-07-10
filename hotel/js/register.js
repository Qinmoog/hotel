var testCode='';
function bindEvent(){
	$('#phone').on('input propertychange',function(){
		var txt=$(this).val()
		//输入中含有非数字，转化为空
		$(this).val(txt.replace(/\D/g,''))
		//checkInput();
	})
	/*$('#password').on('input propertychange',checkInput);*/
	//密码开关设置
	$('#pwd_on_off').on('click',changePwd)
	//获取手机验证码
	$('#get_code_btn').on('click',getTestCode)

	//给所有input文本框密码框绑定事件
	$('.forms').on('input propertychange','input[data-check=check]',checkInput)
	$('.forms input[type=checkbox]').on('change',checkInput)

	//点击'下一步'
	$('#next').on('click',register)

}

//密码开关设置
function changePwd(){
	if($('#pwd').attr('type')=='password'){
		$('.round').css({
			'-webkit-transition':'transform .3s ease-in-out',
			'-webkit-transform':'translate3d(0,0,0)'
		})
		$('#pwd').attr('type','text')
		$('#pwd_on_off').addClass('pwd-btn')
	}else{
		$('.round').css({
			'-webkit-transition':'transform .3s ease-in-out',
			'-webkit-transform':'translate3d('+50+'px,0,0)'
		})
		$('#pwd').attr('type','password')
		$('#pwd_on_off').removeClass('pwd-btn')
	}
}

//获取验证码
function getTestCode(){
	var phone=$('#phone').val(),
		times=60,
		timer=null,
		$btn=$(this);
	if($btn.data('clicked')) return;
	if(!common.checkPhone(phone)){
		common.showDialog('请输入有效的手机号码','确定');
		return;
	}

	common.access_server('../server/register.php',{phone:phone},function(data){
		data=data.result;
		var msg=data.risg;
		if(data.errcode==2){
			common.showDialog(msg,'重试')
		}else if(data.errcode==1){
			common.showDialog(msg,'登陆',function(){
				location.href='login.html'
			})
		}else{
			common.showDialog('验证码发送成功','确定',function(){
				//location.href='login.html'
				testCode=msg;
				timerFun();
			})
		}
	})
	timerFun=function(){
		timer=setInterval(function(){
			times--;
			if(times<=0){
				clearInterval(timer)
				$btn.text('获取验证码').data('clicked',false)
			}else{
				$btn.text(times+'秒后重试').data('clicked',true)
			}
		},1000)
	}
}

//检测所有input文本框密码框是否填写
function checkInput(){
	var phone=$.trim($('#phone').val()),
		pwd=$.trim($('#password').val()),
		code=$.trim($('#code').val()),
		isRead=$('#isRead').prop('checked');
	if(phone && code && isRead){
		$('#next').addClass('activ')
	}else{
		$('#next').removeClass('activ')
	}
}

//点击下一步操作
function register(){
	if(!$(this).hasClass('activ')) return;
	var phone=$.trim($('#phone').val());
	var pwd=$.trim($('#pwd').val());
	var code=$.trim($('#code').val());
	if(!common.checkPhone(phone)){
		common.showDialog('请输入有效的手机号','确定',function(){
			$('#phone').val('')
		});
		return;
	}
	if(!common.checkPwd(pwd)){
		common.showDialog('密码格式输入错误','确定',function(){
			$('#pwd').val('')
		});
		return;
	}
	if(code!=testCode){
		common.showDialog('验证码错误','确定',function(){
			$('#code').val('')
		});
		return;
	}
	common.access_server('../server/registersubmit.php',{phone:phone,pwd:pwd},function(data){
		var msg=data.result.errcode;
		if(msg==1){
			common.showDialog('该手机号码被注册过了！','关闭',function(){
				location.href='login.html'
			})
		}else if(msg==2){
			common.showDialog('注册失败，请重试！','关闭',function(){
				return;
			})
		}else{
			common.showDialog('恭喜您注册成功！','登陆',function(){
				location.href='login.html'
			})
		}
	})
}

bindEvent()