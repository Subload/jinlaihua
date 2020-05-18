<template>
	<view>
		<auto-nav-bar
			leftShow
			title="JLH.MP"
			@clickLeft="handleClickLeft"
		>
		</auto-nav-bar>
		<view class="clear30"></view>
		
		<scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0">
			<view class="mini-btn" style="color: #007FB9;">周期：</view>
			<view class="mini-btn" @click="ChangeKLinePeriod(PERIOD_ID.KLINE_DAY_ID)">日线</view>
			<view class="mini-btn" @click="ChangeKLinePeriod(PERIOD_ID.KLINE_60MINUTE_ID)">一小时</view>
			<view class="mini-btn" @click="ChangeKLinePeriod(PERIOD_ID.KLINE_15MINUTE_ID)">15分钟</view>
			<view class="mini-btn" @click="ChangeKLinePeriod(PERIOD_ID.KLINE_MINUTE_ID)">1分钟</view>
		</scroll-view>
		
		<!-- <view class="button-sp-area" >
			<button class="mini-btn" type="default" size="mini" @click="ChangeKLineIndex(0,'BOLL')">BOLL</button>
			<button class="mini-btn" type="default" size="mini" @click="ChangeKLineIndex(1,'RSI')">RSI</button>
			<button class="mini-btn" type="default" size="mini" @click="ChangeKLineIndex(2,'WR')">WR</button>
			<button class="mini-btn" type="default" size="mini" @click="ChangeKLineIndex(0,'MA')">MA</button>
			<button class="mini-btn" type="default" size="mini" @click="ChangeKLineIndex(1,'VOL')">VOL</button>
			<button class="mini-btn" type="default" size="mini" @click="ChangeKLineIndex(1,'MACD')">MACD</button>
		</view> -->
		
		<!-- <view class="button-sp-area"  v-show="false">
			<button class="mini-btn" type="default" size="mini" @click="ChangeSymbol('000001.sz')">000001.sz</button>
			<button class="mini-btn" type="default" size="mini" @click="ChangeSymbol('600000.sh')">600000.sh</button>
		</view> -->
		
		<view class="clear30"></view>
		<view style="width: 750rpx;padding: 0 10rpx;box-sizing: border-box;"> 
			<canvas id="kline" canvas-id='kline' class='kline' style="width: 100%; height: 650px" 
			  @touchstart="KLineTouchStart" @touchmove='KLineTouchMove' @touchend='KLineTouchEnd' ></canvas>  
		</view>
		  
	</view>
	
</template>

<script>
import {JSCommon} from '@/components/umychart.uniapp/umychart.wechat.3.0.js'

function DefaultData() { }

DefaultData.GetKLineOption = function () 
{
    let data = 
    {
        Type: '历史K线图', 
        
        Windows: //窗口指标
        [
            {Index:"MA",Modify: false, Change: false}, 
            {Index:"VOL",Modify: false, Change: false},
			{Index:"RSI",Modify: false, Change: false},
        ], 
 
        CorssCursorTouchEnd:true,
		IsShowRightMenu:false,       //是否显示右键菜单
		CorssCursorInfo:{ Left:2,Right:2 },
  
        Border: //边框
        {
            Left:   1,
            Right:  1, //右边间距
            Top:    1,
            Bottom: 25,
        },
 
        KLine:
        {
            Right:1,                            //复权 0 不复权 1 前复权 2 后复权
            Period:0,                           //周期: 0 日线 1 周线 2 月线 3 年线 
            PageSize:12,
            IsShowTooltip:false,
        },
		
		Frame:  //子框架设置 (Height 窗口高度比例值)
		[
			{   SplitCount:0,
				//Height:4,
				IsShowLeftText:false, 
				IsShowRightText:true,
				Custom:
				[
					{ 
						Type:0,
						Position:'right',
					}
				]
			},
			{
				SplitCount:0,
				//Height:2,
				IsShowLeftText:false, 
				IsShowRightText:true,
				Custom:
				[
					{ 
						Type:0,
						Position:'right',
					}
				]
			},
			{
				SplitCount:0,
				//Height:2,
				IsShowLeftText:false, 
				IsShowRightText:false,
				Custom:
				[
					{ 
						Type:0,
						Position:'right',
					}
				]
			}
		],
		
		ExtendChart:
		[
			{Name:'KLineTooltip' },
		],
		
        
    };
 
    return data;
}

//周期枚举
var PERIOD_ID=
{
    KLINE_DAY_ID:0,
    KLINE_WEEK_ID:1,
    KLINE_MONTH_ID:2,
    KLINE_YEAR_ID:3,

    KLINE_MINUTE_ID:4,
    KLINE_5MINUTE_ID:5,
    KLINE_15MINUTE_ID:6,
    KLINE_30MINUTE_ID:7,
    KLINE_60MINUTE_ID:8
}

var g_KLine=
{
	JSChart:null
};


