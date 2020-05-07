import { request, config } from '@/utils/request.js'
import { encode } from '@/utils/des3.js' // 参数加密方法
// data = encode(data);

// 在您需要请求的地方直接使用该api
const api = {
	// 登录注册
	
	// 账号密码登录
	login:(data) => {
		return request.request({
		    url: '/account/login',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	// 修改登录密码
	updatelogpwd:(data) => {
		return request.request({
		    url: '/account/updatelogpwd',
		    method: 'POST',
			data: encode(data)
		})
	},
	// 获取登录验证码
	sendCode:(data) => {
		return request.request({
		    url: '/account/sendCode',
		    method: 'POST',
			data: encode(data)
		})
	},
	// 验证用户注册
	register:(data) => {
		return request.request({
		    url: '/account/register',
		    method: 'POST',
			data: encode(data)
		})
	},
	// 设置昵称
	updatenickname:(data) => {
		return request.request({
		    url: '/account/updatenickname',
		    method: 'POST',
			data: {
				image:data.img,
				nickname:encode(data.nickname),
				userid:encode(data.userid)
			}
		})
	},
	// 用户完成注册
	registerComplete:(data) => {
		return request.request({
		    url: '/account/registerComplete',
		    method: 'POST',
			data: encode(data)
		})
	},
	// 注册获取验证码
	registerSendCode:(data) => {
		return request.request({
		    url: '/account/registerSendCode',
		    method: 'POST',
			data: encode(data)
		})
	},
	// 忘记密码获取验证码
	forgetSendCode:(data) => {
		return request.request({
		    url: '/account/forgetSendCode',
		    method: 'POST',
			data: encode(data)
		})
	},
	// 忘记密码
	forget:(data) => {
		return request.request({
		    url: '/account/forget',
		    method: 'POST',
			data: encode(data)
		})
	},
	// 新密码提交
	forgetComplete:(data) => {
		return request.request({
		    url: '/account/forgetComplete',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	// 登录注册 end
	
	
	// 用户信息管理
	
	// 获取用户信息
	getAccountInfo:(data) => {
		return request.request({
		    url: '/account/getAccountInfo',
		    method: 'POST',
			data: encode(data)
		})
	},
	// 进行高级认证
	// seniorCertificate:(data) => {
	// 	return request.request({
	// 	    url: '/account/seniorCertificate',
	// 	    method: 'POST',
	// 		data: encode(data)
	// 	})
	// },
	
	// 设置交易密码
	setTradPassword:(data) => {
		return request.request({
		    url: '/account/setTradPassword',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	// 用户信息管理  end
	
	
	// 商品订单模块
	
	// 用户资产列表
	getcommunicassetsList:(data) => {
		return request.request({
		    url: '/currency/getcommunicassetsList',
		    method: 'POST',
			data: encode(data)
		})
	},
	// 添加（修改）收货地址
	setupaddress:(data) => {
		return request.request({
		    url: '/commodity/setupaddress',
		    method: 'POST',
			data: encode(data)
		})
	},
	// 用户地址列表
	getreceivingAddressByidList:(data) => {
		return request.request({
		    url: '/commodity/getreceivingAddressByidList',
		    method: 'POST',
			data: encode(data)
		})
	},
	// 商品列表
	CommdityAll:(data) => {
		return request.request({
		    url: '/commodity/CommdityAll',
		    method: 'POST',
			data: encode(data)
		})
	},
	// 获取默认地址
	getBusinessOrder:(data) => {
		return request.request({
		    url: '/commodity/getBusinessOrder',
		    method: 'POST',
			data: encode(data)
		})
	},
	// 提交订单
	accomplishBusinessOrder:(data) => {
		return request.request({
		    url: '/commodity/accomplishBusinessOrder',
		    method: 'POST',
			data: encode(data)
		})
	},
	// 获取K线图数据
	kline:(data) => {
		return request.request({
		    url: '/exchange/kline',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	// 触发支付宝
	aliPay:(data) => {
		return request.request({
		    url: '/order/pay',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	// 邀请界面 获取邀请码的url
	getShareUrl:(data) => {
		return request.request({
		    url: '/account/getShareUrl',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	// 我的订单
	orderforGoodsAll:(data) => {
		return request.request({
		    url: '/commodity/orderforGoodsAll',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	// 公告列表
	getnotice:(data) => {
		return request.request({
		    url: '/message/getnotice',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	// 提交订单
	getBusinessOrder:(data) => {
		return request.request({
		    url: '/commodity/getBusinessOrder',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	// 提交订单
	bindphone:(data) => {
		return request.request({
		    url: '/account/bindphone',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	// 根据用户id获取验证码
	sendCodeByUser:(data) => {
		return request.request({
		    url: '/account/sendCodeByUser',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	// 行情
	gettrade:(data) => {
		return request.request({
		    url: '/exchange/gettrade',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	// 更新用户信息
	getAccountInfo:(data) => {
		return request.request({
		    url: '/account/getAccountInfo',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	// 通证兑换页面数据展示
	exchange:(data) => {
		return request.request({
		    url: '/securities/exchange',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	// 提交兑换
	exchangeCommit:(data) => {
		return request.request({
		    url: '/securities/exchangeCommit',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	// 通证购买页面数据展示 子票母票通用
	shop:(data) => {
		return request.request({
		    url: '/securities/shop',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	// 购买通证获取支付宝信息
	shopCommit:(data) => {
		return request.request({
		    url: '/securities/shopCommit',
		    method: 'POST',
			data: encode(data)
		})
	},
	// 我的团队
	getMyTeam:(data) => {
		return request.request({
		    url: '/team/index',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	// 我的团队-成员列表 获取某人的直推
	getSubordinate:(data) => {
		return request.request({
		    url: '/team/getSubordinate',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	// 我的认赠
	recognition:(data) => {
		return request.request({
		    url: '/recognition/index',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	// 获取交易详情
	getBusinessInfo:(data) => {
		return request.request({
		    url: '/c2c/index',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	// 资产详细记录
	getlist:(data) => {
		return request.request({
		    url: '/CommunicassetsRecord/getlist',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	// 身份证验证
	idcardvalid:(data) => {
		return request.request({
		    url: '/account/idcardvalid',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	// 检查更新
	getAppAzVersion:(data) => {
		return request.request({
		    url: '/account/getAppAzVersion',
		    method: 'POST',
			data: encode(data)
		})
	},
	
	
	
	
	
	
	// formData 提交地址（需要上传文件的）
	// 上传头像
	uploadPortrait: config.baseUrl + '/account/updatenickname',
	// 提交反馈
	putFeedback: config.baseUrl + '/leave/putFeedback',
	// 实名认证
	seniorCertificate: config.baseUrl + '/account/seniorCertificate',
	// 上传收款方式
	addPayment: config.baseUrl + '/c2c/addPayment',
	
	
} 

export default api
