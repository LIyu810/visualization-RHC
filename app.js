function formatDate(date){const y=date.getFullYear();const m=String(date.getMonth()+1).padStart(2,'0');const d=String(date.getDate()).padStart(2,'0');return `${y}-${m}-${d}`}

function setDefaultDates(){const end=new Date();const start=new Date();start.setDate(end.getDate()-14);document.getElementById('startDate').value=formatDate(start);document.getElementById('endDate').value=formatDate(end);const wd=document.getElementById('weatherDate');if(wd){const d=new Date();wd.max=formatDate(d);const min=new Date();min.setDate(d.getDate()-180);wd.min=formatDate(min);wd.value=formatDate(d)}}

function collectFilters(){const form=document.getElementById('filters');const data={};Array.from(form.elements).forEach(el=>{if(!el.id) return; const tag=el.tagName; const type=(el.type||'').toLowerCase(); if((tag==='SELECT'||type==='date'||type==='hidden')&&el.value!==undefined){data[el.id]=el.value}});return data}

function buildTextRule(opId,inputId){const op=document.getElementById(opId).value;const raw=(document.getElementById(inputId).value||'').trim();const values=raw?raw.split(';').map(s=>s.trim()).filter(Boolean):[];return JSON.stringify({op,values})}

function setDefaultRegionRules(){['province','city','biz'].forEach(id=>{const hidden=document.getElementById(id);if(hidden) hidden.value=JSON.stringify({op:'in',values:[]})})}

function generateMockSeries(){
  const categories=['<0','0','0-0.1','0.1-0.2','0.2-0.3','0.3-0.4','0.4-0.5','0.5-0.6','0.6-0.7','0.7-0.8','0.8+'];
  const values=[11.6,7.2,9.9,12.1,11.6,9.5,7.2,6.3,3.8,1.9,1.3].map(v=>Number(v.toFixed?v.toFixed(2):v));
  return {categories,values}
}

function generateStrategyDistributionMock(){
  // 横坐标：-1.5%到2.0%，步长0.5%
  const categories = ['-1.5%', '-1.0%', '-0.5%', '0.0%', '0.5%', '1.0%', '1.5%', '2.0%'];
  // 纵坐标：0%到4.5%，生成合理的分布数据
  const values = [0.8, 1.2, 2.1, 3.4, 2.8, 1.9, 1.1, 0.6].map(v => Number(v.toFixed(1)));
  return {categories, values};
}

function generateGroupedStrategyDistributionMock(groupBy, groups){
  const categories = ['-1.5%', '-1.0%', '-0.5%', '0.0%', '0.5%', '1.0%', '1.5%', '2.0%'];
  const series = [];
  const colors = ['#8ECFC9', '#FFBE7A', '#FA7F6F', '#82B0D2', '#BEB8DC', '#E7DAD2', '#999999'];
  
  groups.forEach((group, index) => {
    // 为每个分组生成不同的数据分布
    const baseValues = [0.8, 1.2, 2.1, 3.4, 2.8, 1.9, 1.1, 0.6];
    const variation = (Math.random() - 0.5) * 0.5; // -0.25到0.25的随机变化
    const values = baseValues.map(v => Math.max(0, Number((v + variation).toFixed(1))));
    
    series.push({
      name: group,
      type: 'bar',
      data: values,
      itemStyle: {
        color: colors[index % colors.length]
      },
      barMaxWidth: 20,
      emphasis: {
        focus: 'series'
      },
      label: {
        show: false
      }
    });
  });
  
  return {categories, series};
}

// 日常异常策略分布 - 横坐标-2.5%到3.0%，纵坐标和为100%
function generateDailyAbnormalMock(){
  const categories = ['-2.5%', '-2.0%', '-1.5%', '-1.0%', '-0.5%', '0.0%', '0.5%', '1.0%', '1.5%', '2.0%', '2.5%', '3.0%'];
  // 生成和为100%的分布数据
  const rawValues = [8.5, 12.3, 15.2, 18.7, 14.8, 12.1, 8.9, 6.2, 4.1, 2.8, 1.5, 0.9];
  const total = rawValues.reduce((sum, val) => sum + val, 0);
  const values = rawValues.map(v => Number((v * 100 / total).toFixed(1)));
  return {categories, values};
}

function generateGroupedDailyAbnormalMock(groupBy, groups){
  const categories = ['-2.5%', '-2.0%', '-1.5%', '-1.0%', '-0.5%', '0.0%', '0.5%', '1.0%', '1.5%', '2.0%', '2.5%', '3.0%'];
  const series = [];
  const colors = ['#8ECFC9', '#FFBE7A', '#FA7F6F', '#82B0D2', '#BEB8DC', '#E7DAD2', '#999999'];
  
  groups.forEach((group, index) => {
    // 为每个分组生成和为100%的分布数据
    const rawValues = [8.5, 12.3, 15.2, 18.7, 14.8, 12.1, 8.9, 6.2, 4.1, 2.8, 1.5, 0.9];
    const variation = (Math.random() - 0.5) * 0.3; // -0.15到0.15的随机变化
    const adjustedValues = rawValues.map(v => Math.max(0.1, v + variation));
    const total = adjustedValues.reduce((sum, val) => sum + val, 0);
    const values = adjustedValues.map(v => Number((v * 100 / total).toFixed(1)));
    
    series.push({
      name: group,
      type: 'bar',
      data: values,
      itemStyle: {
        color: colors[index % colors.length]
      },
      barMaxWidth: 15,
      emphasis: {
        focus: 'series'
      },
      label: {
        show: false
      }
    });
  });
  
  return {categories, series};
}

// 异常天气策略分布 - 横坐标-1.0%到0%，纵坐标和为100%
function generateWeatherAbnormalMock(){
  const categories = ['-1.0%', '-0.5%', '0.0%'];
  // 生成和为100%的分布数据
  const rawValues = [35.2, 45.8, 19.0];
  const total = rawValues.reduce((sum, val) => sum + val, 0);
  const values = rawValues.map(v => Number((v * 100 / total).toFixed(1)));
  return {categories, values};
}

function generateGroupedWeatherAbnormalMock(groupBy, groups){
  const categories = ['-1.0%', '-0.5%', '0.0%'];
  const series = [];
  const colors = ['#8ECFC9', '#FFBE7A', '#FA7F6F', '#82B0D2', '#BEB8DC', '#E7DAD2', '#999999'];
  
  groups.forEach((group, index) => {
    // 为每个分组生成和为100%的分布数据
    const rawValues = [35.2, 45.8, 19.0];
    const variation = (Math.random() - 0.5) * 0.2; // -0.1到0.1的随机变化
    const adjustedValues = rawValues.map(v => Math.max(0.1, v + variation));
    const total = adjustedValues.reduce((sum, val) => sum + val, 0);
    const values = adjustedValues.map(v => Number((v * 100 / total).toFixed(1)));
    
    series.push({
      name: group,
      type: 'bar',
      data: values,
      itemStyle: {
        color: colors[index % colors.length]
      },
      barMaxWidth: 25,
      emphasis: {
        focus: 'series'
      },
      label: {
        show: false
      }
    });
  });
  
  return {categories, series};
}

// 热点事件分布 - 横坐标-2.0%到0%，纵坐标和为100%
function generateHotEventMock(){
  const categories = ['-2.0%', '-1.5%', '-1.0%', '-0.5%', '0.0%'];
  // 生成和为100%的分布数据
  const rawValues = [12.5, 18.3, 28.7, 25.4, 15.1];
  const total = rawValues.reduce((sum, val) => sum + val, 0);
  const values = rawValues.map(v => Number((v * 100 / total).toFixed(1)));
  return {categories, values};
}

function generateGroupedHotEventMock(groupBy, groups){
  const categories = ['-2.0%', '-1.5%', '-1.0%', '-0.5%', '0.0%'];
  const series = [];
  const colors = ['#8ECFC9', '#FFBE7A', '#FA7F6F', '#82B0D2', '#BEB8DC', '#E7DAD2', '#999999'];
  
  groups.forEach((group, index) => {
    // 为每个分组生成和为100%的分布数据
    const rawValues = [12.5, 18.3, 28.7, 25.4, 15.1];
    const variation = (Math.random() - 0.5) * 0.25; // -0.125到0.125的随机变化
    const adjustedValues = rawValues.map(v => Math.max(0.1, v + variation));
    const total = adjustedValues.reduce((sum, val) => sum + val, 0);
    const values = adjustedValues.map(v => Number((v * 100 / total).toFixed(1)));
    
    series.push({
      name: group,
      type: 'bar',
      data: values,
      itemStyle: {
        color: colors[index % colors.length]
      },
      barMaxWidth: 20,
      emphasis: {
        focus: 'series'
      },
      label: {
        show: false
      }
    });
  });
  
  return {categories, series};
}

function generateGroupedMockSeries(groupBy, groups){
  const categories=['<0','0','0-0.1','0.1-0.2','0.2-0.3','0.3-0.4','0.4-0.5','0.5-0.6','0.6-0.7','0.7-0.8','0.8+'];
  const colors = ['#8ECFC9', '#FFBE7A', '#FA7F6F', '#82B0D2', '#BEB8DC', '#E7DAD2', '#999999'];
  const series = groups.map((group, index) => {
    const values = categories.map(() => Math.round(Math.random() * 20 * 10) / 10);
    return {
      name: group,
      type: 'bar',
      data: values,
      itemStyle: {
        color: colors[index % colors.length]
      }
    };
  });
  return { categories, series };
}

function generateHotelStrategyMock(){
  const categories=['业务提报beat0酒店','qcps偏移策略','动态定价策略','货定价策略','兜底策略'];
  const values=[2,7,10,80,1];
  const colors=['#8ECFC9','#FFBE7A','#FA7F6F','#82B0D2','#BEB8DC'];
  return {categories,values,colors}
}

function generateGroupedHotelStrategyMock(groupBy, groups){
  const categories=['业务提报beat0酒店','qcps偏移策略','动态定价策略','货定价策略','兜底策略'];
  const colors = ['#8ECFC9', '#FFBE7A', '#FA7F6F', '#82B0D2', '#BEB8DC', '#E7DAD2', '#999999'];
  const series = groups.map((group, index) => {
    const values = categories.map(() => Math.round(Math.random() * 100 * 10) / 10);
    return {
      name: group,
      type: 'bar',
      data: values,
      itemStyle: {
        color: colors[index % colors.length]
      }
    };
  });
  return { categories, series };
}

function generatePricingBeatMock(){
  return {
    algo:{categories:['0','1','2','3','4','5'],values:[5,20,40,20,10,5]},
    order:{categories:['不可定价','优惠黑名单','<0','0-','0-0.5%','0.5-1%','1-1.5%','1.5-2%','2-2.5%','2.5-3%','3%+'],values:[10,40,4.5,3.8,8.2,12.1,10.8,6.4,2.9,1.1,2.6]}
  }
}

function generateGroupedPricingBeatMock(groupBy, groups){
  const algoCategories = ['0','1','2','3','4','5'];
  const orderCategories = ['不可定价','优惠黑名单','<0','0-','0-0.5%','1-1.5%','1.5-2%','2-2.5%','2.5-3%','3%+'];
  const colors = ['#8ECFC9', '#FFBE7A', '#FA7F6F', '#82B0D2', '#BEB8DC', '#E7DAD2', '#999999'];
  
  const algoSeries = groups.map((group, index) => ({
    name: group,
    type: 'bar',
    data: algoCategories.map(() => Math.round(Math.random() * 50 * 10) / 10),
    itemStyle: {
      color: colors[index % colors.length]
    }
  }));
  
  const orderSeries = groups.map((group, index) => ({
    name: group,
    type: 'bar',
    data: orderCategories.map(() => Math.round(Math.random() * 50 * 10) / 10),
    itemStyle: {
      color: colors[index % colors.length]
    }
  }));
  
  return {
    algo: { categories: algoCategories, series: algoSeries },
    order: { categories: orderCategories, series: orderSeries }
  };
}

function generateFunnelMock(){
  return {stages:['总间夜','货定价算法生产','可定价','可beat','货定价生效'],values:[100,99,90,45,40]}
}

