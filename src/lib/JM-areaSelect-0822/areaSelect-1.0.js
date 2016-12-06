!function ($, win, doc) {
    // 组件    
    function JMareaSelect(element, config) {
        // 判断是否是jquery对象
        if (element instanceof jQuery && element.length > 1) {
            this.$element = $(element[0]); // 只用第一个元素初始化
        };
        this.$element = $(element); // 当前元素
        this.config = $.extend({}, JMareaSelect.DEFAULTS, $.isPlainObject(config) && config);
        this.placeholder = this.config.placeholder || "请选择...";
        this.callBack = this.config.callBack || function () { }; //回调
        this.areaData = {}; // 地区数据
        this.active = false; // 是否已经激活
        this.selectWrap = null; // 选择器容器
        this.defaultValue = {}; // 默认值
        this.areaValue = {}; // 选择的地区值
        this.value = {}; // 最后选择成功的完整值
        this.init(this.config); // 初始化
        this.getDataDefer; // 获取数据时的promise
    }
    // 定义默认参数
    JMareaSelect.DEFAULTS = {
        autoSelect: false,
        // 层级配置数据
        levelsData: {
            // 内河航运
            innerPort: [{ title: '沿线', en: 'alongLine' }, { title: '省', en: 'province' }, { title: '港口', en: 'port' }],
            // 海运
            port: [{ title: '沿线', en: 'line' }, { title: '国家', en: 'country' }, { title: '港口', en: 'port' }],
            // 省市区
            area: [{ title: '省', en: 'province' }, { title: '市', en: 'city' }, { title: '区/县', en: 'area' }]
        },
        levelsMode: 'area',
        ajaxUrl: '/common/'
    };

    JMareaSelect.prototype = {
        constructor: JMareaSelect,
        init: function (conf) {
            var self = this,
                config = conf;
            self.createDom(config);
            self.$element.find('.input').on('click', function (e) {
                e.stopPropagation();
                $('.jm-areaselect').find('.areas-wrap').hide().parent().find('.input').removeClass('active');
                $(this).addClass('active');
                self.selectWrap.show();
            });
            $(document).on('click', function () {
                self.close();
            });
            self.$element.find('.input').val(self.placeholder);
            // 设置默认值
            var _value = config.defaultValue;
            if (_value && $.isPlainObject(_value)) {
                self.defaultValue = $.extend({}, _value);
                self.setValue(_value);
            }
        },

        // 构建DOM
        createDom: function (conf) {
            var self = this,
                config = conf,
                levels = config.levelsData[config.levelsMode];
            var layout, // 选择器布局骨架
                selectWrap, // 选择器容器
                tabWrap, // 头部层级tab容器
                areasWrap; // 地区列表容器

            this.selectWrap = selectWrap = $("<div class='areas-wrap'></div>");
            tabWrap = $("<ul class='area-headers'></ul>");
            areasWrap = $("<div class='areas-cont'></div>");
            clearBtn = $("<a class='areas-btn-clear'>清除</a>");
            closeBtn = $("<a class='areas-btn-close'>×</a>");
            // 建立头部层级tab和地区列表各层级容器
            var headers = config.levelsData[config.levelsMode];
            $(headers).each(function (i, e) {
                var tabClass = "areas-head",
                    areaClass = "showAddrArea " + e.en;
                if (!i) {
                    tabClass += " active";
                    areaClass += " active";
                };
                tabWrap.append($("<li class='" + tabClass + "' data-name='" + e.title + "' data-level='" + i + "'>" + e.title + "</li>"));
                tabWrap.append(clearBtn, closeBtn);
                areasWrap.append($("<div class='" + areaClass + "' data-name='" + e.title + "' data-level='" + i + "'>请先选择上一级...</div>"));
            })
            var allTabs = tabWrap.find("li");
            // 层级tab事件
            allTabs.on('click', function () {
                var index = $(this).data("level");
                allTabs.removeClass('active');
                $(this).addClass("active");
                areasWrap.find(".showAddrArea").hide().eq(index).show();
            });
            // 清除按钮事件
            clearBtn.on('click', function () {
                self.$element.find('.input').val(self.placeholder);
                self.$element.find('.input').prev('input').val('');// by longqiong
                self.value = {};
                allTabs.removeClass('active');
                allTabs.eq(0).addClass('active');
                areasWrap.find(".showAddrArea").hide().eq(0).show();
                areasWrap.find(".showAddrArea").slice(1).html('请先选择上一级...');
            });
            // 关闭按钮事件
            closeBtn.on('click', function () {
                self.close();
            });
            selectWrap.append(tabWrap, areasWrap);
            selectWrap.on('click', function (e) {
                e.stopPropagation();
            });
            // 鼠标离开选择区域0.5秒钟后隐藏
            // selectWrap.on('mouseover', function () {
            //     window.areaHideTimeout && clearTimeout(window.areaHideTimeout);
            // }).on('mouseout', function () {
            //     window.areaHideTimeout && clearTimeout(window.areaHideTimeout);
            //     window.areaHideTimeout = setTimeout(function () { self.close() }, 500);
            // })

            // ajax请求数据第一层级数据
            $.ajax({
                type: "get",
                url: config.ajaxUrl + config.levelsMode,
                dataType: "json",
                success: function (result) {
                    self.areaData[config.levelsMode] = result;
                    var levelData = result;
                    var level_1_box = areasWrap.find('div').filter(":first");
                    level_1_box.html('');
                    // 构建地区列表dom
                    var itemBox = $("<div class='item-box'></div>");
                    $.each(levelData, function (i, item) {
                        level_1_box.append($("<a class='item' data-text='" + item.text + "' data-id='" + item.id + "'>" + item.text + "</a>"))
                    })
                    // 给所有地区项加点击事件
                    selectWrap.on('click', '.showAddrArea .item', function (e) {
                        self.$element.find('.input').addClass('active').focus();
                        var level = $(this).parents('.showAddrArea').data('level');
                        var itemName = $(this).data('text');
                        // 设置地区选择值
                        var area = {
                            value: itemName,
                            id: $(this).data('id')
                        };
                        if (!level){
                            self.areaValue={};
                        }
                        if (level>0) {
                            for (var i=level+1;i<levels.length;i++){
                                self.areaValue[i] && ( delete self.areaValue[i]);
                            }
                        }
                        self.areaValue[level] = area;
                        // // 设置最后完整值
                        self.value = $.extend({}, self.areaValue)
                        var areaValueStr = self.getStrValue();
                        if(level>0){
                            if(config.levelsMode=='area'){
                                self.$element.find('.input').val(areaValueStr);
                                self.$element.find('.input').prev('input').val(self.getValue()[level].id);
                            }else{
                                if(level==2){
                                    self.$element.find('.input').val(areaValueStr);
                                    self.$element.find('.input').prev('input').val(self.getValue()[level].id);
                                }
                            }
                        }else{
                            self.$element.find('.input').val(self.placeholder);
                            self.$element.find('.input').prev('input').val('');
                        }

                        // 判断是否最后一级
                        if (level != levels.length - 1) {
                            var levelCode = levels[level + 1].en;
                            var areaId = $(this).data('id');
                            var nextLevelData;
                            // 请求下一层级数据
                            self.getDataDefer = $.Deferred();
                            // 请求数据
                            self.getData(areaId);
                            self.getDataDefer.done(
                                // 请求成功时处理
                                function (value) {
                                    nextLevelData = value;
                                    areasWrap.find(".showAddrArea").eq(level).nextAll().html('请先选择上一级...');
                                    if (value.length==0){
                                        areasWrap.find(".showAddrArea").eq(level).next().html('无数据');
                                    };
                                    self.render(nextLevelData, levelCode, level + 1);
                                    var i;
                                    for (i = level + 1; i < levels.length; i++) {
                                        self.areaValue[i] = null;
                                    };
                                    return value;
                                }
                            ).fail(
                                // 请求失败时处理
                                function (value) {
                                    layer.alert('数据加载失败,请刷新重试')
                                }
                                );

                        } else {
                            // // 设置最后完整值
                            // self.value = $.extend({}, self.areaValue)
                            // var areaValueStr = self.getStrValue();
                            // self.$element.find('.input').val(areaValueStr);
                            // self.$element.find('.input').next('input').val(self.getValue()[2].id);
                            self.close();
                            self.callBack();
                        }
                    })
                    self.$element.append(selectWrap)
                },
                error: function () {
                    layer.alert('数据加载失败,请刷新重试');
                }
            });
        },

        close: function () {
            this.selectWrap.hide();
            this.$element.find('.input').removeClass('active');
        },

        // 请求下一级地区数据
        getData: function (levelId) {
            var self = this,
                config = this.config;
            var data;
            var url = config.ajaxUrl + config.levelsMode;
            if (self.areaData[levelId]) {
                self.getDataDefer.resolve(self.areaData[levelId]);
            } else {
                // 通过ajax请求数据
                var json = $.ajax({
                    type: "get",
                    url: url + "?parentCode=" + levelId,
                    dataType: "json"
                });
                json.done(function (result) {
                    // 请求成功时返回数据
                    self.areaData[levelId] = result;
                    self.getDataDefer.resolve(result);
                }).fail(function (result) {
                    layer.alert(result);
                })
            }
        },
        render: function (data, levelCode, level) {
            var self = this;
            var itemBox = self.selectWrap.find("." + levelCode);
            if (data && $.isArray(data)) {
                if (data.length > 0) {
                    itemBox.html('');
                    $.each(data, function (i, item) {
                        itemBox.append($("<a class='item' data-text='" + item.text + "' data-id='" + item.id + "'>" + item.text + "</a>"))
                    })
                }
            } else {
                itemBox.html('没有数据')
            }
            self.selectWrap.find(".showAddrArea").hide();
            itemBox.show();
            self.selectWrap.find(".areas-head").removeClass("active").eq(level).addClass("active");
        },

        // 获取字符串值
        getStrValue: function () {

            var _value = this.value;
            // console.dir(_value)
            var strValue = '';
            var item;
            for (item in _value) {
                strValue +=(_value[item] ? _value[item].value : '');
            }
            return strValue;
        },

        // 获取对象形式值
        getValue: function () {
            return this.value;
        },

        // 重置控件
        reset: function () {
            this.init(this.config);
        },

        // 重设层级模式
        setLevels: function (mode) {
            this.config.levelsMode = mode;
            this.config.defaultValue = null;
            this.init(this.config);
        },

        setValue: function (value) {
            if ($.isPlainObject(value)) {
                this.value = $.extend({}, value);
                var areaValueStr = this.getStrValue();
                var dom = this.$element.find('.input');
                dom.val(areaValueStr);
            }
        },
        destroy: function () { }
    }

    win.JMareaSelect = JMareaSelect;

} (jQuery, window, document)