/**
 * added by francklin
 * @created: 2016.10.28
 */
(function(window){
    var jk=window.jk={
        //by francklin 20160826
        maxDate: function(){
            var arr=Array.prototype.slice.call(arguments,0);
            var arr1=[],arr2=[],date,value,index=-1;
            for(var i=0,j=0;i<arr.length;i++){
                date=null;value="";
                if(arr[i] instanceof Date){
                    date=arr1[j]=arr2[j]=arr[i];
                } else if(typeof(arr[i])!="string"){
                    continue;
                } else if($.trim(arr[i])==""){
                    continue;
                } else if(arr[i].slice(0,1)!="#"){
                    value=arr[i];
                } else if(arr[i].slice(-1)=="#"){
                    var id=arr[i].slice(1,-1);
                    if(!id) continue;
                    value=$.trim($('input[name="'+id+'"]').val());
                } else {
                    var id=arr[i].slice(1);
                    if(!id) continue;
                    value=$.trim($(arr[i]).val());
                }
                if(!date){
                    if(isNaN(date=new Date(value.replace(/[.-]/g,"/")))) continue;
                    arr1[j]=value;arr2[j]=date;
                }
                if(index<0) index=j;
                else if(date>arr2[index]) index=j;
                j++;
            }
            return index>=0&&arr1[index]||'';
        },
        //by francklin 20160826
        minDate: function(){
            var arr=Array.prototype.slice.call(arguments,0);
            var arr1=[],arr2=[],date,value,index=-1;
            for(var i=0,j=0;i<arr.length;i++){
                date=null;value="";
                if(arr[i] instanceof Date){
                    date=arr1[j]=arr2[j]=arr[i];
                } else if(typeof(arr[i])!="string"){
                    continue;
                } else if($.trim(arr[i])==""){
                    continue;
                } else if(arr[i].slice(0,1)!="#"){
                    value=arr[i];
                } else if(arr[i].slice(-1)=="#"){
                    var id=arr[i].slice(1,-1);
                    if(!id) continue;
                    value=$.trim($('input[name="'+id+'"]').val());
                } else {
                    var id=arr[i].slice(1);
                    if(!id) continue;
                    value=$.trim($(arr[i]).val());
                }
                if(!date){
                    if(isNaN(date=new Date(value.replace(/[.-]/g,"/")))) continue;
                    arr1[j]=value;arr2[j]=date;
                }
                if(index<0) index=j;
                else if(date<arr2[index]) index=j;
                j++;
            }
            return index>=0&&arr1[index]||'';
        },
        /**
         * get image size
         * @source:
             * -------------
             * 图片头数据加载就绪事件 - 更快获取图片尺寸
             * @version 2011.05.27
             * @author  TangBin
             * @see     http://www.planeart.cn/?p=1121
             * @param   {String}    图片路径
             * @param   {Function}  尺寸就绪
             * @param   {Function}  加载完毕 (可选)
             * @param   {Function}  加载错误 (可选)
             * @example imgReady('http://www.google.com.hk/intl/zh-CN/images/logo_cn.png', function () {
                    alert('size ready: width=' + this.width + '; height=' + this.height);
                });
             * -------------
         * @modifier: francklin
         * @created: 2016.10.28
         */
        "getImage": (function () {
            var list = [], intervalId = null,

            // 用来执行队列
            tick = function () {
                var i = 0;
                for (; i < list.length; i++) {
                    list[i].end ? list.splice(i--, 1) : list[i]();
                };
                !list.length && stop();
            },

            // 停止所有定时器队列
            stop = function () {
                clearInterval(intervalId);
                intervalId = null;
            };

            return function (url, ready, load, error) {
                var onready, width, height, newWidth, newHeight,
                    img = new Image();
                
                img.src = url;

                // 如果图片被缓存，则直接返回缓存数据
                if (img.complete) {
                    ready.call(img);
                    load && load.call(img);
                    return;
                };
                
                width = img.width;
                height = img.height;
                
                // 加载错误后的事件
                img.onerror = function () {
                    error && error.call(img);
                    onready.end = true;
                    img = img.onload = img.onerror = null;
                };
                
                // 图片尺寸就绪
                onready = function () {
                    newWidth = img.width;
                    newHeight = img.height;
                    if (newWidth !== width || newHeight !== height ||
                        // 如果图片已经在其他地方加载可使用面积检测
                        newWidth * newHeight > 1024
                    ) {
                        ready.call(img);
                        onready.end = true;
                    };
                };
                onready();
                
                // 完全加载完毕的事件
                img.onload = function () {
                    // onload在定时器时间差范围内可能比onready快
                    // 这里进行检查并保证onready优先执行
                    !onready.end && onready();
                
                    load && load.call(img);
                    
                    // IE gif动画会循环执行onload，置空onload即可
                    img = img.onload = img.onerror = null;
                };

                // 加入队列中定期执行
                if (!onready.end) {
                    list.push(onready);
                    // 无论何时只允许出现一个定时器，减少浏览器性能损耗
                    if (intervalId === null) intervalId = setInterval(tick, 40);
                };
            };
        })(),
        /**
         * for layer 2.4
         * @created: 2016.10.28
         */
        layer: {
            image: function(src){
                jk.getImage(src,function(){
                    layer.open({
                        type: 1,
                        title: false,
                        closeBtn: 1,
                        area: ['auto', 'auto'],
                        skin: 'layer-ext-image',
                        shadeClose: true,
                        content: '<img src="' + this.src+ '">'
                    });
                });
            }
        }
    }
})(window);