export default 
{
	// name:'HQChart',
	
	data() {
		return {
			Symbol:'600000.sh',
			
			KLine:
			{
				Option:DefaultData.GetKLineOption(),
				IsShow:false,
				Display:'none',
				Width:400,
				Height:650,
			},
			
			PERIOD_ID:PERIOD_ID,
			period:''
		}
	},
	
	onLoad:function() 
	{
		this.ChangeKLinePeriod(PERIOD_ID.KLINE_DAY_ID);
	},
	onShow:function(){
		uni.showLoading()
		// this.ChangeKLinePeriod(PERIOD_ID.KLINE_DAY_ID);
		// this.ChangeKLineIndex(2,'RSI')
	},
	onReady:function()
	{
		setTimeout(()=>{
			uni.hideLoading()
		},3000)
	},
	
	// onHide:function(){
	// 	uni.hideLoading()
	// 	if (g_KLine.JSChart)
	// 		{
	// 			g_KLine.JSChart.StopAutoUpdate();
	// 			g_KLine.JSChart=null;
	// 		}
	// },
	onUnload:function()   //退出的时候 停止定时器和清空hqchart的实例
	{
		uni.hideLoading()
		if (g_KLine.JSChart)
		{
			g_KLine.JSChart.StopAutoUpdate();
			g_KLine.JSChart=null;
		}
	},
	methods: 
	{
		handleClickLeft(){
			uni.navigateBack()
		},
			
		//////////////////////////////////////////////////////////////////////////////////////
		CreateKLineChart:function()
		{
			if (this.KLine.JSChart) return;
			
			let element = new JSCommon.JSCanvasElement();
			// #ifdef APP-PLUS
			element.IsUniApp=true;	//canvas需要指定下 是uniapp的app
			// #endif
			element.ID = 'kline';
			element.Height = this.KLine.Height;  //高度宽度需要手动绑定!!
			element.Width = this.KLine.Width;
					
			g_KLine.JSChart = JSCommon.JSChart.Init(element);
			this.KLine.Option.NetworkFilter=this.NetworkFilter;
			this.KLine.Option.Symbol=this.Symbol;
			g_KLine.JSChart.SetOption(this.KLine.Option);
		},
		
		//K线周期切换
		ChangeKLinePeriod:function(period)
		{
			
			// console.log('切换周期',period,g_KLine.JSChart)
			this.period = period
			uni.showLoading({
				title:"加载中"
			})
			if (!g_KLine.JSChart)    //不存在创建
			{
				this.KLine.Option.Period=period;
				this.CreateKLineChart();
			}
			else
			{
				g_KLine.JSChart.ChangePeriod(period);
			}
		},
		
		//切换指标 windowIndex=窗口索引 0开始, name=指标名字/ID
		ChangeKLineIndex:function(windowIndex, name)
		{
			if (!g_KLine.JSChart) return;
			
			g_KLine.JSChart.ChangeIndex(windowIndex,name);
		},
		
		//切换股票
		ChangeSymbol:function(symbol)
		{
			if (!g_KLine.JSChart) return;
			
			g_KLine.JSChart.ChangeSymbol(symbol);
		},
		
		// 第三方数据
		NetworkFilter:function(data, callback)
		{
			// uni.showLoading({
			// 	title:"加载中"
			// })
			
			// console.log('[HQChart:NetworkFilter] data', data);
			
			data.PreventDefault=true;	//设置hqchart不请求数据
			
			var hqChartData = {
				code:0,
				data:[],
				symbol:'JLH.MP',
				name:"JLH.MP",
			}
			let par = {
				communicid:'10',
				minutes:'888'
			}
			if(this.period == '0'){
				par = {
					communicid:'10',
					minutes:'888'
				}
			}else if(this.period == '8'){
				par = {
					communicid:'10',
					minutes:'60'
				}
			}else if(this.period == '6'){
				par = {
					communicid:'10',
					minutes:'15'
				}
			}else if(this.period == '4'){
				par = {
					communicid:'10',
					minutes:'1'
				}
			}
			
			this.$API.kline(par).then(res=>{
				uni.hideLoading()
				if(res.statusCode != '200' || res.data.state != '0'){
					uni.showToast({
						title:"加载K线数据失败，请稍后刷新重试",
						icon:"none",
					})
					return
				}
				if(this.period == '0'){
					hqChartData.count = res.data.data.length
				}else if(this.period == '8'){
					hqChartData.count = (res.data.data.length/24).toFixed(0)
				}else if(this.period == '6'){
					hqChartData.count = (res.data.data.length/96).toFixed(0)
				}else if(this.period == '4'){
					hqChartData.count = (res.data.data.length/1440).toFixed(0)
				}
				hqChartData.data = res.data.data
				// // #ifdef H5
				// callback(hqChartData)
				// // #endif
				
				callback({data:hqChartData})
				
			}).catch(err => {
				// error
				uni.hideLoading()
				console.log(err)
			})
			
		},
		
		
			
		//KLine事件
		KLineTouchStart: function (event) 
		{
		  if (g_KLine.JSChart) g_KLine.JSChart.OnTouchStart(event);
		},
		
		KLineTouchMove: function (event) 
		{
		  if (g_KLine.JSChart) g_KLine.JSChart.OnTouchMove(event);
		},
		
		KLineTouchEnd: function (event) 
		{
		  if (g_KLine.JSChart) g_KLine.JSChart.OnTouchEnd(event);
		},
	}
}
</script>

<style>
	
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50upx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		/* font-size: 36upx; */
		/* color: #8f8f94; */
	}
	.button-sp-area button{
		margin: 0 20rpx;
	}
	.mini-btn{
		padding: 0 20rpx;
		display: inline-block;
	}
	.scroll-view_H{
		padding-bottom: 10rpx;
		border-bottom: 1px solid #12224C;
	}
</style>