function generateEffectPieMock(){
  return {labels:['命中beat上限','命中佣金率下限','正常生效'],values:[5,12,83],colors:['#FFBE7A','#FA7F6F','#8ECFC9']}
}

function generateGroupMock(group, customValues){
  if(customValues && customValues.length){return {groups:customValues}}
  const groups = group==='starType'?['高星','中星','低星'] : group==='star'?['高星','中星','低星'] : group==='adr'?['低','中','高'] : ['高量','中量','低量'];
  return {groups}
}

function mockCOCCTable(){const base=[
  {province:'广东',city:'深圳',biz:'南山科技园',stay:'2025/7/15-2025/7/16',strategy:'1.2%',traffic:'8,520',threshold:'10,000',night:'0.3%',revenue:'0.4%'},
  {province:'上海',city:'上海',biz:'陆家嘴',stay:'2025/7/18-2025/7/19',strategy:'0.8%',traffic:'12,350',threshold:'15,000',night:'0.2%',revenue:'0.3%'},
  {province:'北京',city:'北京',biz:'中关村',stay:'2025/7/20-2025/7/21',strategy:'1.5%',traffic:'9,680',threshold:'12,000',night:'0.5%',revenue:'0.4%'},
  {province:'浙江',city:'杭州',biz:'滨江区',stay:'2025/7/22-2025/7/23',strategy:'0.7%',traffic:'6,420',threshold:'8,000',night:'0.2%',revenue:'0.2%'},
  {province:'江苏',city:'南京',biz:'新街口',stay:'2025/7/18-2025/7/19',strategy:'0.9%',traffic:'7,850',threshold:'9,500',night:'0.3%',revenue:'0.3%'},
  {province:'四川',city:'成都',biz:'高新区',stay:'2025/7/12-2025/7/13',strategy:'1.1%',traffic:'5,680',threshold:'7,000',night:'0.4%',revenue:'0.5%'},
  {province:'湖北',city:'武汉',biz:'光谷',stay:'2025/7/25-2025/7/26',strategy:'0.6%',traffic:'4,320',threshold:'6,000',night:'0.2%',revenue:'0.2%'},
  {province:'福建',city:'厦门',biz:'思明区',stay:'2025/7/16-2025/7/17',strategy:'0.5%',traffic:'3,850',threshold:'5,500',night:'0.1%',revenue:'0.2%'},
  {province:'山东',city:'青岛',biz:'市南区',stay:'2025/7/19-2025/7/20',strategy:'0.8%',traffic:'5,120',threshold:'6,800',night:'0.3%',revenue:'0.3%'},
  {province:'河南',city:'郑州',biz:'金水区',stay:'2025/7/21-2025/7/22',strategy:'0.7%',traffic:'4,680',threshold:'6,200',night:'0.2%',revenue:'0.2%'},
  {province:'湖南',city:'长沙',biz:'岳麓区',stay:'2025/7/23-2025/7/24',strategy:'0.9%',traffic:'4,950',threshold:'6,500',night:'0.3%',revenue:'0.3%'},
  {province:'安徽',city:'合肥',biz:'蜀山区',stay:'2025/7/24-2025/7/25',strategy:'0.6%',traffic:'3,420',threshold:'5,000',night:'0.2%',revenue:'0.2%'},
  {province:'江西',city:'南昌',biz:'东湖区',stay:'2025/7/26-2025/7/27',strategy:'0.8%',traffic:'3,680',threshold:'5,200',night:'0.3%',revenue:'0.3%'},
  {province:'河北',city:'石家庄',biz:'长安区',stay:'2025/7/27-2025/7/28',strategy:'0.7%',traffic:'3,850',threshold:'5,500',night:'0.2%',revenue:'0.2%'},
  {province:'山西',city:'太原',biz:'迎泽区',stay:'2025/7/28-2025/7/29',strategy:'0.6%',traffic:'2,950',threshold:'4,500',night:'0.2%',revenue:'0.2%'}
];
  return base
}

function mockWeatherByDate(dt){
  const pool=[
    {province:'广东',city:'深圳',type:'暴雨',level:'红色',beat:'1.0',night:'0.6%',revenue:'0.5%'},
    {province:'上海',city:'上海',type:'高温',level:'橙色',beat:'0.5',night:'0.3%',revenue:'0.2%'},
    {province:'浙江',city:'杭州',type:'台风',level:'红色',beat:'1.0',night:'0.4%',revenue:'0.3%'},
    {province:'江苏',city:'南京',type:'暴雨',level:'橙色',beat:'0.5',night:'0.2%',revenue:'0.2%'},
    {province:'四川',city:'成都',type:'暴雨',level:'红色',beat:'1.0',night:'0.5%',revenue:'0.4%'},
    {province:'湖北',city:'武汉',type:'高温',level:'橙色',beat:'0.5',night:'0.3%',revenue:'0.2%'},
    {province:'广东',city:'广州',type:'雷暴',level:'黄色',beat:'0.3',night:'0.2%',revenue:'0.2%'},
    {province:'浙江',city:'宁波',type:'大风',level:'蓝色',beat:'0.2',night:'0.1%',revenue:'0.1%'},
    {province:'江苏',city:'苏州',type:'雷暴',level:'黄色',beat:'0.3',night:'0.2%',revenue:'0.2%'},
    {province:'四川',city:'绵阳',type:'大风',level:'蓝色',beat:'0.2',night:'0.1%',revenue:'0.1%'}
  ];
  const idx=(new Date(dt||Date.now()).getDate())%pool.length;return pool.slice(idx).concat(pool.slice(0,idx)).slice(0,10)
}

function mockHotEvents(){
  return [
    {name:'周杰伦演唱会',level:'P1',province:'上海',city:'上海',stay:'2025/7/25-2025/7/26',strategy:'1.5%',night:'0.4%',status:'未开始'},
    {name:'深圳市教师资格证考试',level:'P2',province:'广东',city:'深圳',stay:'2025/7/22-2025/7/23',strategy:'1.0%',night:'0.3%',status:'未开始'},
    {name:'北京国际车展',level:'P1',province:'北京',city:'北京',stay:'2025/7/28-2025/7/30',strategy:'1.5%',night:'0.5%',status:'未开始'},
    {name:'杭州马拉松',level:'P2',province:'浙江',city:'杭州',stay:'2025/7/30-2025/7/31',strategy:'1.0%',night:'0.4%',status:'未开始'},
    {name:'成都美食节',level:'P2',province:'四川',city:'成都',stay:'2025/7/26-2025/7/27',strategy:'1.0%',night:'0.3%',status:'未开始'}
  ]
}

let chartProduct,chartThird,chartHotelStrategyBar,chartHotelStrategyPie;
let chartPriceBeatAlgo,chartPriceBeatOrder,chartPriceFunnel,chartPriceEffectPie;
let chartTargetBar,chartElasticBar,chartQCBox,chartCEQMBox;
let chartDynDist,chartDailyAbnormal,chartWeatherAbnormal,chartHotEvent,chartDynFunnel;
let chartWeatherProvinceShare,chartWeatherLevelByProvince;

let pendingCustomGroups=[];
let currentGroupBy = ''; // 默认为空，表示整体分组
let currentGroups = []; // 默认为空数组

function initCharts(){
  chartProduct=echarts.init(document.getElementById('chartProduct'));
  chartThird=echarts.init(document.getElementById('chartThird'));
  chartHotelStrategyBar=echarts.init(document.getElementById('chartHotelStrategyBar'));
  chartHotelStrategyPie=echarts.init(document.getElementById('chartHotelStrategyPie'));
  chartPriceBeatAlgo=echarts.init(document.getElementById('chartPriceBeatAlgo'));
  chartPriceBeatOrder=echarts.init(document.getElementById('chartPriceBeatOrder'));
  chartPriceFunnel=echarts.init(document.getElementById('chartPriceFunnel'));
  chartPriceEffectPie=echarts.init(document.getElementById('chartPriceEffectPie'));
  chartTargetBar=echarts.init(document.getElementById('chartTargetBar'));
  chartElasticBar=echarts.init(document.getElementById('chartElasticBar'));
  chartQCBox=echarts.init(document.getElementById('chartQCBox'));
  chartCEQMBox=echarts.init(document.getElementById('chartCEQMBox'));
  chartDynDist=echarts.init(document.getElementById('chartDynDist'));
  chartDailyAbnormal=echarts.init(document.getElementById('chartDailyAbnormal'));
  chartWeatherAbnormal=echarts.init(document.getElementById('chartWeatherAbnormal'));
  chartHotEvent=echarts.init(document.getElementById('chartHotEvent'));
  chartDynFunnel=echarts.init(document.getElementById('chartDynFunnel'));
  chartWeatherProvinceShare=echarts.init(document.getElementById('chartWeatherProvinceShare'));
  chartWeatherLevelByProvince=echarts.init(document.getElementById('chartWeatherLevelByProvince'));
  chartPlatformClaimTrend=echarts.init(document.getElementById('chartPlatformClaimTrend'));
  chartHotelTypeTrend=echarts.init(document.getElementById('chartHotelTypeTrend'));
  chartTrafficScaleTrend=echarts.init(document.getElementById('chartTrafficScaleTrend'));
  chartHotelScaleTrend=echarts.init(document.getElementById('chartHotelScaleTrend'));
  chartADRTrend=echarts.init(document.getElementById('chartADRTrend'));
  chartConsistencyTrend=echarts.init(document.getElementById('chartConsistencyTrend'));
  chartInconsistencyReasons=echarts.init(document.getElementById('chartInconsistencyReasons'));
  chartDynConsistencyTrend=echarts.init(document.getElementById('chartDynConsistencyTrend'));
  chartDynInconsistencyReasons=echarts.init(document.getElementById('chartDynInconsistencyReasons'));
  updateCharts()
}

function makeBarOption(title,series){return {grid:{left:40,right:16,top:36,bottom:36},tooltip:{trigger:'axis',formatter:function(params){return params[0].name+'<br/>'+params[0].seriesName+': '+params[0].value+'%'}},xAxis:{type:'category',data:series.categories,axisLabel:{interval:0}},yAxis:{type:'value',axisLabel:{formatter:'{value}%'}},series:[{name:title,type:'bar',data:series.values,itemStyle:{color:(params)=>{const colors=['#8ECFC9','#FFBE7A','#FA7F6F','#82B0D2','#BEB8DC','#E7DAD2','#999999'];return colors[params.dataIndex % colors.length]}},barMaxWidth:28,emphasis:{focus:'series'},label:{show:false},roundCap:true}]}}

function makeStrategyDistributionOption(title, data){
  return {
    grid: {
      left: 50,
      right: 20,
      top: 40,
      bottom: 40
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        if (Array.isArray(params)) {
          let result = params[0].name + '<br/>';
          params.forEach(param => {
            result += param.seriesName + ': ' + param.value + '%<br/>';
          });
          return result;
        } else {
          return params.name + '<br/>' + params.seriesName + ': ' + params.value + '%';
        }
      }
    },
    legend: {
      data: data.series ? data.series.map(s => s.name) : [title],
      top: 10,
      textStyle: {
        fontSize: 12
      }
    },
    xAxis: {
      type: 'category',
      data: data.categories,
      axisLabel: {
        interval: 0,
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 4.5,
      axisLabel: {
        formatter: '{value}%',
        fontSize: 11
      }
    },
    series: data.series || [{
      name: title,
      type: 'bar',
      data: data.values,
      itemStyle: {
        color: (params) => {
          const colors = ['#8ECFC9', '#FFBE7A', '#FA7F6F', '#82B0D2', '#BEB8DC', '#E7DAD2', '#999999'];
          return colors[params.dataIndex % colors.length];
        }
      },
      barMaxWidth: 25,
      emphasis: {
        focus: 'series'
      },
      label: {
        show: false
      }
    }]
  };
}