$(function () {
    $(".phone-re").hover(function () {
        $(".phone-2").show();
    },function () {
        $(".phone-2").hide();
    });

    //多张图片显示
    // layer.config({
    //     extend: 'extend/layer.ext.js'
    // });
});


/**
 * 获取所有父类的名称
 * @param code
 * @param dataUrl  默认值getAreaAll,(getAreaAll：获取所有父类区域名称，getInnerPortAll:获取所有父类内部港口名称，getPortAll：获取所有父类港口名称)
 * @param inputId
 */
function getParentAll(code,dataUrl,inputId) {
    if(dataUrl==null||dataUrl==''){
        dataUrl='getAreaAll';
    }
    if(isNotNull(code)){
        $.ajax({
            type:"post",
            url:"/common/"+dataUrl+"?code="+code,
            success:function (data) {
                $('#'+inputId).val(data);
            }
        });
    }
}

/**
 * 数据字典表中状态字段的code和name的转换（根据code获取name）
 * @param code 比如5,7
 * @param domId 标签元素的ID
 */
function convertCodeToName(code, domId) {
    var $domId = $("#" + domId);
    $.post("/common/base_datas.json", null, function (data) {
        var jsonArray = data.rows;
        if ($.isArray(jsonArray)) {
            for (var i = 0; i < jsonArray.length; i++) {
                if (code == jsonArray[i].optionCode) {
                    $domId.text(jsonArray[i].optionName);
                    return;
                }
            }
        }
        $domId.text("");
    }, "json");
}

// /**
//  * 数据字典表中状态字段的code和name的转换（根据code获取name）
//  * @param code 比如5,7
//  */
// function getAreaName(code) {
//     var optionName="";
//     $.ajax({
//         type:"post",
//         url:"/common/base_area.json?code="+code,
//         async:false,
//         success:function (data) {
//             optionName= data.rows;
//             return;
//         }
//     });
//     return optionName;
// }

// /**
//  * port相关表中状态字段的areaId和chineseName的转换
//  * @param code 比如5,7
//  */
// function getPortName(code,classify) {
//     var optionName="";
//     $.ajax({
//         type:"post",
//         url:"/common/queryPorts.json?code="+code+"&classify="+classify,
//         async:false,
//         success:function (data) {
//             optionName= data.rows;
//             return;
//         }
//     });
//     return optionName;
// }

/**
 * 数据字典表中状态字段的code和name的转换（根据code获取name）
 * 后台根据classify过滤返回
 * @param code 比如5,7
 */
