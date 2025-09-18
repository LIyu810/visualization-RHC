/**
 * 收益经营看板应用脚本
 * Revenue Management Dashboard Application Script
 * 文件: revenue-management-app.js
 * 描述: 收益经营看板的完整功能实现
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- CHART INSTANCE VARIABLES ---
    let chartNightQCTrend, chartRevenueQCTrend, chartTrafficQCTrend,
        chartConversionQCTrend, chartCommissionGapTrend, chartPriceAdvantageTrend,
        chartGapQ, chartGapC, chartGapQvsC, chartDistribution;
    
    // 额外的图表实例
    let chartAdditionalTrend1, chartAdditionalTrend2, chartAdditionalTrend3,
        chartAdditionalTrend4, chartAdditionalTrend5, chartAdditionalTrend6;

    // --- STATE MANAGEMENT ---
    let currentGroupBy = '';
    let currentGroups = [];
    let currentDistributionType = 'traffic';
    let coreMetricsExpanded = false;
    let metricTrendsExpanded = false;

    // --- MOCK DATA GENERATION ---

    const CORE_METRICS_DATA = [
        { title: '间夜', value: '125.6万', wow: 5.2, yoy: 12.8 },
        { title: '收益', value: '1580万', wow: -3.8, yoy: 18.5 },
        { title: '间夜QC', value: '64.8%', wow: -1.2, yoy: 2.5 },
        { title: '收益QC', value: '34.7%', wow: -0.8, yoy: 1.9 },
        { title: '佣金率GAP', value: '2.4%', wow: 0.1, yoy: -0.3 },
        { title: '流量QC', value: '42.8%', wow: 2.1, yoy: 5.6 },
        // 额外的6个核心指标
        { title: '转化QC', value: '148.9%', wow: -2.3, yoy: 8.7 },
        { title: '底价优势率', value: '0.38%', wow: -0.02, yoy: 0.05 },
        { title: '有效BEAT率', value: '69.2%', wow: 1.5, yoy: 3.8 },
        { title: '过度BEAT率', value: '28.6%', wow: -1.8, yoy: 2.1 },
        { title: '平均ADR', value: '¥285', wow: 3.2, yoy: 8.9 },
        { title: 'RevPAR', value: '¥185', wow: 2.8, yoy: 7.4 },
        { title: '入住率', value: '78.5%', wow: -1.5, yoy: 4.2 },
        { title: '平均停留时长', value: '2.3天', wow: 0.2, yoy: 0.8 },
        { title: '新客占比', value: '45.2%', wow: 2.1, yoy: 6.7 },
        { title: '复购率', value: '32.8%', wow: -0.9, yoy: 3.1 },
    ];

    function generateDateRange(days = 31) {
        return Array.from({ length: days }, (_, i) => `7/${i + 1}`);
    }

    function generateTrendData(base, volatility, groups) {
        const dates = generateDateRange();
        const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'];
        return {
            dates,
            series: groups.map((group, i) => {
                let current = base + (Math.random() - 0.5) * base * 0.2;
                const data = dates.map(() => {
                    current += (Math.random() - 0.5) * volatility;
                    return parseFloat(current.toFixed(1));
                });
                return {
                    name: group,
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    data: data,
                    itemStyle: { color: colors[i % colors.length] }
                };
            })
        };
    }

    function generateGapData() {
        return {
            q: {
                categories: ['收益空间', '商促补贴', '定价补贴', '平促补贴', '第三方补贴', '佣金率'],
                values: [48.5, -24.2, -12.5, -7.8, -3.2, 5.8]
            },
            c: {
                categories: ['收益空间', '商促补贴', '定价补贴', '平促补贴', '佣金率'],
                values: [49.8, -25.1, -12.9, -8.1, 9.2]
            },
            q_vs_c: {
                categories: ['收益空间', '商促补贴', '定价补贴', '平促补贴', '佣金率'],
                values: [2.0, 4.1, 4.8, 4.9, 4.1]
            }
        };
    }
    
    function generateDistributionData(type, groups) {
        const dates = generateDateRange(31);
        const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'];
        let base = type === 'traffic' ? 100 : (type === 'nights' ? 120 : 150);

        return {
            dates,
            series: groups.map((group, i) => {
                return {
                    name: group,
                    type: 'bar',
                    stack: 'total',
                    emphasis: { focus: 'series' },
                    itemStyle: { color: colors[i % colors.length] },
                    data: dates.map(() => Math.round(Math.random() * base / groups.length))
                };
            })
        };
    }

    // --- ECHARTS OPTIONS ---

    function makeTrendOption(title, data) {
        return {
            tooltip: { trigger: 'axis' },
            legend: { data: data.series.map(s => s.name), bottom: 0 },
            grid: { left: '3%', right: '4%', bottom: '12%', containLabel: true },
            xAxis: { type: 'category', boundaryGap: false, data: data.dates },
            yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
            series: data.series
        };
    }
    
    function makeWaterfallOption(title, data) {
        const baseData = [];
        const valueData = [];
        let total = 0;
        
        data.values.forEach((val, i) => {
            if (i > 0 && val < 0) {
                total += val;
                baseData.push(total);
                valueData.push(-val);
            } else {
                baseData.push(total);
                valueData.push(val);
                total += val;
            }
        });
        
        return {
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: { type: 'category', data: data.categories, axisLabel: { interval: 0, rotate: 30 } },
            yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
            series: [
                {
                    type: 'bar',
                    stack: 'total',
                    itemStyle: { borderColor: 'transparent', color: 'transparent' },
                    emphasis: { itemStyle: { borderColor: 'transparent', color: 'transparent' } },
                    data: baseData
                },
                {
                    name: title,
                    type: 'bar',
                    stack: 'total',
                    label: { show: true, position: 'top', formatter: '{c}%' },
                    itemStyle: {
                        color: (params) => (params.value > 0 ? '#c23531' : '#2f4554')
                    },
                    data: data.values
                }
            ]
        };
    }
    
    function makeQvsCOption(data) {
        return {
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: { type: 'category', data: data.categories, axisLabel: { interval: 0, rotate: 30 } },
            yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
            series: [{
                type: 'bar',
                barMaxWidth: 40,
                label: { show: true, position: 'top', formatter: '{c}%' },
                data: data.values,
                itemStyle: { color: '#61a0a8' }
            }]
        }
    }

    function makeDistributionOption(data) {
        return {
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            legend: { data: data.series.map(s => s.name), bottom: 0 },
            grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
            xAxis: { type: 'category', data: data.dates },
            yAxis: { type: 'value' },
            series: data.series
        };
    }

    // --- UI & CHART RENDERING ---

    function renderCoreMetrics() {
        const grid = document.querySelector('#coreMetricsGrid');
        const displayData = coreMetricsExpanded ? CORE_METRICS_DATA : CORE_METRICS_DATA.slice(0, 10);
        
        grid.innerHTML = displayData.map(metric => `
            <div class="metric-card">
                <div class="metric-title">${metric.title}</div>
                <div class="metric-value">${metric.value}</div>
                <div class="metric-changes">
                    <div class="metric-change ${metric.wow >= 0 ? 'positive' : 'negative'}">
                        <span>WOW: </span>
                        <span>${metric.wow > 0 ? '+' : ''}${metric.wow}%</span>
                    </div>
                    <div class="metric-change ${metric.yoy >= 0 ? 'positive' : 'negative'}">
                        <span>YOY: </span>
                        <span>${metric.yoy > 0 ? '+' : ''}${metric.yoy}%</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        // 更新按钮文本
        const moreBtn = document.getElementById('moreCoreMetrics');
        if (moreBtn) {
            moreBtn.querySelector('.btn-text').textContent = coreMetricsExpanded ? '收起' : '更多';
        }
    }

    function initCharts() {
        chartNightQCTrend = echarts.init(document.getElementById('chartNightQCTrend'));
        chartRevenueQCTrend = echarts.init(document.getElementById('chartRevenueQCTrend'));
        chartTrafficQCTrend = echarts.init(document.getElementById('chartTrafficQCTrend'));
        chartConversionQCTrend = echarts.init(document.getElementById('chartConversionQCTrend'));
        chartCommissionGapTrend = echarts.init(document.getElementById('chartCommissionGapTrend'));
        chartPriceAdvantageTrend = echarts.init(document.getElementById('chartPriceAdvantageTrend'));
        chartGapQ = echarts.init(document.getElementById('chartGapQ'));
        chartGapC = echarts.init(document.getElementById('chartGapC'));
        chartGapQvsC = echarts.init(document.getElementById('chartGapQvsC'));
        chartDistribution = echarts.init(document.getElementById('chartDistribution'));

        window.addEventListener('resize', () => {
            [chartNightQCTrend, chartRevenueQCTrend, chartTrafficQCTrend, chartConversionQCTrend,
            chartCommissionGapTrend, chartPriceAdvantageTrend, chartGapQ, chartGapC, chartGapQvsC, 
            chartDistribution, chartAdditionalTrend1, chartAdditionalTrend2, chartAdditionalTrend3,
            chartAdditionalTrend4, chartAdditionalTrend5, chartAdditionalTrend6].forEach(chart => chart && chart.resize());
        });
    }

    function initAdditionalCharts() {
        if (chartAdditionalTrend1) chartAdditionalTrend1.dispose();
        if (chartAdditionalTrend2) chartAdditionalTrend2.dispose();
        if (chartAdditionalTrend3) chartAdditionalTrend3.dispose();
        if (chartAdditionalTrend4) chartAdditionalTrend4.dispose();
        if (chartAdditionalTrend5) chartAdditionalTrend5.dispose();
        if (chartAdditionalTrend6) chartAdditionalTrend6.dispose();

        chartAdditionalTrend1 = echarts.init(document.getElementById('chartAdditionalTrend1'));
        chartAdditionalTrend2 = echarts.init(document.getElementById('chartAdditionalTrend2'));
        chartAdditionalTrend3 = echarts.init(document.getElementById('chartAdditionalTrend3'));
        chartAdditionalTrend4 = echarts.init(document.getElementById('chartAdditionalTrend4'));
        chartAdditionalTrend5 = echarts.init(document.getElementById('chartAdditionalTrend5'));
        chartAdditionalTrend6 = echarts.init(document.getElementById('chartAdditionalTrend6'));
    }

    function renderAdditionalTrends() {
        const expandedGrid = document.getElementById('metricTrendsExpanded');
        const groups = currentGroups.length > 0 ? currentGroups : ['高星', '中星', '低星'];
        
        expandedGrid.innerHTML = `
            <div class="subcard"><div class="subcard-title">平均ADR趋势</div><div id="chartAdditionalTrend1" class="chart"></div></div>
            <div class="subcard"><div class="subcard-title">RevPAR趋势</div><div id="chartAdditionalTrend2" class="chart"></div></div>
            <div class="subcard"><div class="subcard-title">入住率趋势</div><div id="chartAdditionalTrend3" class="chart"></div></div>
            <div class="subcard"><div class="subcard-title">平均停留时长趋势</div><div id="chartAdditionalTrend4" class="chart"></div></div>
            <div class="subcard"><div class="subcard-title">新客占比趋势</div><div id="chartAdditionalTrend5" class="chart"></div></div>
            <div class="subcard"><div class="subcard-title">复购率趋势</div><div id="chartAdditionalTrend6" class="chart"></div></div>
        `;
        
        initAdditionalCharts();
        
        // 设置额外的图表数据
        chartAdditionalTrend1.setOption(makeTrendOption('平均ADR趋势', generateTrendData(285, 5, groups)));
        chartAdditionalTrend2.setOption(makeTrendOption('RevPAR趋势', generateTrendData(185, 3, groups)));
        chartAdditionalTrend3.setOption(makeTrendOption('入住率趋势', generateTrendData(78, 2, groups)));
        chartAdditionalTrend4.setOption(makeTrendOption('平均停留时长趋势', generateTrendData(2.3, 0.1, groups)));
        chartAdditionalTrend5.setOption(makeTrendOption('新客占比趋势', generateTrendData(45, 1.5, groups)));
        chartAdditionalTrend6.setOption(makeTrendOption('复购率趋势', generateTrendData(33, 1, groups)));
    }
    
    function updateCharts() {
        const groups = currentGroups.length > 0 ? currentGroups : ['高星', '中星', '低星'];

        // Metric Trends
        chartNightQCTrend.setOption(makeTrendOption('间夜QC趋势', generateTrendData(65, 1.5, groups)));
        chartRevenueQCTrend.setOption(makeTrendOption('收益QC趋势', generateTrendData(35, 1, groups)));
        chartTrafficQCTrend.setOption(makeTrendOption('流量QC趋势', generateTrendData(43, 2, groups)));
        chartConversionQCTrend.setOption(makeTrendOption('转化QC趋势', generateTrendData(150, 5, groups)));
        chartCommissionGapTrend.setOption(makeTrendOption('佣金率GAP趋势', generateTrendData(2.5, 0.2, groups)));
        chartPriceAdvantageTrend.setOption(makeTrendOption('底价优势率趋势', generateTrendData(0.4, 0.05, groups)));

        // Additional Trends (if expanded)
        if (metricTrendsExpanded && chartAdditionalTrend1) {
            chartAdditionalTrend1.setOption(makeTrendOption('平均ADR趋势', generateTrendData(285, 5, groups)));
            chartAdditionalTrend2.setOption(makeTrendOption('RevPAR趋势', generateTrendData(185, 3, groups)));
            chartAdditionalTrend3.setOption(makeTrendOption('入住率趋势', generateTrendData(78, 2, groups)));
            chartAdditionalTrend4.setOption(makeTrendOption('平均停留时长趋势', generateTrendData(2.3, 0.1, groups)));
            chartAdditionalTrend5.setOption(makeTrendOption('新客占比趋势', generateTrendData(45, 1.5, groups)));
            chartAdditionalTrend6.setOption(makeTrendOption('复购率趋势', generateTrendData(33, 1, groups)));
        }

        // GAP Analysis
        const gapData = generateGapData();
        chartGapQ.setOption(makeWaterfallOption('Q', gapData.q));
        chartGapC.setOption(makeWaterfallOption('C', gapData.c));
        chartGapQvsC.setOption(makeQvsCOption(gapData.q_vs_c));

        // Distribution
        updateDistributionChart();
    }

    function updateDistributionChart() {
        const groups = currentGroups.length > 0 ? currentGroups : ['高星', '中星', '低星'];
        const distData = generateDistributionData(currentDistributionType, groups);
        chartDistribution.setOption(makeDistributionOption(distData));
    }


    // --- HELPERS & EVENT LISTENERS ---

    function formatDate(date){ const y=date.getFullYear(), m=String(date.getMonth()+1).padStart(2,'0'), d=String(date.getDate()).padStart(2,'0'); return `${y}-${m}-${d}` }
    function setDefaultDates(){ const end=new Date(); const start=new Date(); start.setDate(end.getDate()-14); document.getElementById('startDate').value=formatDate(start); document.getElementById('endDate').value=formatDate(end); }
    function validateTextFilter(opId, inputId) {
        const op = document.getElementById(opId).value;
        const input = document.getElementById(inputId);
        const raw = (input.value || '').trim();
        const values = raw ? raw.split(';').map(s => s.trim()).filter(Boolean) : [];
        
        // 清除之前的验证样式
        input.style.borderColor = '';
        input.style.backgroundColor = '';
        
        // 验证逻辑
        if (op === '==' && values.length > 1) {
            input.style.borderColor = '#f59e0b';
            input.style.backgroundColor = '#fef3c7';
            input.title = '等于操作只能输入一个值，将使用第一个值';
        } else if ((op === 'in' || op === 'contains' || op === 'not_contains') && values.length === 0) {
            input.style.borderColor = '#ef4444';
            input.style.backgroundColor = '#fee2e2';
            input.title = '此操作需要输入至少一个值';
        } else {
            input.title = '';
        }
        
        return values.length > 0;
    }
    
    function buildTextRule(opId, inputId) {
        const op = document.getElementById(opId).value;
        const raw = (document.getElementById(inputId).value || '').trim();
        const values = raw ? raw.split(';').map(s => s.trim()).filter(Boolean) : [];
        
        // 根据不同的操作符处理值
        let processedValues = values;
        if (op === '==' && values.length > 1) {
            // 对于==操作，只取第一个值
            processedValues = [values[0]];
        }
        
        return JSON.stringify({ op, values: processedValues });
    }
    function enhanceSelectToMulti(selectEl){
        const wrapper=document.createElement('div');wrapper.className='multi-select';
        const trigger=document.createElement('button');trigger.type='button';trigger.className='multi-trigger';trigger.textContent='选择（0）';
        const panel=document.createElement('div');panel.className='multi-panel';
        const actions=document.createElement('div');actions.className='multi-actions';
        const btnAll=document.createElement('button');btnAll.type='button';btnAll.textContent='全选';
        const btnClear=document.createElement('button');btnClear.type='button';btnClear.textContent='清空';btnClear.className='is-plain';
        actions.appendChild(btnAll);actions.appendChild(btnClear);
        const list=document.createElement('ul');list.className='multi-list';
        const options=[...selectEl.querySelectorAll('option')].filter(o=>o.value!=='');
        options.forEach(opt=>{const li=document.createElement('li');const label=document.createElement('label');const cb=document.createElement('input');cb.type='checkbox';cb.value=opt.value;cb.dataset.text=opt.textContent||opt.value;label.appendChild(cb);label.appendChild(document.createTextNode(' '+(opt.textContent||opt.value)));li.appendChild(label);list.appendChild(li)});
        panel.appendChild(actions);panel.appendChild(list);wrapper.appendChild(trigger);wrapper.appendChild(panel);
        const hidden=document.createElement('input');hidden.type='hidden';hidden.id=selectEl.id;hidden.name=selectEl.name||selectEl.id;
        selectEl.after(hidden);selectEl.style.display='none';selectEl.parentElement.insertBefore(wrapper,hidden);
        function update(){
            const checked=[...list.querySelectorAll('input:checked')];
            trigger.textContent = checked.length === options.length ? '全部' : (checked.length > 0 ? checked.map(i=>i.dataset.text).join('; ') : '选择（0）');
            hidden.value=checked.map(i=>i.value).join(',');
        }
        function selectAll(state = true) { list.querySelectorAll('input').forEach(i=>i.checked=state); update(); }
        trigger.addEventListener('click',()=>wrapper.classList.toggle('open'));
        btnAll.addEventListener('click',()=>selectAll(true));
        btnClear.addEventListener('click',()=>selectAll(false));
        list.addEventListener('change',update);
        document.addEventListener('click',e=>{if(!wrapper.contains(e.target)) wrapper.classList.remove('open')});
        selectAll();
    }
    
    function attachEvents() {
        document.getElementById('filters').addEventListener('submit', e => {
            e.preventDefault();
            // This is where you would collect filter data and re-fetch/re-render
            updateCharts();
        });
        document.getElementById('resetBtn').addEventListener('click', () => {
            document.getElementById('filters').reset();
             document.querySelectorAll('select.js-multi').forEach(el => {
                const hiddenInput = document.getElementById(el.id);
                if(hiddenInput) {
                    const multiSelectWrapper = hiddenInput.previousElementSibling;
                    multiSelectWrapper.querySelector('.multi-list').querySelectorAll('input').forEach(i=>i.checked=true);
                    multiSelectWrapper.querySelector('.multi-trigger').textContent = '全部';
                    hiddenInput.value = [...el.options].filter(o=>o.value).map(o=>o.value).join(',');
                }
            });
            setDefaultDates();
        });

        // Global Grouping Logic
        const groupBySelect = document.getElementById('groupBy');
        const groupCustomWrapper = document.getElementById('groupCustomWrapper');
        const groupCustomInput = document.getElementById('groupCustomInput');
        
        groupBySelect.addEventListener('change', () => {
            const selectedGroup = groupBySelect.value;
            if (['province', 'city', 'biz'].includes(selectedGroup)) {
                groupCustomWrapper.style.display = 'block';
            } else {
                groupCustomWrapper.style.display = 'none';
                updateGlobalGrouping(selectedGroup, []);
            }
        });
        
        document.getElementById('groupApplyBtn').addEventListener('click', () => {
            const selectedGroup = groupBySelect.value;
            const customGroups = groupCustomInput.value.split(';').map(s => s.trim()).filter(Boolean);
            updateGlobalGrouping(selectedGroup, customGroups);
        });
        
        // Distribution Tabs Logic
        document.querySelectorAll('.dist-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.dist-tab-btn.active').classList.remove('active');
                btn.classList.add('active');
                currentDistributionType = btn.dataset.type;
                updateDistributionChart();
            });
        });

        // Core Metrics More Button
        document.getElementById('moreCoreMetrics').addEventListener('click', () => {
            coreMetricsExpanded = !coreMetricsExpanded;
            renderCoreMetrics();
        });

        // Metric Trends More Button
        document.getElementById('moreMetricTrends').addEventListener('click', () => {
            metricTrendsExpanded = !metricTrendsExpanded;
            const expandedGrid = document.getElementById('metricTrendsExpanded');
            const moreBtn = document.getElementById('moreMetricTrends');
            
            if (metricTrendsExpanded) {
                expandedGrid.style.display = 'grid';
                moreBtn.querySelector('.btn-text').textContent = '收起';
                renderAdditionalTrends();
            } else {
                expandedGrid.style.display = 'none';
                moreBtn.querySelector('.btn-text').textContent = '更多';
            }
        });

        // Download Buttons
        document.getElementById('downloadCoreMetrics').addEventListener('click', () => {
            alert('核心指标数据下载功能');
        });

        document.getElementById('downloadMetricTrends').addEventListener('click', () => {
            alert('指标趋势数据下载功能');
        });

        // 添加文本筛选器的实时验证
        ['provinceOp', 'provinceInput', 'cityOp', 'cityInput', 'bizOp', 'bizInput'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => {
                    if (id.includes('Op')) {
                        // 操作符改变时，验证对应的输入框
                        const inputId = id.replace('Op', 'Input');
                        validateTextFilter(id, inputId);
                    } else if (id.includes('Input')) {
                        // 输入框改变时，验证自己
                        const opId = id.replace('Input', 'Op');
                        validateTextFilter(opId, id);
                    }
                });
                
                element.addEventListener('input', () => {
                    if (id.includes('Input')) {
                        const opId = id.replace('Input', 'Op');
                        validateTextFilter(opId, id);
                    }
                });
            }
        });
    }

    function getGroupsForDimension(dimension) {
        const groupMap = {
            'starType': ['高星', '中星', '低星'],
            'adr': ['0-200', '200-400', '400-600', '600+'],
            'boardLevel': ['金牌', '蓝牌', '特牌', '无牌'],
            'earlyBook': ['是', '否'],
            'multiNight': ['是', '否'],
            'newOld': ['新客', '老客'],
            'c365': ['是', '否'],
            'cityTier': ['一线', '新一线', '二线', '三线及以下'],
            'platformClaim': ['间夜最大化', '长期收益最大化'],
            'hotelType': ['单体', '民宿', '特色', '集团'],
            'trafficScale': ['高', '中高', '中低', '低'],
            'hotelScale': ['121+', '71-120', '31-70', '1-30']
        };
        return groupMap[dimension] || [];
    }

    function updateGlobalGrouping(groupByValue, customGroups) {
        currentGroupBy = groupByValue;
        if (!groupByValue) {
            currentGroups = []; // Reset to default
        } else if (customGroups.length > 0) {
            currentGroups = customGroups.slice(0, 10); // Use custom input
        } else {
            currentGroups = getGroupsForDimension(groupByValue); // Use predefined groups
        }
        updateCharts();
    }


    // --- INITIALIZATION ---
    setDefaultDates();
    document.querySelectorAll('select.js-multi').forEach(enhanceSelectToMulti);
    initCharts();
    renderCoreMetrics();
    updateCharts();
    attachEvents();
});