// 通用百分比分布图表配置函数
function makePercentageDistributionOption(title, data, yAxisMax = 100){
  return {
    grid: {
      left: 50,
      right: 20,
      top: 40,
      bottom: 40
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        if (Array.isArray(params)) {
          let result = params[0].name + '<br/>';
          params.forEach(param => {
            result += param.seriesName + ': ' + param.value + '%<br/>';
          });
          return result;
        } else {
          return params.name + '<br/>' + params.seriesName + ': ' + params.value + '%';
        }
      }
    },
    legend: {
      data: data.series ? data.series.map(s => s.name) : [title],
      top: 10,
      textStyle: {
        fontSize: 12
      }
    },
    xAxis: {
      type: 'category',
      data: data.categories,
      axisLabel: {
        interval: 0,
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: yAxisMax,
      axisLabel: {
        formatter: '{value}%',
        fontSize: 11
      }
    },
    series: data.series || [{
      name: title,
      type: 'bar',
      data: data.values,
      itemStyle: {
        color: (params) => {
          const colors = ['#8ECFC9', '#FFBE7A', '#FA7F6F', '#82B0D2', '#BEB8DC', '#E7DAD2', '#999999'];
          return colors[params.dataIndex % colors.length];
        }
      },
      barMaxWidth: 25,
      emphasis: {
        focus: 'series'
      },
      label: {
        show: false
      }
    }]
  };
}

function makeGroupedBarOption(title, data){
  return {
    tooltip: { 
      trigger: 'axis',
      formatter: function(params) {
        let result = params[0].name + '<br/>';
        params.forEach(param => {
          result += param.marker + param.seriesName + ': ' + param.value + '%<br/>';
        });
        return result;
      }
    },
    legend: { data: data.series.map(s => s.name), top: 10 },
    grid: { left: 40, right: 16, top: 60, bottom: 36 },
    xAxis: { type: 'category', data: data.categories, axisLabel: { interval: 0 } },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: data.series.map(s => ({
      ...s,
      barMaxWidth: 28,
      label: { show: false },
      roundCap: true
    }))
  };
}

function makeHotelStrategyBarOption(series){return {grid:{left:40,right:16,top:36,bottom:36},tooltip:{trigger:'axis',formatter:function(params){return params[0].name+'<br/>'+params[0].value+'%'}},xAxis:{type:'category',data:series.categories,axisLabel:{interval:0}},yAxis:{type:'value',axisLabel:{formatter:'{value}%'}},series:[{type:'bar',data:series.values.map((v,i)=>({value:v,itemStyle:{color:series.colors[i]}})),barMaxWidth:40,label:{show:false}}]}}

function makeHotelStrategyPieOption(series){return {tooltip:{trigger:'item',formatter:'{b}: {d}%'},legend:{bottom:8},series:[{type:'pie',radius:['50%','70%'],center:['50%','50%'],avoidLabelOverlap:true,itemStyle:{borderRadius:8,borderColor:'#fff',borderWidth:2},label:{show:true,formatter:'{d}%'},data:series.categories.map((n,i)=>({name:n,value:series.values[i],itemStyle:{color:series.colors[i]}}))}]}}

function makeSimpleBar(categories,values,color){return {grid:{left:40,right:16,top:36,bottom:36},tooltip:{trigger:'axis',formatter:function(params){return params[0].name+'<br/>'+params[0].value+'%'}},xAxis:{type:'category',data:categories,axisLabel:{interval:0}},yAxis:{type:'value',axisLabel:{formatter:'{value}%'}},series:[{type:'bar',data:values,barMaxWidth:36,itemStyle:{color},label:{show:false}}]}}

function makeFunnelOption(series){return {tooltip:{trigger:'item',formatter:'{b}: {c}%'},series:[{type:'funnel',left:'10%',top:20,bottom:20,width:'80%',min:0,max:100,sort:'descending',label:{show:true,formatter:'{b}  {c}%'},labelLine:{length:10,lineStyle:{width:1}},itemStyle:{borderColor:'#fff',borderWidth:1},data:series.stages.map((s,i)=>({name:s,value:series.values[i]}))}]}}

function randomBoxData(n){const arr=Array.from({length:n},()=>Number((Math.random()*1.4+0.4).toFixed(1)));arr.sort((a,b)=>a-b);return arr}