function convertCodeClassifyToName(code,classify) {
    var optionName="";
    $.ajax({
        type:"post",
        url:"/common/queryDataOptionByClassify.json",
        async:false,
        data:{"classify": classify},
        success:function (data) {
            var jsonArray = data.rows;
            if ($.isArray(jsonArray)) {
                for (var i = 0; i < jsonArray.length; i++) {
                    if (code == jsonArray[i].optionCode) {
                        optionName= jsonArray[i].optionName;
                        return;
                    }
                }
            }
        }
    });
    return optionName;
}


/**
 * 根据code查询公司等级
 */
function convertCompanyToName(gradeCode) {
    var gradeName="";
    $.ajax({
        type:"post",
        url:"/common/queryCompanyGrade.json",
        async:false,
        data:{"gradeCode": gradeCode},
        success:function (data) {
            var jsonArray = data.rows;
            if ($.isArray(jsonArray)) {
                for (var i = 0; i < jsonArray.length; i++) {
                    if (gradeCode == jsonArray[i].gradeCode) {
                        gradeName= jsonArray[i].gradeName;
                        return;
                    }
                }
            }
        }
    });
    return gradeName;
}


/**
 * 根据商品分类id查询商品类型
 */
function convertCateIdToName(cateId) {
    var cateName="";
    $.ajax({
        type:"post",
        url:"/common/queryCateName.json",
        async:false,
        data:{"cateId": cateId},
        success:function (data) {
            cateName= data;
            return;
        }
    });
    return cateName;
}

/**
 * 根据商品分类id查询商品类型
 */
function convertCodeToNameInEnum(code, enumType) {
    var name = "";
    $.ajax({
        type:"post",
        url:"/common/getCodeName.json",
        async:false,
        data:{"code": code, "enumType": enumType},
        success:function (data) {
            name= data;
            return;
        }
    });
    return name;
}


/**
 * 根据classify获取对应数据字典生成下拉选项
 * @param code 比如5,7
 */
function initSelectByclassify(classify, domName, defaultOptionName, defaultOptionValue) {
    $.ajax({
        type:"post",
        url:"/common/queryDictByClassify.json",
        async:false,
        data:{"classify": classify},
        success:function (data) {
            var jsonArray = data.rows;
            if ($.isArray(jsonArray)) {
                var selectList = "";
                if (defaultOptionName != undefined && defaultOptionName != null) {
                    if (defaultOptionValue == undefined) {
                        defaultOptionValue = "";
                    }
                    selectList += "<option value='" + defaultOptionValue + "'>" + defaultOptionName + "</option>";
                }
                for (var i = 0; i < jsonArray.length; i++) {
                    var code = jsonArray[i].code;
                    var name = jsonArray[i].name;
                    selectList += "<option value='" + code + "'>" + name + "</option>";
                }
                selectList += "</select>";

                var $dom = $("select[name='" + domName + "']");
                $dom.append(selectList);
            }
        }
    });
}

/**
 * 格式化日期
 * @param date
 * @param format
 * @returns {XML|void|string}
 */
function formatDate(date, format) {
    if (!date) return;
    if (!format) format = "yyyy-MM-dd";
    switch(typeof date) {
        case "string":
            date = new Date(date.replace(/-/g, "/"));
            break;
        case "number":
            date = new Date(date);
            break;
    }
    if (!date instanceof Date) return;
    var dict = {
        "yyyy": date.getFullYear(),
        "M": date.getMonth() + 1,
        "d": date.getDate(),
        "H": date.getHours(),
        "m": date.getMinutes(),
        "s": date.getSeconds(),
        "MM": ("" + (date.getMonth() + 101)).substr(1),
        "dd": ("" + (date.getDate() + 100)).substr(1),
        "HH": ("" + (date.getHours() + 100)).substr(1),
        "mm": ("" + (date.getMinutes() + 100)).substr(1),
        "ss": ("" + (date.getSeconds() + 100)).substr(1)
    };
    return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function() {
        return dict[arguments[0]];
    });
}

/**
 * 根据不同行业转意不同特殊字段
 * @param industryId
 * @param tranCateId 转意过的分类ID
 */
