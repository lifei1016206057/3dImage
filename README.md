# 文件介绍

	gua_object.js : 把new关键字用.new代替, 仅此而已

	utils.js: 常用函数

	color.js: 颜色对象. 有属性 r,g,b,a四个. 方法: interpolate求差值. equal判断相同, randomColor随机色, 常用颜色
	
	vector.js: 向量. 有属性: x, y, z 三个. 方法:  interpolate求差值. equal判断相同, 及一些向量计算方法. multi_num相乘, sub字向量. length长度, dot点乘, cross叉乘

	vertex.js: 顶点. 有属性 position位置, color颜色, u,v贴图属性.  interpolate求差值. indexOfVertices求索引

	matrix.js: 矩阵. 矩阵计算的常用方法.

	axemesh.js: 三维模型. 属性 position中心, rotation旋转. scale缩放, triangles顶点数组, indices三角形数组. axe3dImage贴图数组. 方法: 三维模型文件的解析, 贴图的解析

	canvas.js: 渲染. 属性 position镜头, target目标. up镜头方向. 方法: 将三维模型上的数据经过矩阵转换成二位坐标上的数据. 画点, 画线, 画三角形. 渲染到浏览器上.

	test.js: 测试函数.