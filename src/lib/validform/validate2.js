$('input,textarea,select').blur(function(){
	var $this = $(this);
	return validates.checkvalidate($this);
});

$('select').change(function(){
	var $this = $(this);
	return validates.checkselect($this);
});


//提交时验证单独form表单
function checkSingleForm(id) {
	var istrue = true;
	$('#'+id+' input,#'+id+' textarea,#'+id+' select').each(function(i,val){
		var $this = $(val);
		istrue = validates.checkvalidate($this);
		if(!istrue) return false;
	});
	if(!istrue) {
		return false;
	}
	$('#'+id+' select').each(function(i,val){
		var $this = $(val);
		istrue = validates.checkselect($this);
		if(!istrue) return false;
	});

	return istrue;
}

//提交时验证所有表单
function checksub() {
	var istrue = true;
	$('input,textarea,select').each(function(i,val){ 
		var $this = $(val);
		istrue = validates.checkvalidate($this);
		if(!istrue) return false;
	});
	if(!istrue) {
		return false;
	}
	$('select').each(function(i,val){ 
		var $this = $(val);
		istrue = validates.checkselect($this);
		if(!istrue) return false;
	});
	
	return istrue;
}

var validates = {
	$this:null,
	istrue:false,
	infos:{
		required:'必填字段，请输入',
		select2:'必填字段，请选择',
		maxlength:'超过最大长度限制',
		minlength:'小于最小长度限制',
		number:'只能输入整数',
		digits:'只能输入数字,小数点后保留两位小数',
		decimal5:'只能输入数字,小数点后最多保留五位小数',
		character:'只能输入英文字符',
		charnum:'只能输入字母和数字',
		charAndnum:'只能输入不少于6位字母和数字的组合',
		phone:'手机号码格式不正确',
		email:'邮箱格式不正确',
		select:'必填字段，请选择',
		dianhua:"电话的格式不正确",
		fax:"传真的格式不正确",
		equal:"输入的密码不一致",
	},
	init: function() { //初始化
		//alert("init");
		this.value = '';
		this.validate = '';
		this.msg='';
		this.$this=null;
	},
	checkvalidate: function(obj) {
		//alert("checkvalidate");
		this.init();
		this.validate = obj.attr('validate');
		this.msg=obj.attr('msg');
		if(this.empty(this.validate)) return true;
		this.$this = obj;
		if(this.has('select2')) {
			if(obj.val()==null){
				this.value = '';
			}else{
				this.value = this.trim(obj.val()[0]);
			}

		}else{
			this.value = this.trim(obj.val());
		}
		this.clear();
		//必填
		if(this.has('required')) {
			if(!this.required()) {
				return false;
			}
		}
		//必选
		if(this.has('select2')) {
			if(!this.select2()) {
				return false;
			}
		}
		
		//判断最大长度限制
		if(this.has('maxlength')) {
			if(!this.checkmaxlenth()) {
				return false;
			}
		}
		
		//判断最小长度限制
		if(this.has('minlength')) {
			if(!this.checkminlenth()) {
				return false;
			}
		}
		
		//判断数字int
		if(this.has('number')) {
			if(!this.checknumber()) {
				return false;
			}
		}
		
		//判断小数digits
		if(this.has('digits')) {
			if(!this.checkdigits()) {
				return false;
			}
		}

		//判断小数后五位digit5
		if(this.has('decimal5')) {
			if(!this.checkdecimal5()) {
				return false;
			}
		}
		
		//判断英文字符a-z A Z
		if(this.has('character')) {
			if(!this.checkcharacter()) {
				return false;
			}
		}
		
		//判断英文字符a-z A-Z 0-9
		if(this.has('charnum')) {
			if(!this.checkcharnum()) {
				return false;
			}
		}		
		//
		if(this.has('charAndnum')) {
			if(!this.checkcharAndnum()) {
				return false;
			}
		}		
		
		//判断手机号码
		if(this.has('phone')) {
			if(!this.checkphone()) {
				return false;
			}
		}
		
		//判断邮箱
		if(this.has('email')) {
			if(!this.checkemail()) {
				return false;
			}
		}
		//判断电话
		if(this.has('dianhua')){
			if(!this.checkdianhua()) {
				return false;
			}
	    }
		//判断传真
		if(this.has('fax')){
			if(!this.checkfax()) {
				return false;
			}
	    }
		//判断密码一致
		if(this.has('equal')){
			if(!this.checkequal()) {
				return false;
			}
		}
		return true;		
	},
	checkselect: function(obj) {
		//alert("checkvalidate");
		this.init();
		this.validate = obj.attr('validate');
		if(this.empty(this.validate)) return true;
		this.$this = obj;
		this.value = obj.val();
		this.clear();	
		if(this.empty(this.value)) {
			this.error(this.infos.select);
			return false;
		}
		return true;		
	},
	required: function() {//必填
		if(this.empty(this.value)) {
			if(this.empty(this.msg)){
				this.error(this.infos.required);
			}else{
				this.error(this.msg);
			}
			return false;
		}
		return true;
	},
	select2: function() {//必选
		if(this.empty(this.value)) {
			this.error(this.infos.select2);
			return false;
		}
		return true;
	},
	checkmaxlenth: function() {//最大长度
		if(this.empty(this.value)) return true;
		if(this.lenth('maxlength')) {
			var len = this.value.length;
			if(len>this['maxlength']) {
				this.error(this.infos.maxlength+this['maxlength']);
				return false;
			}
		}
		return true;
	},
	checkminlenth: function() {//最小长度
		if(this.lenth('minlength')) {
			var len = this.value.length;
			if(len<this['minlength']) {
				this.error(this.infos.minlength+this['minlength']);
				return false;
			}
		}
		return true;
	},
	checknumber: function() {//判断数字
		if(this.empty(this.value)) return true;
		var reg = /^[1-9]+[0-9]*$/;
		if(!reg.test(this.value)) {
			this.error(this.infos.number);
			return false;
		} 
		return true;
	},
	checkdigits: function() {//判断数字
		if(this.empty(this.value)) return true;
		var reg = /^[0-9]{1,15}(\.[0-9]{1,2})?$/
		if(!reg.test(this.value)) {
			this.error(this.infos.digits);
			return false;
		}
		if(this.lenth('digits')) {
			var len =0;
			if(this.value.indexOf('\.')<0){
				len=this.value.length;
			}else{
				len=this.value.substring(0,this.value.indexOf('\.')).length;
			}

			if(len>this['digits']) {
				this.error('整数位超过最大长度限制'+this['digits']);
				return false;
			}
		}
		return true;
	},
	checkdecimal5: function() {//判断数字
		if(this.empty(this.value)) return true;
		var reg = /^[0-9]{1,15}(\.[0-9]{1,5})?$/
		if(!reg.test(this.value)) {
			this.error(this.infos.decimal5);
			return false;
		}
		if(this.lenth('decimal5')) {
			var len =0;
			if(this.value.indexOf('\.')<0){
				len=this.value.length;
			}else{
				len=this.value.substring(0,this.value.indexOf('\.')).length;
			}

			if(len>this['decimal5']) {
				this.error('整数位超过最大长度限制'+this['decimal5']);
				return false;
			}
		}
		return true;
	},
	checkcharacter: function() {//判断自还能由英文字符组成
		if(this.empty(this.value)) return true;
		var reg = /^[a-zA-Z]*$/
		if(!reg.test(this.value)) {
			this.error(this.infos.character);
			return false;
		} 
		return true;
	},
	checkcharnum: function() {//判断英文+数字
		if(this.empty(this.value)) return true;
		var reg = /^[a-zA-Z0-9]+$/
		if(!reg.test(this.value)) {
			this.error(this.infos.charnum);
			return false;
		} 
		return true;
	},
	checkcharAndnum: function() {//判断英文+数字
		if(this.empty(this.value)) return true;
		var reg = /(?=^.*?\d)(?=^.*?[a-zA-Z])^[0-9a-zA-Z]{6,}$/;
			if(!reg.test(this.value)) {
				this.error(this.infos.charAndnum);
				return false;
			} 
		return true;
	},
	checkphone: function() {//手机号码
		if(this.empty(this.value)) return true;
		var reg = /^1[34578]\d{9}$/
		if(!reg.test(this.value)) {
			this.error(this.infos.phone);
			return false;
		} 
		return true;
	},
	checkemail: function() {//邮箱
		if(this.empty(this.value)) return true;
		var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
		if(!reg.test(this.value)) {
			this.error(this.infos.email);
			return false;
		} 
		return true;
	},
	checkdianhua: function() {//电话
		if(this.empty(this.value)) return true;
		var reg=/^((0\d{2,3})-{0,1})?(\d{7,8})(-(\d{1,}))?$/;
		if(!reg.test(this.value)) {
			this.error(this.infos.dianhua);
			return false;
		} 
		return true;
	},
	checkfax: function() {//传真
		if(this.empty(this.value)) return true;
		var reg=/^((0\d{2,3})-{0,1})?(\d{7,8})(-(\d{1,}))?$/;
		if(!reg.test(this.value)) {
			this.error(this.infos.fax);
			return false;
		} 
		return true;
	},
	checkequal:function () {
		if(this.empty(this.value)) return true;
		if(this.lenth('equal')) {
			var value = this.value;
			if(value!=$(this['equal']).val()) {
				this.error(this.infos.equal);
				return false;
			}
		}
		return true;
	},
	error: function(_info) {//必填
		this.$this.addClass('red-border');
		this.$this.parent().addClass('position-re');
		this.$this.after('<div class="poptip">'+_info+'<em><s class="s1">◆</s><s class="s2">◆</s></em></div>');
        // var y1 = this.$this.prev().position().top
        var left = this.$this.position().left+ this.$this.innerWidth()-20
        $('.poptip').css('left',left)
		var x = $('.poptip').offset().top-70;
		if($(window).scrollTop()>x+70){
			$('body,html').animate({scrollTop:x},500);
		}

	},
	clear: function() {//清空
		this.$this.removeClass('red-border');
		this.$this.parent().removeClass('position-re');
		$('.poptip').remove();
	},
	empty: function(_value) {//判断是否为空
		if(_value==undefined || _value==null || _value=="") {
			return true;
		}
		return false;
	},
	has: function(_info) {//是否包含
		if(this.empty(_info)) return false;
		if(this.validate.indexOf(_info)>-1) {
			return true;
		}
		return false;
	},
	trim: function(_info) {//去除两边的空格
		if(this.empty(_info)) return '';
		return _info.replace(/(^\s*)|(\s*$)/g, "");
	},
	lenth: function(_info) {//获取maxlength 和minlength
		if(this.empty(_info)) return;
		var arr = this.validate.split(_info);
		if(arr.length<2) return; 
		var fnum = arr[1].indexOf("[");
		var fnum2 = arr[1].indexOf("]");
		if(fnum2<0 || fnum<0 || fnum>fnum2) return false;
		var maxlength = arr[1].substring(fnum+1,fnum2);
		this[_info] = maxlength;
		return true;
	}
};