function getSpecName1(industryId, cateParentId) {
    var specName = "";
    if (industryId >= 200 && industryId < 300) {
        //有色
        specName = "牌号";
    } else if (industryId == 400) {
        //矿产、能源、农产品
        specName = "品味";
    } else if (industryId == 500) {
        //钢材
        specName = "材质";
    } else if (industryId == 300) {
        //化工细分
        if (cateParentId == 301) {
            specName = "规格";
        } else if (cateParentId == 302) {
            specName = "牌号";
        } else if (cateParentId == 303) {
            specName = "型号";
        }
    } else if (industryId == 600) {
        //能源细分
        if (cateParentId == 601) {
            specName = "低热位值";
        } else if (cateParentId == 602) {
            specName = "牌号";
        }
        //603暂时空
    } else if (industryId == 700) {
        //农产品
        specName = "规格";
    }

    if(specName === ""){
        specName = "牌号";
    }

    return specName;
}

/**
 * 根据不同行业转意不同特殊字段
 * @param industryId
 * @param tranCateId 转意过的分类ID
 */
function getSpecName2(industryId, cateParentId) {
    var specName = "";
    if (industryId == 200) {
        //有色
        specName = "厂家/产地";
    } else if (industryId == 400 || industryId == 600 || industryId == 700) {
        //矿产、能源、农产品
        specName = "产地";
    } else if (industryId == 500) {
        //钢材
        specName = "规格";
    } else if (industryId == 300) {
        //化工细分
        if (cateParentId == 301) {
            specName = "产地";
        } else if (cateParentId == 302) {
            specName = "厂家/产地";
        } else if (cateParentId == 303) {
            specName = "产地/工厂代码";
        }
    }

    if(specName === ""){
        specName = "厂家/产地";
    }

    return specName;
}

/**
 * 根据不同行业转意不同特殊字段
 * @param industryId
 */
function getSpecName3(industryId, cateParentId) {
    var specName = "";
    if (industryId == 200 || industryId == 300 || industryId == 600 || industryId == 700) {
        if (cateParentId == 603) {
            return specName;//冶金焦暂时空
        }
        specName = "仓库";
    } else if (industryId == 400) {
        specName = "港口";
    } else if (industryId == 500) {
        specName = "存放地";
    }

    if(specName === ""){
        specName = "仓库";
    }
    return specName;
}

/**
 * 将数值四舍五入(保留2位小数)后格式化成金额形式
 *
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567.45'
 * @type String
 */