// 特征分布趋势数据生成函数
function generatePlatformClaimTrendData(){
  const dates = ['7/25', '7/26', '7/27', '7/28', '7/29', '7/30', '7/31'];
  const colors = ['#8ECFC9', '#FFBE7A'];
  const series = [
    {
      name: 'ROI阈值下间夜最大化',
      type: 'line',
      data: [60.2, 58.8, 59.5, 61.2, 60.8, 62.1, 60.3],
      itemStyle: { color: colors[0] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6
    },
    {
      name: '长期收益最大化',
      type: 'line',
      data: [39.8, 41.2, 40.5, 38.8, 39.2, 37.9, 39.7],
      itemStyle: { color: colors[1] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6
    }
  ];
  return { dates, series };
}

function generateHotelTypeTrendData(){
  const dates = ['7/25', '7/26', '7/27', '7/28', '7/29', '7/30', '7/31'];
  const colors = ['#8ECFC9', '#FFBE7A', '#FA7F6F', '#82B0D2'];
  const series = [
    {
      name: '单体酒店',
      type: 'line',
      data: [40.2, 38.5, 39.8, 41.2, 42.1, 43.0, 40.8],
      itemStyle: { color: colors[0] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6
    },
    {
      name: '民宿',
      type: 'line',
      data: [32.1, 33.8, 34.2, 35.5, 36.2, 37.0, 35.3],
      itemStyle: { color: colors[1] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6
    },
    {
      name: '特色住宿',
      type: 'line',
      data: [15.2, 15.8, 15.5, 14.8, 14.2, 13.5, 14.8],
      itemStyle: { color: colors[2] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6
    },
    {
      name: '集团酒店',
      type: 'line',
      data: [12.5, 11.9, 10.5, 8.5, 7.5, 6.5, 9.1],
      itemStyle: { color: colors[3] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6
    }
  ];
  return { dates, series };
}

function generateTrafficScaleTrendData(){
  const dates = ['7/25', '7/26', '7/27', '7/28', '7/29', '7/30', '7/31'];
  const colors = ['#8ECFC9', '#FFBE7A', '#FA7F6F', '#82B0D2'];
  const series = [
    {
      name: '低流量',
      type: 'line',
      data: [25.8, 25.2, 25.5, 25.8, 26.1, 25.9, 25.6],
      itemStyle: { color: colors[0] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6
    },
    {
      name: '高流量',
      type: 'line',
      data: [29.2, 30.5, 31.2, 32.0, 31.8, 31.5, 30.2],
      itemStyle: { color: colors[1] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6
    },
    {
      name: '中低流量',
      type: 'line',
      data: [22.8, 23.2, 22.5, 21.8, 21.2, 20.8, 22.1],
      itemStyle: { color: colors[2] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6
    },
    {
      name: '中高流量',
      type: 'line',
      data: [22.2, 21.1, 20.8, 20.4, 20.9, 21.8, 22.1],
      itemStyle: { color: colors[3] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6
    }
  ];
  return { dates, series };
}

function generateHotelScaleTrendData(){
  const dates = ['7/25', '7/26', '7/27', '7/28', '7/29', '7/30', '7/31'];
  const colors = ['#8ECFC9', '#FFBE7A', '#FA7F6F', '#82B0D2', '#BEB8DC'];
  const series = [
    {
      name: '1-30',
      type: 'line',
      data: [19.2, 19.8, 20.2, 20.8, 21.2, 21.5, 22.0],
      itemStyle: { color: colors[0] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6
    },
    {
      name: '31-70',
      type: 'line',
      data: [25.8, 26.2, 25.9, 26.1, 26.5, 26.8, 27.0],
      itemStyle: { color: colors[1] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6
    },
    {
      name: '71-120',
      type: 'line',
      data: [25.2, 25.5, 25.8, 26.0, 25.9, 26.2, 26.5],
      itemStyle: { color: colors[2] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6
    },
    {
      name: '121+',
      type: 'line',
      data: [29.8, 28.5, 28.1, 27.1, 26.4, 25.5, 24.5],
      itemStyle: { color: colors[3] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6
    }
  ];
  return { dates, series };
}

function generateADRTrendData(){
  const dates = ['7/25', '7/26', '7/27', '7/28', '7/29', '7/30', '7/31'];
  const colors = ['#8ECFC9', '#FFBE7A', '#FA7F6F', '#82B0D2', '#BEB8DC', '#E7DAD2', '#999999', '#4A90E2'];
  const series = [
    {
      name: '100-',
      type: 'line',
      data: [8.2, 8.5, 8.8, 9.1, 9.2, 9.0, 8.8],
      itemStyle: { color: colors[0] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6
    },
    {
      name: '100-200',
      type: 'line',
      data: [23.8, 24.2, 23.9, 24.1, 24.5, 24.8, 25.0],
      itemStyle: { color: colors[1] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6
    },
    {
      name: '200-300',
      type: 'line',
      data: [30.2, 30.5, 30.8, 31.0, 31.2, 31.5, 31.8],
      itemStyle: { color: colors[2] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6
    },
    {
      name: '300-400',
      type: 'line',
      data: [18.8, 18.5, 18.2, 17.9, 17.8, 17.5, 17.2],
      itemStyle: { color: colors[3] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6
    },
    {
      name: '400-600',
      type: 'line',
      data: [12.2, 12.0, 11.8, 11.5, 11.2, 11.0, 10.8],
      itemStyle: { color: colors[4] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6
    },
    {
      name: '600-1000',
      type: 'line',
      data: [4.8, 4.5, 4.2, 4.0, 3.8, 3.5, 3.2],
      itemStyle: { color: colors[5] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6
    },
    {
      name: '1000-1500',
      type: 'line',
      data: [1.5, 1.3, 1.2, 1.0, 0.9, 0.8, 0.7],
      itemStyle: { color: colors[6] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6
    },
    {
      name: '1500+',
      type: 'line',
      data: [0.5, 0.5, 0.9, 1.4, 1.4, 1.9, 2.5],
      itemStyle: { color: colors[7] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6
    }
  ];
  return { dates, series };
}

// 落地一致率趋势数据生成函数
function generateConsistencyTrendData(groupBy, groups) {
  const dates = ['7/25', '7/26', '7/27', '7/28', '7/29', '7/30', '7/31'];
  const colors = ['#8ECFC9', '#FFBE7A', '#FA7F6F', '#82B0D2', '#BEB8DC', '#E7DAD2', '#999999'];
  
  // 如果没有分组，使用默认的星级分组
  const displayGroups = groups && groups.length > 0 ? groups : ['高星', '中星', '低星'];
  
  const series = displayGroups.map((group, index) => {
    // 根据分组生成不同的数据模式
    let baseData;
    if (group === '高星' || group.includes('高') || group.includes('五星')) {
      baseData = [33.5, 22.1, 35.2, 24.3, 22.0, 22.4, 29.6];
    } else if (group === '中星' || group.includes('中') || group.includes('四星') || group.includes('三星')) {
      baseData = [33.6, 39.2, 37.4, 36.8, 39.3, 38.9, 28.0];
    } else if (group === '低星' || group.includes('低') || group.includes('二星') || group.includes('一星')) {
      baseData = [24.7, 30.5, 38.5, 35.9, 34.7, 26.3, 23.1];
    } else {
      // 其他分组的默认数据
      baseData = [28.0, 30.0, 32.0, 30.0, 28.0, 26.0, 24.0];
    }
    
    return {
      name: group,
      type: 'line',
      data: baseData,
      itemStyle: { color: colors[index % colors.length] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 2 }
    };
  });
  
  return { dates, series };
}

// 策略落地不一致归因数据生成函数
function generateInconsistencyReasonsData(groupBy, groups) {
  const colors = ['#FFBE7A', '#82B0D2', '#BEB8DC', '#8ECFC9'];
  const reasons = ['不可定价', '优惠黑名单', '命中beat上限', '命中佣金率下限'];
  
  // 如果没有分组，使用默认的星级分组
  const displayGroups = groups && groups.length > 0 ? groups : ['高星', '中星', '低星'];
  
  // 计算需要的行数
  const rowCount = Math.ceil(displayGroups.length / 3);
  
  const series = displayGroups.map((group, index) => {
    let reasonData;
    if (group === '高星' || group.includes('高') || group.includes('五星')) {
      reasonData = [10.6, 39.1, 2.1, 6.6];
    } else if (group === '中星' || group.includes('中') || group.includes('四星') || group.includes('三星')) {
      reasonData = [10.2, 37.3, 1.9, 8.0];
    } else if (group === '低星' || group.includes('低') || group.includes('二星') || group.includes('一星')) {
      reasonData = [9.7, 42.6, 1.7, 8.0];
    } else {
      // 其他分组的默认数据
      reasonData = [10.0, 38.0, 2.0, 7.0];
    }
    
    // 计算每行三个饼图的位置
    const row = Math.floor(index / 3);
    const col = index % 3;
    const centerX = 16.67 + (col * 33.33); // 16.67%, 50%, 83.33%
    
    // 根据总行数动态调整垂直位置，为下方标题留出空间
    let centerY;
    if (rowCount === 1) {
      centerY = 35; // 单行，为下方标题留空间
    } else if (rowCount === 2) {
      centerY = 18 + (row * 35); // 两行：18%, 53%
    } else {
      centerY = 12 + (row * 22); // 多行：12%, 34%, 56%
    }
    
    return {
      name: group,
      type: 'pie',
      radius: ['25%', '45%'],
      center: [`${centerX}%`, `${centerY}%`],
      data: reasons.map((reason, i) => ({
        name: reason,
        value: reasonData[i],
        itemStyle: { 
          color: colors[i],
          borderColor: '#fff',
          borderWidth: 2,
          shadowBlur: 5,
          shadowColor: 'rgba(0,0,0,0.1)'
        }
      })),
      label: {
        show: true,
        formatter: function(params) {
          return params.percent > 3 ? params.name + ': ' + params.percent + '%' : '';
        },
        fontSize: 11,
        fontWeight: 'bold',
        position: 'outside',
        color: '#374151'
      },
      labelLine: {
        show: true,
        length: 12,
        length2: 10,
        lineStyle: {
          color: '#d1d5db',
          width: 1
        }
      },
      // 添加分组标题在饼图下方
      title: {
        text: group,
        left: 'center',
        top: `${centerY + 25}%`,
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#1f2937',
          backgroundColor: 'rgba(255,255,255,0.8)',
          padding: [4, 8],
          borderRadius: 4,
          borderColor: '#e5e7eb',
          borderWidth: 1
        }
      }
    };
  });
  
  return { series, reasons, groups: displayGroups, rowCount };
}

// 动态定价落地一致率趋势数据生成函数
function generateDynConsistencyTrendData(groupBy, groups) {
  const dates = ['7/25', '7/26', '7/27', '7/28', '7/29', '7/30', '7/31'];
  const colors = ['#8ECFC9', '#FFBE7A', '#FA7F6F', '#82B0D2', '#BEB8DC', '#E7DAD2', '#999999'];
  
  // 如果没有分组，使用默认的星级分组
  const displayGroups = groups && groups.length > 0 ? groups : ['高星', '中星', '低星'];
  
  const series = displayGroups.map((group, index) => {
    // 根据分组生成不同的数据模式（动态定价的数据略有差异）
    let baseData;
    if (group === '高星' || group.includes('高') || group.includes('五星')) {
      baseData = [28.5, 18.1, 32.2, 21.3, 19.0, 19.4, 26.6];
    } else if (group === '中星' || group.includes('中') || group.includes('四星') || group.includes('三星')) {
      baseData = [30.6, 36.2, 34.4, 33.8, 36.3, 35.9, 25.0];
    } else if (group === '低星' || group.includes('低') || group.includes('二星') || group.includes('一星')) {
      baseData = [21.7, 27.5, 35.5, 32.9, 31.7, 23.3, 20.1];
    } else {
      // 其他分组的默认数据
      baseData = [25.0, 27.0, 29.0, 27.0, 25.0, 23.0, 21.0];
    }
    
    return {
      name: group,
      type: 'line',
      data: baseData,
      itemStyle: { color: colors[index % colors.length] },
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 2 }
    };
  });
  
  return { dates, series };
}

// 动态定价策略落地不一致归因数据生成函数
function generateDynInconsistencyReasonsData(groupBy, groups) {
  const colors = ['#FFBE7A', '#82B0D2', '#BEB8DC', '#8ECFC9'];
  const reasons = ['不可定价', '优惠黑名单', '命中beat上限', '命中佣金率下限'];
  
  // 如果没有分组，使用默认的星级分组
  const displayGroups = groups && groups.length > 0 ? groups : ['高星', '中星', '低星'];
  
  // 计算需要的行数
  const rowCount = Math.ceil(displayGroups.length / 3);
  
  const series = displayGroups.map((group, index) => {
    let reasonData;
    if (group === '高星' || group.includes('高') || group.includes('五星')) {
      reasonData = [12.6, 41.1, 1.8, 5.4];
    } else if (group === '中星' || group.includes('中') || group.includes('四星') || group.includes('三星')) {
      reasonData = [11.2, 38.3, 1.6, 7.8];
    } else if (group === '低星' || group.includes('低') || group.includes('二星') || group.includes('一星')) {
      reasonData = [10.7, 44.6, 1.4, 7.8];
    } else {
      // 其他分组的默认数据
      reasonData = [11.0, 40.0, 1.6, 6.8];
    }
    
    // 计算每行三个饼图的位置
    const row = Math.floor(index / 3);
    const col = index % 3;
    const centerX = 16.67 + (col * 33.33); // 16.67%, 50%, 83.33%
    
    // 根据总行数动态调整垂直位置，为下方标题留出空间
    let centerY;
    if (rowCount === 1) {
      centerY = 35; // 单行，为下方标题留空间
    } else if (rowCount === 2) {
      centerY = 18 + (row * 35); // 两行：18%, 53%
    } else {
      centerY = 12 + (row * 22); // 多行：12%, 34%, 56%
    }
    
    return {
      name: group,
      type: 'pie',
      radius: ['25%', '45%'],
      center: [`${centerX}%`, `${centerY}%`],
      data: reasons.map((reason, i) => ({
        name: reason,
        value: reasonData[i],
        itemStyle: { 
          color: colors[i],
          borderColor: '#fff',
          borderWidth: 2,
          shadowBlur: 5,
          shadowColor: 'rgba(0,0,0,0.1)'
        }
      })),
      label: {
        show: true,
        formatter: function(params) {
          return params.percent > 3 ? params.name + ': ' + params.percent + '%' : '';
        },
        fontSize: 11,
        fontWeight: 'bold',
        position: 'outside',
        color: '#374151'
      },
      labelLine: {
        show: true,
        length: 12,
        length2: 10,
        lineStyle: {
          color: '#d1d5db',
          width: 1
        }
      },
      // 添加分组标题在饼图下方
      title: {
        text: group,
        left: 'center',
        top: `${centerY + 25}%`,
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#1f2937',
          backgroundColor: 'rgba(255,255,255,0.8)',
          padding: [4, 8],
          borderRadius: 4,
          borderColor: '#e5e7eb',
          borderWidth: 1
        }
      }
    };
  });
  
  return { series, reasons, groups: displayGroups, rowCount };
}

// 动态定价落地一致率趋势图表选项函数
function makeDynConsistencyTrendOption(data) {
  return {
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        let result = params[0].name + '<br/>';
        params.forEach(param => {
          result += param.marker + param.seriesName + ': ' + param.value + '%<br/>';
        });
        return result;
      }
    },
    legend: {
      data: data.series.map(s => s.name),
      bottom: 8,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: 40,
      right: 16,
      top: 20,
      bottom: 50
    },
    xAxis: {
      type: 'category',
      data: data.dates,
      axisLabel: {
        interval: 0,
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%',
        fontSize: 11
      },
      min: 0,
      max: 60
    },
    series: data.series.map(series => ({
      ...series,
      emphasis: {
        focus: 'series'
      }
    }))
  };
}

// 动态定价策略落地不一致归因图表选项函数
function makeDynInconsistencyReasonsOption(data) {
  // 根据行数计算图表高度，为下方标题留出更多空间
  let calculatedHeight;
  if (data.rowCount === 1) {
    calculatedHeight = 400; // 单行，增加高度
  } else if (data.rowCount === 2) {
    calculatedHeight = 600; // 两行，增加高度
  } else {
    calculatedHeight = 400 + (data.rowCount - 1) * 200; // 多行，增加高度
  }
  
  // 动态调整图表容器高度
  const chartContainer = document.getElementById('chartDynInconsistencyReasons');
  if (chartContainer) {
    chartContainer.style.height = `${calculatedHeight}px`;
    // 重新初始化图表以适应新高度
    setTimeout(() => {
      if (window.chartDynInconsistencyReasons) {
        window.chartDynInconsistencyReasons.resize();
      }
    }, 100);
  }
  
  return {
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        return params.seriesName + '<br/>' + params.name + ': ' + params.value + '%';
      }
    },
    legend: {
      data: data.reasons,
      bottom: 15,
      textStyle: {
        fontSize: 12,
        fontWeight: 'bold'
      }
    },
    series: data.series
  };
}

// 折线图选项函数
function makeLineChartOption(title, data) {
  return {
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        let result = params[0].name + '<br/>';
        params.forEach(param => {
          result += param.marker + param.seriesName + ': ' + param.value + '%<br/>';
        });
        return result;
      }
    },
    legend: {
      data: data.series.map(s => s.name),
      bottom: 8,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: 40,
      right: 16,
      top: 20,
      bottom: 50
    },
    xAxis: {
      type: 'category',
      data: data.dates,
      axisLabel: {
        interval: 0,
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%',
        fontSize: 11
      }
    },
    series: data.series.map(series => ({
      ...series,
      lineStyle: {
        width: 2
      },
      emphasis: {
        focus: 'series'
      }
    }))
  };
}

// 落地一致率趋势图表选项函数
function makeConsistencyTrendOption(data) {
  return {
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        let result = params[0].name + '<br/>';
        params.forEach(param => {
          result += param.marker + param.seriesName + ': ' + param.value + '%<br/>';
        });
        return result;
      }
    },
    legend: {
      data: data.series.map(s => s.name),
      bottom: 8,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: 40,
      right: 16,
      top: 20,
      bottom: 50
    },
    xAxis: {
      type: 'category',
      data: data.dates,
      axisLabel: {
        interval: 0,
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%',
        fontSize: 11
      },
      min: 0,
      max: 60
    },
    series: data.series.map(series => ({
      ...series,
      emphasis: {
        focus: 'series'
      }
    }))
  };
}

// 策略落地不一致归因图表选项函数
function makeInconsistencyReasonsOption(data) {
  // 根据行数计算图表高度，为下方标题留出更多空间
  let calculatedHeight;
  if (data.rowCount === 1) {
    calculatedHeight = 400; // 单行，增加高度
  } else if (data.rowCount === 2) {
    calculatedHeight = 600; // 两行，增加高度
  } else {
    calculatedHeight = 400 + (data.rowCount - 1) * 200; // 多行，增加高度
  }
  
  // 动态调整图表容器高度
  const chartContainer = document.getElementById('chartInconsistencyReasons');
  if (chartContainer) {
    chartContainer.style.height = `${calculatedHeight}px`;
    // 重新初始化图表以适应新高度
    setTimeout(() => {
      if (window.chartInconsistencyReasons) {
        window.chartInconsistencyReasons.resize();
      }
    }, 100);
  }
  
  return {
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        return params.seriesName + '<br/>' + params.name + ': ' + params.value + '%';
      }
    },
    legend: {
      data: data.reasons,
      bottom: 15,
      textStyle: {
        fontSize: 12,
        fontWeight: 'bold'
      }
    },
    series: data.series
  };
}


function makeBoxplotOption(title,groups){const source=groups.map(()=>randomBoxData(30));const res=echarts.dataTool.prepareBoxplotData(source,{layout:'vertical'});return {tooltip:{trigger:'item'},grid:{left:40,right:16,top:36,bottom:36},xAxis:{type:'category',data:groups},yAxis:{type:'value'},series:[{name:title,type:'boxplot',data:res.boxData,itemStyle:{color:'#82B0D2'}},{name:'outlier',type:'scatter',data:res.outliers,itemStyle:{color:'#FA7F6F'}}]}}

function makeGroupedBoxplotOption(title, groups) {
  const colors = ['#8ECFC9', '#FFBE7A', '#FA7F6F', '#82B0D2', '#BEB8DC', '#E7DAD2', '#999999'];
  
  // 为每个分组生成箱形图数据，确保横坐标对应正确
  const boxplotData = groups.map(() => randomBoxData(30));
  const res = echarts.dataTool.prepareBoxplotData(boxplotData, { layout: 'vertical' });
  
  const series = [{
    name: title,
    type: 'boxplot',
    data: res.boxData,
    itemStyle: {
      color: '#82B0D2'
    }
  }];
  
  const outlierSeries = [{
    name: 'outlier',
    type: 'scatter',
    data: res.outliers,
    itemStyle: {
      color: '#FA7F6F'
    }
  }];
  
  return {
    tooltip: { 
      trigger: 'item',
      formatter: function(params) {
        if (params.seriesType === 'boxplot') {
          return params.name + '<br/>' + 
                 '最小值: ' + params.data[0] + '<br/>' +
                 '下四分位数: ' + params.data[1] + '<br/>' +
                 '中位数: ' + params.data[2] + '<br/>' +
                 '上四分位数: ' + params.data[3] + '<br/>' +
                 '最大值: ' + params.data[4];
        } else {
          return params.name + '<br/>异常值: ' + params.data[1];
        }
      }
    },
    grid: { left: 40, right: 16, top: 36, bottom: 36 },
    xAxis: { type: 'category', data: groups },
    yAxis: { type: 'value' },
    series: [...series, ...outlierSeries]
  };
}

function updateCharts(){
  updateChartsWithGrouping(currentGroupBy, currentGroups);
}

function updateChartsWithGrouping(groupBy, groups){
  // 如果没有分组或分组为空，使用整体显示
  const hasGrouping = groupBy && groups && groups.length > 0;
  
  // 人货场策略Beat分布
  if (hasGrouping && groups.length > 1) {
    const s1 = generateGroupedMockSeries(groupBy, groups);
    const s2 = generateGroupedMockSeries(groupBy, groups);
    chartProduct.setOption(makeGroupedBarOption('产品力', s1), true);
    chartThird.setOption(makeGroupedBarOption('收益策略', s2), true);
  } else {
    const s1 = generateMockSeries();
    const s2 = generateMockSeries();
    chartProduct.setOption(makeBarOption('产品力', s1), true);
    chartThird.setOption(makeBarOption('收益策略', s2), true);
  }

  // 酒店群策略分布
  if (hasGrouping && groups.length > 1) {
    const hs = generateGroupedHotelStrategyMock(groupBy, groups);
    chartHotelStrategyBar.setOption(makeGroupedBarOption('酒店群策略分布', hs), true);
    // 饼图保持原样
    const hsOriginal = generateHotelStrategyMock();
    chartHotelStrategyPie.setOption(makeHotelStrategyPieOption(hsOriginal), true);
  } else {
    const hs = generateHotelStrategyMock();
    chartHotelStrategyBar.setOption(makeHotelStrategyBarOption(hs), true);
    chartHotelStrategyPie.setOption(makeHotelStrategyPieOption(hs), true);
  }

  // 货定价策略 - 只影响Beat分布图表
  if (hasGrouping && groups.length > 1) {
    const pb = generateGroupedPricingBeatMock(groupBy, groups);
    chartPriceBeatAlgo.setOption(makeGroupedBarOption('货定价Beat分布（算法输出）', pb.algo), true);
    chartPriceBeatOrder.setOption(makeGroupedBarOption('货定价Beat分布', pb.order), true);
  } else {
    const pb = generatePricingBeatMock();
    chartPriceBeatAlgo.setOption(makeSimpleBar(pb.algo.categories, pb.algo.values, '#82B0D2'), true);
    chartPriceBeatOrder.setOption(makeSimpleBar(pb.order.categories, pb.order.values, '#8ECFC9'), true);
  }
  
  // 策略落地漏斗和货定价生效数据分析保持全局显示
  chartPriceFunnel.setOption(makeFunnelOption(generateFunnelMock()), true);
  const pe = generateEffectPieMock();
  chartPriceEffectPie.setOption({tooltip:{trigger:'item',formatter:'{b}: {d}%'},legend:{bottom:8},series:[{type:'pie',radius:['45%','70%'],itemStyle:{borderRadius:8,borderColor:'#fff',borderWidth:2},label:{show:true,formatter:'{d}%'},data:pe.labels.map((n,i)=>({name:n,value:pe.values[i],itemStyle:{color:pe.colors[i]}}))}]}, true);

  // 落地一致率趋势 - 支持全局分组
  const consistencyData = generateConsistencyTrendData(groupBy, groups);
  chartConsistencyTrend.setOption(makeConsistencyTrendOption(consistencyData), true);

  // 策略落地不一致归因 - 支持全局分组
  const inconsistencyData = generateInconsistencyReasonsData(groupBy, groups);
  chartInconsistencyReasons.setOption(makeInconsistencyReasonsOption(inconsistencyData), true);

  // 动态定价策略 - 策略间夜分布
  if (hasGrouping && groups.length > 1) {
    const strategyDist = generateGroupedStrategyDistributionMock(groupBy, groups);
    chartDynDist.setOption(makeStrategyDistributionOption('策略间夜分布', strategyDist), true);
  } else {
    const strategyDist = generateStrategyDistributionMock();
    chartDynDist.setOption(makeStrategyDistributionOption('策略间夜分布', strategyDist), true);
  }

  // 日常异常策略分布
  if (hasGrouping && groups.length > 1) {
    const dailyAbnormal = generateGroupedDailyAbnormalMock(groupBy, groups);
    chartDailyAbnormal.setOption(makePercentageDistributionOption('日常异常策略分布', dailyAbnormal, 100), true);
  } else {
    const dailyAbnormal = generateDailyAbnormalMock();
    chartDailyAbnormal.setOption(makePercentageDistributionOption('日常异常策略分布', dailyAbnormal, 100), true);
  }

  // 异常天气策略分布
  if (hasGrouping && groups.length > 1) {
    const weatherAbnormal = generateGroupedWeatherAbnormalMock(groupBy, groups);
    chartWeatherAbnormal.setOption(makePercentageDistributionOption('异常天气策略分布', weatherAbnormal, 100), true);
  } else {
    const weatherAbnormal = generateWeatherAbnormalMock();
    chartWeatherAbnormal.setOption(makePercentageDistributionOption('异常天气策略分布', weatherAbnormal, 100), true);
  }

  // 热点事件分布
  if (hasGrouping && groups.length > 1) {
    const hotEvent = generateGroupedHotEventMock(groupBy, groups);
    chartHotEvent.setOption(makePercentageDistributionOption('热点事件分布', hotEvent, 100), true);
  } else {
    const hotEvent = generateHotEventMock();
    chartHotEvent.setOption(makePercentageDistributionOption('热点事件分布', hotEvent, 100), true);
  }

  const dyn={stages:['动态算法输出','可定价','可beat','动态定价生效'],values:[12,10,5,4]};
  chartDynFunnel.setOption(makeFunnelOption(dyn),true);

  // 动态定价落地一致率趋势 - 支持全局分组
  const dynConsistencyData = generateDynConsistencyTrendData(groupBy, groups);
  chartDynConsistencyTrend.setOption(makeDynConsistencyTrendOption(dynConsistencyData), true);

  // 动态定价策略落地不一致归因 - 支持全局分组
  const dynInconsistencyData = generateDynInconsistencyReasonsData(groupBy, groups);
  chartDynInconsistencyReasons.setOption(makeDynInconsistencyReasonsOption(dynInconsistencyData), true);

  fillCOCCTable();
  updateWeatherViews();
  fillHotEvents();

  // 策略影响因子
  renderGroupCharts(groupBy, groups)
  
  // 特征分布趋势 - 固定数据，不受全局分组影响
  const platformClaimData = generatePlatformClaimTrendData();
  chartPlatformClaimTrend.setOption(makeLineChartOption('平台主张分布', platformClaimData), true);
  
  const hotelTypeData = generateHotelTypeTrendData();
  chartHotelTypeTrend.setOption(makeLineChartOption('酒店类型分布', hotelTypeData), true);
  
  const trafficScaleData = generateTrafficScaleTrendData();
  chartTrafficScaleTrend.setOption(makeLineChartOption('流量规模分布', trafficScaleData), true);
  
  const hotelScaleData = generateHotelScaleTrendData();
  chartHotelScaleTrend.setOption(makeLineChartOption('酒店规模分布', hotelScaleData), true);
  
  const adrData = generateADRTrendData();
  chartADRTrend.setOption(makeLineChartOption('ADR分布', adrData), true);
}

// 生成未来30天流量趋势数据
function generateTrafficTrendData() {
  const dates = [];
  const values = [];
  const threshold = 100;
  
  // 生成30天的日期
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
    
    // 生成流量数据，在某个日期出现异常峰值
    let value = 80 + Math.random() * 20; // 基础流量80-100
    if (i === 2) { // 第3天出现异常
      value = 150 + Math.random() * 30; // 异常峰值150-180
    }
    values.push(Math.round(value));
  }
  
  return { dates, values, threshold };
}

// 生成未来90天COCC趋势数据
function generateCOCCTrendData() {
  const dates = [];
  const values = [];
  
  // 生成90天的日期
  for (let i = 0; i < 90; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
    
    // 生成COCC数据，在特定日期出现峰值
    let value = 50 + Math.random() * 20; // 基础COCC 50-70%
    if (i >= 6 && i <= 8) { // 第7-9天出现峰值
      value = 80 + Math.random() * 15; // 峰值80-95%
    } else if (i >= 12 && i <= 14) { // 第13-15天出现峰值
      value = 75 + Math.random() * 20; // 峰值75-95%
    }
    values.push(Math.round(value));
  }
  
  return { dates, values };
}

// 生成未来90天COCC斜率数据
function generateCOCCSlopeData() {
  const dates = [];
  const slope1 = []; // 2025/08/05-2025/08/07
  const slope2 = []; // 2025/08/11-2025/08/13
  
  // 生成90天的日期
  for (let i = 0; i < 90; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
    
    // 生成斜率数据
    let s1 = Math.random() * 10 - 5; // -5到5的随机斜率
    let s2 = Math.random() * 10 - 5;
    
    // 在特定日期出现峰值
    if (i === 6) { // 第7天
      s1 = 8 + Math.random() * 4; // 峰值8-12
    } else if (i === 12) { // 第13天
      s2 = 7 + Math.random() * 3; // 峰值7-10
    }
    
    slope1.push(Number(s1.toFixed(1)));
    slope2.push(Number(s2.toFixed(1)));
  }
  
  return { dates, slope1, slope2 };
}

function fillCOCCTable(){
  const tbody = document.querySelector('#tableCOCC tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  mockCOCCTable().forEach((r, index) => {
    const tr = document.createElement('tr');
    
    // 添加原有列
    ['province', 'city', 'biz', 'stay', 'strategy', 'traffic', 'threshold', 'night', 'revenue'].forEach(k => {
      const td = document.createElement('td');
      td.textContent = r[k];
      tr.appendChild(td);
    });
    
    // 添加三个图表列
    const chartData = {
      trafficTrend: generateTrafficTrendData(),
      coccTrend: generateCOCCTrendData(),
      coccSlope: generateCOCCSlopeData()
    };
    
    // 未来30天流量趋势
    const td1 = document.createElement('td');
    const chartDiv1 = document.createElement('div');
    chartDiv1.className = 'table-chart';
    chartDiv1.dataset.chartType = 'trafficTrend';
    chartDiv1.dataset.chartData = JSON.stringify(chartData.trafficTrend);
    chartDiv1.dataset.rowIndex = index;
    td1.appendChild(chartDiv1);
    tr.appendChild(td1);
    
    // 未来90天COCC趋势
    const td2 = document.createElement('td');
    const chartDiv2 = document.createElement('div');
    chartDiv2.className = 'table-chart';
    chartDiv2.dataset.chartType = 'coccTrend';
    chartDiv2.dataset.chartData = JSON.stringify(chartData.coccTrend);
    chartDiv2.dataset.rowIndex = index;
    td2.appendChild(chartDiv2);
    tr.appendChild(td2);
    
    // 未来90天COCC斜率
    const td3 = document.createElement('td');
    const chartDiv3 = document.createElement('div');
    chartDiv3.className = 'table-chart';
    chartDiv3.dataset.chartType = 'coccSlope';
    chartDiv3.dataset.chartData = JSON.stringify(chartData.coccSlope);
    chartDiv3.dataset.rowIndex = index;
    td3.appendChild(chartDiv3);
    tr.appendChild(td3);
    
    tbody.appendChild(tr);
  });
  
  // 初始化小型图表
  initializeTableCharts();
}

// 初始化表格中的小型图表
function initializeTableCharts() {
  const chartElements = document.querySelectorAll('.table-chart');
  chartElements.forEach(element => {
    const chartType = element.dataset.chartType;
    const chartData = JSON.parse(element.dataset.chartData);
    
    // 创建小型ECharts实例
    const chart = echarts.init(element);
    
    let option;
    switch (chartType) {
      case 'trafficTrend':
        option = {
          grid: { left: 5, right: 5, top: 5, bottom: 5 },
          xAxis: { type: 'category', data: chartData.dates, show: false },
          yAxis: { type: 'value', show: false },
          series: [{
            type: 'line',
            data: chartData.values,
            smooth: true,
            symbol: 'circle',
            symbolSize: 2,
            lineStyle: { width: 1.5, color: '#8ECFC9' },
            itemStyle: { color: '#8ECFC9' },
            areaStyle: { color: 'rgba(142, 207, 201, 0.1)' }
          }]
        };
        break;
        
      case 'coccTrend':
        option = {
          grid: { left: 5, right: 5, top: 5, bottom: 5 },
          xAxis: { type: 'category', data: chartData.dates, show: false },
          yAxis: { type: 'value', min: 0, max: 100, show: false },
          series: [{
            type: 'line',
            data: chartData.values,
            smooth: true,
            symbol: 'circle',
            symbolSize: 2,
            lineStyle: { width: 1.5, color: '#82B0D2' },
            itemStyle: { color: '#82B0D2' },
            areaStyle: { color: 'rgba(130, 176, 210, 0.1)' }
          }]
        };
        break;
        
      case 'coccSlope':
        option = {
          grid: { left: 5, right: 5, top: 5, bottom: 5 },
          legend: { show: false },
          xAxis: { type: 'category', data: chartData.dates, show: false },
          yAxis: { type: 'value', show: false },
          series: [
            {
              name: '2025/08/05-2025/08/07',
              type: 'line',
              data: chartData.slope1,
              smooth: true,
              symbol: 'circle',
              symbolSize: 2,
              lineStyle: { width: 1.5, color: '#BEB8DC' },
              itemStyle: { color: '#BEB8DC' }
            },
            {
              name: '2025/08/11-2025/08/13',
              type: 'line',
              data: chartData.slope2,
              smooth: true,
              symbol: 'circle',
              symbolSize: 2,
              lineStyle: { width: 1.5, color: '#FFBE7A' },
              itemStyle: { color: '#FFBE7A' }
            }
          ]
        };
        break;
    }
    
    chart.setOption(option);
    
    // 添加鼠标事件
    element.addEventListener('mouseenter', (e) => {
      showChartTooltip(e, chartType, chartData);
    });
    
    element.addEventListener('mouseleave', () => {
      hideChartTooltip();
    });
    
    element.addEventListener('mousemove', (e) => {
      updateTooltipPosition(e);
    });
  });
}

// 显示图表浮层
function showChartTooltip(event, chartType, chartData) {
  const tooltip = document.getElementById('chartTooltip');
  const title = document.getElementById('chartTooltipTitle');
  const container = document.getElementById('chartTooltipContainer');
  
  // 设置标题
  const titles = {
    'trafficTrend': '未来30天流量趋势',
    'coccTrend': '未来90天COCC趋势',
    'coccSlope': '未来90天COCC斜率'
  };
  title.textContent = titles[chartType];
  
  // 创建放大版图表
  const chart = echarts.init(container);
  let option;
  
  switch (chartType) {
    case 'trafficTrend':
      option = {
        grid: { left: 40, right: 20, top: 20, bottom: 40 },
        tooltip: { trigger: 'axis' },
        xAxis: { 
          type: 'category', 
          data: chartData.dates,
          axisLabel: { fontSize: 10 }
        },
        yAxis: { 
          type: 'value',
          axisLabel: { formatter: '{value}' }
        },
        series: [{
          name: '流量',
          type: 'line',
          data: chartData.values,
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: { width: 2, color: '#8ECFC9' },
          itemStyle: { color: '#8ECFC9' },
          areaStyle: { color: 'rgba(142, 207, 201, 0.2)' },
          markLine: {
            data: [{
              yAxis: chartData.threshold,
              lineStyle: { color: '#FA7F6F', type: 'dashed' },
              label: { formatter: '异常阀值' }
            }]
          }
        }]
      };
      break;
      
    case 'coccTrend':
      option = {
        grid: { left: 40, right: 20, top: 20, bottom: 40 },
        tooltip: { trigger: 'axis' },
        xAxis: { 
          type: 'category', 
          data: chartData.dates,
          axisLabel: { fontSize: 10 }
        },
        yAxis: { 
          type: 'value', 
          min: 0, 
          max: 100,
          axisLabel: { formatter: '{value}%' }
        },
        series: [{
          name: 'COCC',
          type: 'line',
          data: chartData.values,
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: { width: 2, color: '#82B0D2' },
          itemStyle: { color: '#82B0D2' },
          areaStyle: { color: 'rgba(130, 176, 210, 0.2)' }
        }]
      };
      break;
      
    case 'coccSlope':
      option = {
        grid: { left: 40, right: 20, top: 20, bottom: 40 },
        legend: { top: 0, fontSize: 12 },
        tooltip: { trigger: 'axis' },
        xAxis: { 
          type: 'category', 
          data: chartData.dates,
          axisLabel: { fontSize: 10 }
        },
        yAxis: { 
          type: 'value',
          axisLabel: { formatter: '{value}' }
        },
        series: [
          {
            name: '2025/08/05-2025/08/07',
            type: 'line',
            data: chartData.slope1,
            smooth: true,
            symbol: 'circle',
            symbolSize: 4,
            lineStyle: { width: 2, color: '#BEB8DC' },
            itemStyle: { color: '#BEB8DC' }
          },
          {
            name: '2025/08/11-2025/08/13',
            type: 'line',
            data: chartData.slope2,
            smooth: true,
            symbol: 'circle',
            symbolSize: 4,
            lineStyle: { width: 2, color: '#FFBE7A' },
            itemStyle: { color: '#FFBE7A' }
          }
        ]
      };
      break;
  }
  
  chart.setOption(option);
  
  // 显示浮层
  tooltip.classList.add('show');
  updateTooltipPosition(event);
}

// 隐藏图表浮层
function hideChartTooltip() {
  const tooltip = document.getElementById('chartTooltip');
  tooltip.classList.remove('show');
}

// 更新浮层位置
function updateTooltipPosition(event) {
  const tooltip = document.getElementById('chartTooltip');
  const rect = tooltip.getBoundingClientRect();
  const x = event.clientX + 10;
  const y = event.clientY - rect.height - 10;
  
  // 确保浮层不超出视窗
  const finalX = x + rect.width > window.innerWidth ? event.clientX - rect.width - 10 : x;
  const finalY = y < 0 ? event.clientY + 10 : y;
  
  tooltip.style.left = finalX + 'px';
  tooltip.style.top = finalY + 'px';
}

// 热点日历看板功能
let currentCalendarDate = new Date(2025, 8, 1); // 2025年9月

// 生成热点事件数据
function generateHotEventsData() {
  const events = [
    {
      name: '2025年国家公务员考试',
      date: '2025-09-01',
      endDate: '2025-09-03',
      type: 'exam',
      description: '入离：2025/09/01-2025/09/03'
    },
    {
      name: '周杰伦演唱会',
      date: '2025-09-05',
      endDate: '2025-09-07',
      type: 'concert',
      description: '入离：2025/09/05-2025/09/07'
    },
    // 9月11日的6个事件
    {
      name: '2025年注册会计师考试',
      date: '2025-09-11',
      endDate: '2025-09-13',
      type: 'exam',
      description: '入离：2025/09/11-2025/09/13'
    },
    {
      name: '张学友演唱会',
      date: '2025-09-11',
      endDate: '2025-09-11',
      type: 'concert',
      description: '入离：2025/09/11-2025/09/11'
    },
    {
      name: '中超联赛第25轮',
      date: '2025-09-11',
      endDate: '2025-09-11',
      type: 'sports',
      description: '入离：2025/09/11-2025/09/11'
    },
    {
      name: '中秋节庆祝活动',
      date: '2025-09-11',
      endDate: '2025-09-13',
      type: 'festival',
      description: '入离：2025/09/11-2025/09/13'
    },
    {
      name: '2025年司法考试',
      date: '2025-09-11',
      endDate: '2025-09-12',
      type: 'exam',
      description: '入离：2025/09/11-2025/09/12'
    },
    {
      name: '国际音乐节',
      date: '2025-09-11',
      endDate: '2025-09-15',
      type: 'festival',
      description: '入离：2025/09/11-2025/09/15'
    },
    {
      name: '中超联赛第25轮',
      date: '2025-09-08',
      endDate: '2025-09-08',
      type: 'sports',
      description: '入离：2025/09/08-2025/09/08'
    },
    {
      name: '2025年广东省公务员考试',
      date: '2025-09-10',
      endDate: '2025-09-12',
      type: 'exam',
      description: '入离：2025/09/10-2025/09/12'
    },
    {
      name: '邓紫棋演唱会',
      date: '2025-09-15',
      endDate: '2025-09-17',
      type: 'concert',
      description: '入离：2025/09/15-2025/09/17'
    },
    {
      name: 'CBA总决赛',
      date: '2025-09-18',
      endDate: '2025-09-20',
      type: 'sports',
      description: '入离：2025/09/18-2025/09/20'
    },
    {
      name: '2025年江苏省公务员考试',
      date: '2025-09-22',
      endDate: '2025-09-24',
      type: 'exam',
      description: '入离：2025/09/22-2025/09/24'
    },
    {
      name: '薛之谦演唱会',
      date: '2025-09-25',
      endDate: '2025-09-27',
      type: 'concert',
      description: '入离：2025/09/25-2025/09/27'
    },
    {
      name: '中超联赛第26轮',
      date: '2025-09-28',
      endDate: '2025-09-28',
      type: 'sports',
      description: '入离：2025/09/28-2025/09/28'
    },
    {
      name: '中秋节音乐节',
      date: '2025-09-30',
      endDate: '2025-10-02',
      type: 'festival',
      description: '入离：2025/09/30-2025/10/02'
    },
    {
      name: '2025年浙江省公务员考试',
      date: '2025-10-05',
      endDate: '2025-10-07',
      type: 'exam',
      description: '入离：2025/10/05-2025/10/07'
    },
    {
      name: '林俊杰演唱会',
      date: '2025-10-08',
      endDate: '2025-10-10',
      type: 'concert',
      description: '入离：2025/10/08-2025/10/10'
    },
    {
      name: 'NBA中国赛',
      date: '2025-10-12',
      endDate: '2025-10-14',
      type: 'sports',
      description: '入离：2025/10/12-2025/10/14'
    },
    {
      name: '2025年上海市公务员考试',
      date: '2025-10-15',
      endDate: '2025-10-17',
      type: 'exam',
      description: '入离：2025/10/15-2025/10/17'
    },
    {
      name: '陈奕迅演唱会',
      date: '2025-10-18',
      endDate: '2025-10-20',
      type: 'concert',
      description: '入离：2025/10/18-2025/10/20'
    },
    {
      name: '中超联赛第27轮',
      date: '2025-10-22',
      endDate: '2025-10-22',
      type: 'sports',
      description: '入离：2025/10/22-2025/10/22'
    },
    {
      name: '2025年北京市公务员考试',
      date: '2025-10-25',
      endDate: '2025-10-27',
      type: 'exam',
      description: '入离：2025/10/25-2025/10/27'
    },
    {
      name: '张杰演唱会',
      date: '2025-10-28',
      endDate: '2025-10-30',
      type: 'concert',
      description: '入离：2025/10/28-2025/10/30'
    }
  ];
  
  return events;
}

// 初始化日历
function initHotEventsCalendar() {
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');
  const monthDisplay = document.getElementById('currentMonth');
  
  if (prevBtn) prevBtn.addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendar();
  });
  
  if (nextBtn) nextBtn.addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendar();
  });
  
  // 添加点击其他地方隐藏完整数据浮层的功能
  document.addEventListener('click', (e) => {
    const fullDataTooltip = document.getElementById('fullDataTooltip');
    if (fullDataTooltip && !fullDataTooltip.contains(e.target) && !e.target.closest('.calendar-day')) {
      hideFullDataTooltip();
    }
  });
  
  renderCalendar();
}

// 渲染日历
function renderCalendar() {
  const calendarGrid = document.getElementById('calendarGrid');
  const monthDisplay = document.getElementById('currentMonth');
  
  if (!calendarGrid || !monthDisplay) return;
  
  // 更新月份显示
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  monthDisplay.textContent = `${year}年${month + 1}月`;
  
  // 清空日历
  calendarGrid.innerHTML = '';
  
  // 获取当月第一天和最后一天
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = (firstDay.getDay() + 6) % 7; // 转换为周一开始
  
  // 获取热点事件数据
  const events = generateHotEventsData();
  
  // 生成日历格子
  const totalDays = lastDay.getDate();
  const totalCells = Math.ceil((firstDayOfWeek + totalDays) / 7) * 7;
  
  for (let i = 0; i < totalCells; i++) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';
    
    const dayNumber = i - firstDayOfWeek + 1;
    
    if (dayNumber < 1 || dayNumber > totalDays) {
      // 其他月份的日期
      dayDiv.classList.add('other-month');
      const otherMonthDay = dayNumber < 1 ? 
        new Date(year, month, dayNumber).getDate() : 
        dayNumber - totalDays;
      dayDiv.innerHTML = `
        <div class="day-number">${otherMonthDay}</div>
      `;
    } else {
      // 当前月份的日期
      const currentDate = new Date(year, month, dayNumber);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
      
      // 检查是否是今天
      const today = new Date();
      const isToday = currentDate.toDateString() === today.toDateString();
      
      // 检查是否是节假日
      const isHoliday = isWeekend(currentDate) || isPublicHoliday(currentDate);
      
      dayDiv.innerHTML = `
        <div class="day-number ${isToday ? 'today' : ''} ${isHoliday ? 'holiday' : ''}">
          ${dayNumber}
        </div>
        <div class="day-events">
          ${renderDayEvents(dateStr, events)}
        </div>
      `;
      
      if (isToday) {
        dayDiv.classList.add('today');
      }
      
      // 为日历格子添加事件监听器
      const dayEvents = events.filter(event => {
        const eventDate = event.date;
        const eventEndDate = event.endDate;
        return dateStr >= eventDate && dateStr <= eventEndDate;
      });
      
      if (dayEvents.length > 0) {
        dayDiv.setAttribute('data-has-events', 'true');
        
        dayDiv.addEventListener('mouseenter', (e) => {
          showEventsTooltip(e, dateStr, dayEvents);
        });
        
        dayDiv.addEventListener('mouseleave', () => {
          hideEventsTooltip();
        });
        
        // 双击显示完整数据浮层
        dayDiv.addEventListener('dblclick', (e) => {
          showFullDataTooltip(e, dateStr, dayEvents);
        });
        
        // 为"还有X项"添加点击事件
        setTimeout(() => {
          const moreEventsElement = dayDiv.querySelector('.more-events');
          if (moreEventsElement) {
            moreEventsElement.addEventListener('click', (e) => {
              e.stopPropagation();
              showFullDataTooltip(e, dateStr, dayEvents);
            });
          }
        }, 0);
      }
    }
    
    calendarGrid.appendChild(dayDiv);
  }
}

// 渲染单日事件
function renderDayEvents(dateStr, events) {
  const dayEvents = events.filter(event => {
    const eventDate = event.date;
    const eventEndDate = event.endDate;
    return dateStr >= eventDate && dateStr <= eventEndDate;
  });
  
  if (dayEvents.length === 0) return '';
  
  // 根据事件数量调整显示策略
  let html = '';
  
  if (dayEvents.length <= 3) {
    // 3个或更少事件，全部显示
    dayEvents.forEach(event => {
      const eventDisplayName = `${event.name}<br/>${event.description}`;
      html += `<div class="event-item ${event.type}" title="${event.description}">${eventDisplayName}</div>`;
    });
  } else {
    // 4个或更多事件，显示前3个，其余显示"还有X项"
    const displayEvents = dayEvents.slice(0, 3);
    const remainingCount = dayEvents.length - 3;
    
    displayEvents.forEach(event => {
      const eventDisplayName = `${event.name}<br/>${event.description}`;
      html += `<div class="event-item ${event.type}" title="${event.description}">${eventDisplayName}</div>`;
    });
    
    html += `<div class="more-events" data-date="${dateStr}" data-events='${JSON.stringify(dayEvents)}'>还有${remainingCount}项</div>`;
  }
  
  return html;
}

// 判断是否是周末
function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6; // 周日或周六
}

// 判断是否是公共节假日
function isPublicHoliday(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // 简化的节假日判断（实际应用中需要更完整的节假日数据）
  const holidays = [
    '09-01', // 开学日
    '09-03', // 抗战胜利纪念日
    '09-10', // 教师节
    '10-01', // 国庆节
    '10-02', // 国庆节
    '10-03', // 国庆节
    '10-04', // 国庆节
    '10-05', // 国庆节
    '10-06', // 国庆节
    '10-07'  // 国庆节
  ];
  
  const dateStr = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return holidays.includes(dateStr);
}

// 显示事件浮层
function showEventsTooltip(event, dateStr, dayEvents) {
  const tooltip = document.getElementById('eventsTooltip');
  const title = document.getElementById('eventsTooltipTitle');
  const content = document.getElementById('eventsTooltipContent');
  
  if (!tooltip || !title || !content) return;
  
  // 设置标题
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  title.textContent = `${month}月${day}日 热点事件`;
  
  // 设置内容
  content.innerHTML = '';
  dayEvents.forEach(eventItem => {
    const eventDiv = document.createElement('div');
    eventDiv.className = `tooltip-event-item ${eventItem.type}`;
    eventDiv.innerHTML = `
      <div class="event-name">${eventItem.name}</div>
      <div class="event-details">${eventItem.description}</div>
    `;
    content.appendChild(eventDiv);
  });
  
  // 将浮层移动到当前日历格子旁边
  const calendarDay = event.currentTarget;
  calendarDay.appendChild(tooltip);
  
  // 显示浮层
  tooltip.classList.add('show');
}

// 隐藏事件浮层
function hideEventsTooltip() {
  const tooltip = document.getElementById('eventsTooltip');
  if (tooltip) {
    tooltip.classList.remove('show');
    // 将浮层移回原位置
    const originalContainer = document.querySelector('.hot-events-calendar');
    if (originalContainer && tooltip.parentNode !== originalContainer) {
      originalContainer.appendChild(tooltip);
    }
  }
}


// 显示完整数据浮层
function showFullDataTooltip(event, dateStr, dayEvents) {
  const tooltip = document.getElementById('fullDataTooltip');
  const title = document.getElementById('fullDataTooltipTitle');
  const content = document.getElementById('fullDataTooltipContent');
  
  if (!tooltip || !title || !content) return;
  
  // 设置标题
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekday = weekdays[date.getDay()];
  title.textContent = `${month}月${day}日 ${weekday} - 完整事件数据 (${dayEvents.length}项)`;
  
  // 设置内容
  content.innerHTML = '';
  dayEvents.forEach((eventItem, index) => {
    const eventDiv = document.createElement('div');
    eventDiv.className = `full-data-event-item ${eventItem.type}`;
    
    // 获取事件类型的中文名称
    const typeNames = {
      'exam': '考试',
      'concert': '演唱会',
      'sports': '体育赛事',
      'festival': '节日庆典',
      'normal': '其他活动'
    };
    
    eventDiv.innerHTML = `
      <div class="full-data-event-name">${index + 1}. ${eventItem.name}</div>
      <div class="full-data-event-details">${eventItem.description}</div>
      <div class="full-data-event-type">类型：${typeNames[eventItem.type] || '其他'}</div>
    `;
    content.appendChild(eventDiv);
  });
  
  // 将浮层移动到当前日历格子旁边
  const calendarDay = event.currentTarget;
  calendarDay.appendChild(tooltip);
  
  // 显示浮层
  tooltip.classList.add('show');
}

// 隐藏完整数据浮层
function hideFullDataTooltip() {
  const tooltip = document.getElementById('fullDataTooltip');
  if (tooltip) {
    tooltip.classList.remove('show');
    // 将浮层移回原位置
    const originalContainer = document.querySelector('.hot-events-calendar');
    if (originalContainer && tooltip.parentNode !== originalContainer) {
      originalContainer.appendChild(tooltip);
    }
  }
}


function fillHotEvents(){const tbody=document.querySelector('#tableHotEvents tbody');if(!tbody) return;tbody.innerHTML='';mockHotEvents().forEach(r=>{const tr=document.createElement('tr');['name','level','province','city','stay','strategy','night','status'].forEach(k=>{const td=document.createElement('td');td.textContent=r[k];tr.appendChild(td)});tbody.appendChild(tr)})}

function updateWeatherViews(){fillWeatherTable();const dt=document.getElementById('weatherDate').value;const data=mockWeatherByDate(dt);const counts={red:0,orange:0,yellow:0,blue:0};const provinceShareMap={};const levelByProvince={};data.forEach(r=>{const level=r.level; if(level==='红色') counts.red++; else if(level==='橙色') counts.orange++; else if(level==='黄色') counts.yellow++; else if(level==='蓝色') counts.blue++; const prov=r.province; provinceShareMap[prov]=(provinceShareMap[prov]||0)+parseFloat(r.night); if(!levelByProvince[prov]) levelByProvince[prov]={红色:0,橙色:0,黄色:0,蓝色:0}; levelByProvince[prov][level]=(levelByProvince[prov][level]||0)+1});
  document.getElementById('kpiRed').textContent=counts.red;document.getElementById('kpiOrange').textContent=counts.orange;document.getElementById('kpiYellow').textContent=counts.yellow;document.getElementById('kpiBlue').textContent=counts.blue;
  const provCats=Object.keys(provinceShareMap);const provVals=provCats.map(k=>provinceShareMap[k]);chartWeatherProvinceShare.setOption({grid:{left:40,right:16,top:20,bottom:36},tooltip:{trigger:'axis'},xAxis:{type:'category',data:provCats},yAxis:{type:'value',axisLabel:{formatter:'{value}%'}},series:[{type:'bar',data:provVals,itemStyle:{color:'#82B0D2'},barMaxWidth:36,label:{show:true,position:'top',formatter:(p)=>p.value+'%'}}]},true);
  // Generate grouped bar data: for each province, create 4 bars with values between 5 and 30 (deterministic by date)
  const provs=provCats.length?provCats:Object.keys(levelByProvince);let seed=new Date(dt||Date.now()).getDate();function rand(a,b){seed=(seed*9301+49297)%233280;const r=seed/233280;return Math.floor(r*(b-a+1))+a}
  const seriesColors={蓝色:'#82B0D2',黄色:'#FFBE7A',橙色:'#FA7F6F',红色:'#BEB8DC'};const levels=['红色','橙色','黄色','蓝色'];
  const grouped=levels.map(lv=>({name:lv,type:'bar',itemStyle:{color:seriesColors[lv]},barGap:'20%',barCategoryGap:'35%',data:provs.map(()=>rand(5,30)),label:{show:true,position:'top'}}));
  chartWeatherLevelByProvince.setOption({legend:{data:levels,top:0},grid:{left:40,right:16,top:30,bottom:36},tooltip:{trigger:'axis'},xAxis:{type:'category',data:provs,axisLabel:{interval:0}},yAxis:{type:'value'},series:grouped},true)
}

function fillWeatherTable(){const tbody=document.querySelector('#tableWeather tbody');if(!tbody) return;tbody.innerHTML='';const dt=document.getElementById('weatherDate')?document.getElementById('weatherDate').value:'';mockWeatherByDate(dt).forEach(r=>{const tr=document.createElement('tr');['province','city','type','level','beat','night','revenue'].forEach(k=>{const td=document.createElement('td');td.textContent=r[k];tr.appendChild(td)});tbody.appendChild(tr)})}

function getLimitedInputsFrom(value){const raw=(value||'').trim();if(!raw) return [];const arr=raw.split(';').map(s=>s.trim()).filter(Boolean);return arr.slice(0,10)}

function getGroupsForDimension(dimension) {
  const groupMap = {
    'star': ['五星', '四星', '三星', '二星', '一星'],
    'starType': ['豪华型', '商务型', '经济型', '度假型'],
    'adr': ['0-200', '200-400', '400-600', '600-800', '800-1000', '1000-1500', '1500+'],
    'listingLevel': ['A级', 'B级', 'C级', 'D级'],
    'earlyBooking': ['是', '否'],
    'continuousStay': ['是', '否'],
    'newOldGuest': ['新客', '老客'],
    'c365User': ['是', '否'],
    'cityLevel': ['一线', '新一线', '二线', '三线', '四线', '五线', '其他'],
    'platformAdvocacy': ['是', '否'],
    'hotelType': ['商务酒店', '度假酒店', '经济酒店', '豪华酒店'],
    'trafficScale': ['超高量', '高量', '中量', '低量'],
    'hotelScale': ['超大型', '大型', '中型', '小型']
  };
  return groupMap[dimension] || [];
}

function generateGroupedTargetData(groupBy, groups) {
  // 横坐标使用全局分组维度的value值
  const categories = groups;
  const colors = ['#8ECFC9', '#FFBE7A', '#FA7F6F', '#82B0D2', '#BEB8DC', '#E7DAD2', '#999999'];
  
  const series = [{
    name: '定价目标',
    type: 'bar',
    data: groups.map(() => Math.round(Math.random() * 100 * 10) / 10),
    itemStyle: {
      color: '#8ECFC9'
    }
  }];
  
  return { categories, series };
}

function generateGroupedElasticData(groupBy, groups) {
  // 横坐标使用全局分组维度的value值
  const categories = groups;
  const colors = ['#8ECFC9', '#FFBE7A', '#FA7F6F', '#82B0D2', '#BEB8DC', '#E7DAD2', '#999999'];
  
  const series = [{
    name: '价格弹性',
    type: 'bar',
    data: groups.map(() => Math.round(Math.random() * 20 * 10) / 10),
    itemStyle: {
      color: '#FFBE7A'
    }
  }];
  
  return { categories, series };
}

function renderGroupCharts(groupBy, groups){
  // 如果没有分组或分组为空，使用星级作为默认分组
  if (!groupBy || !groups || groups.length === 0) {
    const defaultGroups = ['五星', '四星', '三星', '二星', '一星'];
    chartTargetBar.setOption(makeSimpleBar(defaultGroups, [62.1, 36.4, 47.3, 28.9, 15.2], '#8ECFC9'), true);
    chartElasticBar.setOption(makeSimpleBar(defaultGroups, [4.7, 7.9, 9.9, 12.3, 15.6], '#FFBE7A'), true);
    chartQCBox.setOption(makeGroupedBoxplotOption('Q/C市占', defaultGroups), true);
    chartCEQMBox.setOption(makeGroupedBoxplotOption('CEQ/M市占', defaultGroups), true);
    return;
  }

  // 使用全局分组数据
  const targetData = generateGroupedTargetData(groupBy, groups);
  const elasticData = generateGroupedElasticData(groupBy, groups);
  
  chartTargetBar.setOption(makeSimpleBar(targetData.categories, targetData.series[0].data, '#8ECFC9'), true);
  chartElasticBar.setOption(makeSimpleBar(elasticData.categories, elasticData.series[0].data, '#FFBE7A'), true);
  chartQCBox.setOption(makeGroupedBoxplotOption('Q/C市占', groups), true);
  chartCEQMBox.setOption(makeGroupedBoxplotOption('CEQ/M市占', groups), true);
}

function attachEvents(){document.getElementById('filters').addEventListener('submit',function(e){e.preventDefault();document.getElementById('province').value=buildTextRule('provinceOp','provinceInput');document.getElementById('city').value=buildTextRule('cityOp','cityInput');document.getElementById('biz').value=buildTextRule('bizOp','bizInput');const _=collectFilters();console.log('apply filters',_);updateChartsWithGrouping(currentGroupBy, currentGroups)});document.getElementById('resetBtn').addEventListener('click',function(){Array.from(document.querySelectorAll('#filters .multi-select')).forEach(ms=>{ms.querySelectorAll('input[type="checkbox"]').forEach(i=>i.checked=true);const evt=new Event('change',{bubbles:true});ms.querySelector('.multi-list').dispatchEvent(evt)});['provinceInput','cityInput','bizInput'].forEach(id=>{const el=document.getElementById(id);if(el) el.value='' });pendingCustomGroups=[];setDefaultRegionRules();setDefaultDates();currentGroupBy='';currentGroups=[];document.getElementById('groupBy').value='';document.getElementById('groupCustomWrapper').style.display='none';updateChartsWithGrouping(currentGroupBy, currentGroups)});
  const groupBy=document.getElementById('groupBy');const wrap=document.getElementById('groupCustomWrapper');const label=document.getElementById('groupCustomLabel');const input=document.getElementById('groupCustomInput');const apply=document.getElementById('groupApplyBtn');
  function refreshCustomVisibility(){const v=groupBy.value;if(['province','city','biz'].includes(v)){wrap.style.display='block';label.textContent=(v==='province'?'省份':'city'===v?'城市':'商圈')+'（分号分隔，最多20个）';input.placeholder=v==='province'?'示例：上海;北京;江苏':v==='city'?'示例：上海;南京;苏州':'示例：北京-苏州街;上海-外滩；';pendingCustomGroups=[];}else{wrap.style.display='none';pendingCustomGroups=[];updateGlobalGrouping(v)}}
  groupBy.addEventListener('change',refreshCustomVisibility);
  apply.addEventListener('click',()=>{pendingCustomGroups=getLimitedInputsFrom(input.value);updateGlobalGrouping(groupBy.value)});
  
  function updateGlobalGrouping(groupByValue) {
    currentGroupBy = groupByValue;
    if (groupByValue === '') {
      // 整体分组
      currentGroups = [];
    } else if (['province','city','biz'].includes(groupByValue)) {
      // 手动输入分组
      currentGroups = pendingCustomGroups.length > 0 ? pendingCustomGroups : [];
    } else {
      // 可选项分组
      currentGroups = getGroupsForDimension(groupByValue);
    }
    updateChartsWithGrouping(currentGroupBy, currentGroups);
  }
  const weatherDate=document.getElementById('weatherDate');if(weatherDate){weatherDate.addEventListener('change',updateWeatherViews)}
  document.addEventListener('click',e=>{const btn=e.target.closest('.sub-actions .ghost');if(btn){const t=btn.dataset.chart;alert((t==='product'?'产品力':'收益策略')+' 的分日期数据（mock）')}});window.addEventListener('resize',()=>{[chartProduct,chartThird,chartHotelStrategyBar,chartHotelStrategyPie,chartPriceBeatAlgo,chartPriceBeatOrder,chartPriceFunnel,chartPriceEffectPie,chartTargetBar,chartElasticBar,chartQCBox,chartCEQMBox,chartDynDist,chartDailyAbnormal,chartWeatherAbnormal,chartHotEvent,chartDynFunnel,chartWeatherProvinceShare,chartWeatherLevelByProvince].forEach(c=>c&&c.resize())});
  refreshCustomVisibility();
  
  // Sidebar functionality
  initSidebar();
  
  // 初始化热点日历看板
  initHotEventsCalendar();
}

function initSidebar(){
  const modernNav = document.getElementById('modernNav');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
  
  // Mobile menu toggle
  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains('show');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }
  
  function openMobileMenu() {
    mobileMenu.classList.add('show');
    mobileToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeMobileMenu() {
    mobileMenu.classList.remove('show');
    mobileToggle.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Event listeners
  mobileToggle.addEventListener('click', toggleMobileMenu);
  
  // Close mobile menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('show')) {
      closeMobileMenu();
    }
  });
  
  // Smooth scroll to sections
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Remove active class from all items
        navItems.forEach(nav => nav.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');
        
        // Smooth scroll to target
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Close mobile menu after navigation
        if (window.innerWidth < 1024) {
          closeMobileMenu();
        }
      }
    });
  });
  
  // Update active nav item based on scroll position
  function updateActiveNavItem() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navItems.forEach(nav => nav.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[href="#${sectionId}"], .mobile-nav-item[href="#${sectionId}"]`);
        if (activeNav) {
          activeNav.classList.add('active');
        }
      }
    });
  }
  
  // Navbar scroll effect
  function handleNavbarScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      modernNav.classList.add('scrolled');
    } else {
      modernNav.classList.remove('scrolled');
    }
  }
  
  // Throttled scroll listener
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    handleNavbarScroll();
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateActiveNavItem, 10);
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      closeMobileMenu();
    }
  });
  
  // Set initial active item
  updateActiveNavItem();
}

function enhanceSelectToMulti(selectEl){const wrapper=document.createElement('div');wrapper.className='multi-select';const trigger=document.createElement('button');trigger.type='button';trigger.className='multi-trigger';trigger.textContent='选择（0）';const panel=document.createElement('div');panel.className='multi-panel';const actions=document.createElement('div');actions.className='multi-actions';const btnAll=document.createElement('button');btnAll.type='button';btnAll.textContent='全选';const btnClear=document.createElement('button');btnClear.type='button';btnClear.textContent='清空';btnClear.className='is-plain';actions.appendChild(btnAll);actions.appendChild(btnClear);const list=document.createElement('ul');list.className='multi-list';
  const options=[...selectEl.querySelectorAll('option')].filter(o=>o.value!=='');
  options.forEach(opt=>{const li=document.createElement('li');const label=document.createElement('label');const cb=document.createElement('input');cb.type='checkbox';cb.value=opt.value;cb.dataset.text=opt.textContent||opt.value;label.appendChild(cb);label.appendChild(document.createTextNode(' '+(opt.textContent||opt.value)));li.appendChild(label);list.appendChild(li)});
  panel.appendChild(actions);panel.appendChild(list);wrapper.appendChild(trigger);wrapper.appendChild(panel);
  const hidden=document.createElement('input');hidden.type='hidden';hidden.id=selectEl.id;hidden.name=selectEl.name||selectEl.id;selectEl.after(hidden);selectEl.style.display='none';selectEl.parentElement.insertBefore(wrapper,hidden);
  function update(){const checkboxes=[...list.querySelectorAll('input[type="checkbox"]')];const checked=checkboxes.filter(i=>i.checked);const values=checked.map(i=>i.value);const texts=checked.map(i=>i.dataset.text);let labelText='选择（0）';if(checked.length===checkboxes.length){labelText='全部'}else if(checked.length>0){labelText=texts.join('; ')};trigger.textContent=labelText;hidden.value=values.join(',')}
  function selectAll(){list.querySelectorAll('input[type="checkbox"]').forEach(i=>i.checked=true);update()}
  trigger.addEventListener('click',()=>{wrapper.classList.toggle('open')});
  btnAll.addEventListener('click',selectAll);
  btnClear.addEventListener('click',()=>{list.querySelectorAll('input[type="checkbox"]').forEach(i=>i.checked=false);update()});
  list.addEventListener('change',update);
  document.addEventListener('click',e=>{if(!wrapper.contains(e.target)) wrapper.classList.remove('open')});
  selectAll()
}

function enhanceAllMultis(){document.querySelectorAll('select.js-multi').forEach(enhanceSelectToMulti)}

function fixTableHeaders(){
  // 强制设置所有表格表头为固定
  const tableHeaders = document.querySelectorAll('.table-scroll .data-table thead th');
  tableHeaders.forEach(th => {
    th.style.position = 'sticky';
    th.style.top = '0';
    th.style.zIndex = '999';
    th.style.backgroundColor = '#f8fafc';
    th.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    th.style.borderBottom = '2px solid #e5e7eb';
  });
}

window.addEventListener('DOMContentLoaded',()=>{setDefaultDates();setDefaultRegionRules();initCharts();enhanceAllMultis();attachEvents();fixTableHeaders()}) 