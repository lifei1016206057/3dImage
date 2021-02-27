// log
const log = function(...meg) {
	console.log(...meg)
}

// 获取单个元素
const _e = (sel) => document.querySelector(sel)

//获取多个元素
const _es = (sel) => document.querySelectorAll(sel)

// 插值, 计算插值? 不是很清楚. 在chat里应该有 英[ɪnˈtɜːpəleɪt]插值
const interpolate = (a, b, factor) => a + (b - a) * factor

// 返回随机数
const random01 = (x) => Math.round(Math.random()*x)


var ensure = function(bool, ...msg) {
	if (!bool) {
		console.error("测试失败", ...msg)
	} else {
		log("测试成功")
	}
	return;
}