function formatCurrencyTwo(num) {
    if(num == null)
        num = "0";
    num = num.toString().replace(/\$|\,/g,'');
    if(isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num*100+0.50000000001);
    cents = num%100;
    num = Math.floor(num/100).toString();
    if(cents<10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
        num = num.substring(0,num.length-(4*i+3))+','+
            num.substring(num.length-(4*i+3));
    return (((sign)?'':'-') + num + '.' + cents);
}

/**
 * 将数值四舍五入(保留1位小数)后格式化成金额形式
 *
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567.4'
 * @type String
 */
function formatCurrencyOne(num) {
    if(num == null)
        num = "0";
    num = num.toString().replace(/\$|\,/g,'');
    if(isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num*10+0.50000000001);
    cents = num%10;
    num = Math.floor(num/10).toString();
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
        num = num.substring(0,num.length-(4*i+3))+','+
            num.substring(num.length-(4*i+3));
    return (((sign)?'':'-') + num + '.' + cents);
}

/**
 * 获取支付名称 0.网银转账,1.东方付通，2浦发
 * @param payChannel
 */
function showPayChannelName(payChannel) {
    if(payChannel == 0) {
        return "网银转账";
    } else if (payChannel == 1) {
        return "东方付通";
    } else if (payChannel == 2) {
        return "浦发银行";
    }
}

/**
 * 获取支付名称 0.网银转账,1.东方付通，2浦发
 * @param payChannel
 */
function showPayChannelName(payChannel) {
    if(payChannel == 0) {
        return "网银转账";
    } else if (payChannel == 1) {
        return "东方付通";
    } else if (payChannel == 2) {
        return "浦发银行";
    }
}

/**
 * 显示订单类型 0买家自提，1卖家送货
 * @param deliveryBuy
 */
function showDeliveryBuyName(deliveryBuy) {
    if(deliveryBuy == 0) {
        return "买家自提";
    } else if (deliveryBuy == 1) {
        return "卖家送货";
    }
}

/**
 * 开票情况
 * @param invoiceType
 * @returns {*}
 */
function showInvoiceTypeName(invoiceType) {
    if(invoiceType == 0) {
        return "当月票";
    } else if (invoiceType == 1) {
        return "下月票";
    }
}

/**
 * 空处理
 * @param value
 * @returns {*}
 */
function nullToEmpty(value) {
    if (value == null || value == undefined) {
        return "";
    }

    return value;
}

/**
 * 数字金额验证【任意正整数，正小数（小数位不超过2位）】
 * @param value
 */
function validateNum(value){
    var reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    if(reg.test(value)){
        return true;
    }else{
        return false;
    }
}

/**
 * 判断是否为空
 * @return true 不为空
 */
function isNotNull(str){
    if(str && str != undefined && str != null && str != ''){
        return true;
    }
    return false;
}

function checkEmail(value) {//邮箱
    var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    if (!reg.test(value)) {
        return false;
    }
    return true;
}

/**
 * 异步查询数据字典的值  base_data_option
 * fieldId  数据域id
 * codeValues  数据域code集合
 * rowNum 数据总条数
 * classify 分类
 */
function codeConvertMain(fieldId,codeValues,rowNum,classify) {

    $.ajax({
        type:"post",
        url:"/common/queryBaseDataOptionCommon.json",
        data:{"codeValues": codeValues,"classifyParam":classify},
        success:function (data) {
            for(var i=0;i<rowNum;i++){
                $("#" + fieldId + i).text(data[i]);
            }
        }
    });
}

/**
 * 异步查询数据字典的值  lg_company_grade
 * fieldId  数据域id
 * gradeCodes  数据域code集合
 * rowNum 数据总条数
 */
function convertCompanyMain(fieldId,gradeCodes,rowNum) {
    $.ajax({
        type:"post",
        url:"/common/queryCompanyGradeMain.json",
        data:{"gradeCodes": gradeCodes},
        success:function (data) {
            for(var i=0;i<rowNum;i++){
                $("#" + fieldId + i).text(data[i]);
            }
        }
    });
}


/**
 * 根据状态取得对应的状态名称
 * fieldId  数据域id
 * codes  数据域code集合
 * enumName  对应枚举类名
 * rowNum 数据总条数
 */
function convertStatusCodeToNameMain(fieldId,codes,enumName,rowNum) {
    $.ajax({
        type:"post",
        url:"/common/queryStatusCodeToName.json",
        data:{"codes": codes,"enumName": enumName},
        success:function (data) {
            for(var i=0;i<rowNum;i++){
                $("#" + fieldId + i).text(data[i]);
            }
        }
    });
}

/**
 * 根据商品分类id查询商品类型
 */
function convertCateIdToNameMain(fieldId,cateIds,rowNum) {
    $.ajax({
        type:"post",
        url:"/common/queryCateNameMain.json",
        data:{"cateIds": cateIds},
        success:function (data) {
            for(var i=0;i<rowNum;i++){
                $("#" + fieldId + i).text(data[i]);
            }
        }
    });
}

/**
 * 判断各浏览器有没有安装flash插件(上传插件在有些浏览器中失效，比如FF)
 * 提示文案：经检测，您的浏览器没有安装flash插件，如需上传，请先安装flash插件
 */
function flashInstallCheck() {
    /*var isIE = !-[1,];
    var docText = "经检测，您的浏览器没有安装flash插件，如需上传，请先安装flash插件";
    if(isIE){
        try{
            var swf1 = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
        } catch(e){
            layer.alert(docText);
        }
    } else {
        try{
            var swf2 = navigator.plugins['Shockwave Flash'];
            if(swf2 == undefined){
                layer.alert(docText);
            }
        } catch(e){
            layer.alert(docText);
        }
    }*/
    var swf;
    var docText = "经检测，您的浏览器没有安装flash插件，如需上传，请先安装flash插件";
    if(navigator.userAgent.indexOf("MSIE")>0) {
        try
        {
            var swf=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
        }
        catch(e)
        {
            layer.alert(docText);
        }
    }
    if(navigator.userAgent.indexOf("Firefox")>0 || navigator.userAgent.indexOf("Chrome")>0){
        swf=navigator.plugins["Shockwave Flash"];
        (swf)?console.log("已安装插件"):layer.alert(docText);
    }
}

//ajax返回错误提示：账号停止则返回账号提示，其他情况显示系统异常
function showError(obj) {

    if(obj.status == 604) {

        // 此请求需要登录才能访问的情况不需要弹框

    }else if(obj.status != 500) {
        layer.alert("超时或系统异常", {icon: 2, skin: 'layer-ext-moon', title: '提示信息'});
    } else {
        layer.alert(obj.responseText, {icon: 2, skin: 'layer-ext-moon', title: '提示信息'});
    }
}

/**
 * 显示图片
 * @param imgSrc 图片全路径
 */

function layerPhotos(data,index){
    layer.photos({
        photos: {
            start:index,
            data:data
        },
        shift: 5,
        closeBtn:1
    });
}
//单张图片显示
function showImageMain(imgSrc) {
    if (imgSrc && imgSrc != undefined && imgSrc != null && imgSrc != '') {
        //$.fancybox({href: imgSrc});
        jk.layer.image(imgSrc);
    }
}

/**
 * 格式化合同状态
 * @param contractStatus
 */
function formatContractStatus(contractStatus) {
    
    if (contractStatus == '0') {
        return "<span class='orange'>未上传</span>";
    } else if (contractStatus == '1') {
        return "<span class='green'>已上传</span>";
    } else if (contractStatus == '2') {
        return "<span class='blue'>有效合同</span>";
    } else if (contractStatus == '3') {
        return "<span class='orange'>重新上传</span>";
    }
}


//去左右空格;
function trim(s) {
    return rtrim(ltrim(s));
}
//去左空格;
function ltrim(s) {
    return s.replace(/^\s*/, "");
}
//去右空格;
function rtrim(s) {
    return s.replace(/\s*$/, "");
}
//空字符值;
function isEmpty(s) {
    s = trim(s);
    return s.length == 0;
}

/**
 * 控制不显示NULL
 */
function notShowNull(column) {
    if (column == null || column == 'NULL' || column == undefined) {
        return '';
    }

    return column;
}

//add by francklin 20161013--------------------------------

$.fn.deserialize = function (serializedString) 
{
    var $form = $(this);
    $form[0].reset();
    serializedString = serializedString.replace(/\+/g, '%20');
    var formFieldArray = serializedString.split("&");

    // Loop over all name-value pairs
    $.each(formFieldArray, function(i, pair){
        var nameValue = pair.split("=");
        var name = decodeURIComponent(nameValue[0]);
        var value = decodeURIComponent(nameValue[1]);
        // Find one or more fields
        var $field = $form.find('[name=' + name + ']');

        // Checkboxes and Radio types need to be handled differently
        if ($field[0].type == "radio" || $field[0].type == "checkbox") 
        {
            var $fieldWithValue = $field.filter('[value="' + value + '"]');
            var isFound = ($fieldWithValue.length > 0);
            // Special case if the value is not defined; value will be "on"
            if (!isFound && value == "on") {
                $field.first().prop("checked", true);
            } else {
                $fieldWithValue.prop("checked", isFound);
            } 
        } else { // input, textarea
            $field.val(value);
        }
    });
    return this;
}
// jQuery plugin for clearing form fields
// http://stackoverflow.com/a/24496012/1766230
$.fn.clear = function()
{
        $(this).find('input')
                .filter(':text, :password, :file').val('')
                .end()
                .filter(':checkbox, :radio')
                    .removeAttr('checked')
                .end()
            .end()
        .find('textarea').val('')
            .end()
        .find('select').prop("selectedIndex", -1)
            .find('option:selected').removeAttr('selected')
        ;
        return this;
};

// Using plain javascript (in a jQuery plugin)
// From http://stackoverflow.com/a/17297193/1766230
$.fn.clear2 = function()
{
    var form = $(this)[0];
    var elements = form.elements;
    form.reset();
    for(i=0; i<elements.length; i++) {
        var field_type = elements[i].type.toLowerCase();
        switch(field_type) {             
          case "text":
          case "password":
          case "textarea":
          case "hidden":             
              elements[i].value = "";
              break;              
          case "radio":
          case "checkbox":
              if (elements[i].checked) {
                  elements[i].checked = false;
              }
              break;            
          case "select-one":
          case "select-multi":
              elements[i].selectedIndex = -1;
              break;             
          default:
              break;
          }
    }
    return this;
};

//----------------end------------------
/**
 * 判断用户是否有权限（有则跳转url地址，没有则提示错误信息）
 * @param url
 * @param perm
 */
function checkPermission(url,perm){
    $.ajax({
        type:"post",
        url:"/common/checkPermission",
        data:{"code": perm},
        error:function (data) {
            showError(data);
        },
        success:function (data) {
            if(data.code==0){
                window.location.href=url;
            }else{
                layer.alert(data.desc, {icon: 2, title: '提示信息'});
            }
        }
    });
}

/**
 ** 加法函数，用来得到精确的加法结果
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accAdd(arg1, arg2, fixed) {
    //默认小数点后两位四舍五入
    if (fixed == null || fixed == "") {
        fixed = 2;
    }
    arg1 = Number(arg1);
    arg2 = Number(arg2);
    if (NaN == arg1) {
        arg1 = 0;
    }
    if (NaN == arg2) {
        arg2 = 0;
    }
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }

    var result = (arg1 + arg2) / m;
    return result.toFixed(fixed);
}

/**
 ** 减法函数，用来得到精确的减法结果
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accSub(arg1, arg2, fixed) {
    //默认小数点后两位四舍五入
    if (fixed == null || fixed == "") {
        fixed = 2;
    }
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;

    var result = ((arg1 * m - arg2 * m) / m).toFixed(n);
    return result.toFixed(fixed);
}

/**
 ** 乘法函数，用来得到精确的乘法结果
 ** 调用：accMul(arg1,arg2)
 ** 返回值：arg1乘以 arg2的精确结果
 **/
function accMul(arg1, arg2, fixed) {
    //默认小数点后两位四舍五入
    if (fixed == null || fixed == "") {
        fixed = 2;
    }
    arg1 = Number(arg1);
    arg2 = Number(arg2);
    if (NaN == arg1) {
        arg1 = 0;
    }
    if (NaN == arg2) {
        arg2 = 0;
    }
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }

    var result = Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);

    return result.toFixed(fixed);
}

