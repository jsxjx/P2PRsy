(function($){


    require.config({
        paths: {
            echarts: '/static/js/ec/dist'
        }
    });
    // 使用
    require(
        [
            'echarts/echarts',
            'echarts/chart/bar', // 使用柱状图就加载bar模块，按需加载
            'echarts/chart/line',
            'echarts/chart/map'
        ],
        function (ec) {
            var $list = $('.list-group');
            var $nameArea = $('#nameArea');
            var $infoArea = $('#infoArea')
            var $search  = $("#search");
            var $type = $("[name='choice']"),
                $way = $("[name='way']");
            var type = 'hos',
                way = 'both',
                month = '0';
            var myChart = ec.init(document.getElementById('main'));
            var mapChart = ec.init(document.getElementById('map'));
            var url;
            //getlist(type,way);
            // 当更改 医院、科室、医生
            $("[name='choice']").click(function(e){
                type = this.value;
            });
            // 更改排序的方式
            $("[name='way']").click(function(e){
                way = this.value;
            });
            // 更改时间
            $("[name='month']").click(function(e){
                month = this.value;
            });
            //点击查询按钮
           $search.click(function(e){
               getlist(type,way,month);
           });
            //点击月度看病趋势tab
            $("#tagp").click(function(e){
                 var monthChart = ec.init(document.getElementById('month'));
                 monthChart.clear();
                 $.ajax({
                    url:'/getDay' + url,
                    dataType:'json',
                    success:function(data){
                         var datas = [];
                         data.data.map(function(item){
                             datas.push(item[1]);
                         })
                        console.log(datas);
                         option3 = {
                            tooltip : {
                                trigger: 'axis'
                            },

                            calculable : true,
                            xAxis : [
                                {
                                    type : 'category',
                                    boundaryGap : false,
                                    data : ['1日','2日','3日','4日','5日','6日','7日','8日','9日','10日','11日','12日','13日','14日','15日','16日','17日','18日','19日','20日','21日','22日','23日','24日','25日','26日','27日','28日','29日','30日']

                                }
                            ],
                            yAxis : [
                                {
                                    type : 'value',
                                    axisLabel : {
                                        formatter: '{value} 人'
                                    }
                                }
                            ],
                            series : [
                                {
                                    name:'人数',
                                    type:'line',
                                    data:datas,
                                    markPoint : {
                                        data : [
                                            {type : 'max', name: '最大值'},
                                            {type : 'min', name: '最小值'}
                                        ]
                                    },
                                    markLine : {
                                        data : [
                                            {type : 'average', name: '平均值'}
                                        ]
                                    }
                                }
                            ]
                        };


                         monthChart.setOption(option3);
                    }
                })
            })
            // 根据类型和排序方式获取排名列表
            function getlist(type,way,month){
                $.ajax({
                    url:'/getlist?type=' + type + "&way=" + way + "&month=" + month,
                    type:'get',
                    dataType:'json',
                    success:function(r){
                        myChart.clear();
                        var t = '';
                        var name = [];
                        var value = [];
                        r.data.map(function(item,i){
                            name.push(item[0]);
                            value.push(item[2]);
                            t+="<li class=\"list-group-item\"><a href='javascript:void(0)' data-name=/" + type + "/" + item[0] + ">"+ ( i + 1 ) + "."+ item[0] + " (" + item[1]+ ")</a></li>";
                        });
                        var option = {
                                tooltip: {
                                    show: true
                                },
                                legend: {
                                    data:['打分']
                                },
                                xAxis : [
                                    {
                                        type : 'category',
                                        data : name,
                                        axisLabel:{
                                            interval:0,
                                            rotate:-10,
                                            textStyle:{
                                                fontSize:9
                                            }
                                        }
                                    }
                                ],
                                yAxis : [
                                    {
                                        type : 'value'
                                    }
                                ],
                                series : [
                                    {
                                        "name":"分数",
                                        "type":"bar",
                                        "data":value,
                                        markPoint : {
                                            data : [
                                                {type : 'max', name: '最大值'},
                                                {type : 'min', name: '最小值'}
                                            ]
                                        },
                                        markLine : {
                                            data : [
                                                {type : 'average', name: '平均值'}
                                            ]
                                        }
                                    }
                                ]
                            };
                        $list.html(t);
                        $($list.find("a")).click(function (e) {
                            var url = $(e.currentTarget).attr('data-name');
                            clicka(url)
                        });
                        myChart.setOption(option);
                    }
                })
            }
            // 点击列表里的某一行
            function clicka(data) {
                url = data;
                var name = data.slice(5);
                if(data.indexOf('dept')!=-1){
                    name = data.slice(6);
                }
                $nameArea.html(name);
                $infoArea.html('');

                        var datas = [];
                        var area = [];
                        var values = [];
                $.ajax({
                    url:data,
                    dataType:'json',
                    data:{
                        month:month
                    },
                    success:function(data){
                        mapChart.clear();
                        data.data.map(function(item){
                            var des = item[0],
                                value = item[1];
                            if(des != "上海") {
                                area.push({name:des,value:value});
                                values.push(value);
                                var it = [{name:"上海"},{name:des,value:value}];
                                datas.push(it);
                            }

                        });

                        console.log(values)
                        var max = Math.max.apply(null,values);
                        var option1 = {
                backgroundColor: '#1b1b1b',
                color: ['gold','aqua','lime'],
                title : {
                    text: '就医人数外省分布',
                    x:'center',
                    textStyle : {
                        color: '#fff'
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: '{b}'
                },

                toolbox: {
                    show : true,
                    orient : 'vertical',
                    x: 'right',
                    y: 'center',
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                dataRange: {
                    min : 0,
                    max : max,
                    calculable : true,
                    color: ['#ff3333', 'orange', 'yellow','lime','aqua'],
                    textStyle:{
                        color:'#fff'
                    }
                },
                series : [
                    {
                        name: '全国',
                        type: 'map',
                        roam: true,
                        hoverable: false,
                        mapType: 'china',
                        itemStyle:{
                            normal:{
                                borderColor:'rgba(100,149,237,1)',
                                borderWidth:0.5,
                                areaStyle:{
                                    color: '#1b1b1b'
                                }
                            }
                        },
                        data:[],
                        markLine : {
                            smooth:true,
                            symbol: ['none', 'circle'],
                            symbolSize : 1,
                            itemStyle : {
                                normal: {
                                    color:'#fff',
                                    borderWidth:1,
                                    borderColor:'rgba(30,144,255,0.5)'
                                }
                            },
                            data : [],
                        },
                        geoCoord: {
                            '青海':[96.2025,35.4998],
                            '辽宁':[122.7536,41.6216],
                            '贵州':[106.7350,26.9028],
                            '北京':[116.3956,39.9300],
                            '广西':[108.9243,23.5523],
                            '澳门':[113.5575,22.2041],
                            '广东':[113.3948,23.4080],
                            '上海':[121.4879,31.2492],
                            '云南':[101.5930,24.8642],
                            '甘肃':[102.4576,38.1033],
                            '山东':[118.5277,36.0993],
                            '江西':[115.6761,27.7573],
                            '宁夏':[106.1555,37.3213],
                            '海南':[106.9254,39.2962],
                            '湖南':[111.7207,27.6959],
                            '台湾':[121.9739,24.0870],
                            '河北':[117.2203,39.1731],
                            '西藏':[89.1380,31.3673],
                            '吉林':[126.5645,43.8720],
                            '黑龙江':[128.0474,47.3566],
                            '福建':[117.9849,26.0501],
                            '天津':[117.2108,39.1439],
                            '内蒙古':[114.4159,43.4682],
                            '安徽':[117.2160,31.8593],
                            '陕西':[109.5038,35.8600],
                            '山西':[112.5155,37.8666],
                            '新疆':[103.8499,36.0646],
                            '四川':[102.8992,30.3675],
                            '重庆':[106.5306,29.5446],
                            '湖北':[112.4106,31.2093],
                            '江苏':[119.3685,33.0138],
                            '河南':[101.5563,34.5114],
                            '浙江':[119.9572,29.1595],
                            '香港':[114.1861,22.2936]
                        }
                    },
                    {
                        name: '上海',
                        type: 'map',
                        mapType: 'china',
                        data:[],
                        markLine : {
                            smooth:true,
                            symbol:['arrow','circle'],
                            effect : {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle : {
                                normal: {
                                    borderWidth:1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data :datas
                        },
                        markPoint : {
                            symbol:'emptyCircle',
                            symbolSize : function (v){
                                return  v/500
                            },
                            effect : {
                                show: true,
                                shadowBlur : 0
                            },
                            itemStyle:{
                                normal:{
                                    label:{show:false}
                                },
                                emphasis: {
                                    label:{position:'top'}
                                }
                            },
                            data :area
                        }
                    }
    ]
};
                        mapChart.setOption(option1);
                    }
                });
                if(data.indexOf('doc')!=-1){
                    $.ajax({
                        url:'/getDocInfo/' + name,
                        dataType:'json',
                        success:function(data){
                            var datas = [];
                            data.data.map(function(item){
                                var s = item[1] + " -- " + item[2];
                                datas.push(s);
                            });
                            $infoArea.html(datas.join("<br/>"));
                        }
                    })
                }

            }



        }
    );
})(jQuery)