/**
 ** 除法函数，用来得到精确的除法结果
 ** 调用：accDiv(arg1,arg2)
 ** 返回值：arg1除以arg2的精确结果
 **/
function accDiv(arg1, arg2, fixed) {
    //默认小数点后两位四舍五入
    if (fixed == null || fixed == "") {
        fixed = 2;
    }
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));

        var result = (r1 / r2) * pow(10, t2 - t1);

        return result.toFixed(fixed);
    }
}

//表单FORM序列化成json
$.fn.serializeJson=function(){
    var serializeObj={};
    var array=this.serializeArray();
    $(array).each(function(){
        if(serializeObj[this.name]){
            if($.isArray(serializeObj[this.name])){
                serializeObj[this.name].push(this.value);
            }else{
                serializeObj[this.name]=[serializeObj[this.name],this.value];
            }
        }else{
            serializeObj[this.name]=this.value;
        }
    });
    return serializeObj;
};

/**
 * 判断是否为空
 * @return true 不为空
 */
function isNotNull(str){
    if(str && str != undefined && str != null && str != ''){
        return true;
    }
    return false;
}

/**
 * 根据文章类型查询文章列表
 */
function getArticlesByType(cellId,type,rowNum) {
    $.ajax({
        type:"post",
        url:"/common/articles",
        data:{"classify": type},
        success:function (data) {
            if(rowNum>data.rows.length){
                rowNum=data.rows.length;
            }
            for(var i=0;i<rowNum;i++){
                $("#"+cellId+type).after('<li><a href="'+jdtPlatformUrl+'/article/'+type+'/'+data.rows[i].id+'">'+data.rows[i].title+'</a></li>');
            }
        }
    });
}