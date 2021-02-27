


var test_positionLength = function() {
	var a = GuaVector.new(0, 0, 0)
	var b = GuaVector.new(0, 0, 1)
	var res = a.positionLength(b)
	var ex = 1
	ensure(res == ex, "test_positionLength, 向量之间的距离", 1)


	var a = GuaVector.new(0, 0, 1)
	var b = GuaVector.new(0, 0, 1)
	var res = a.positionLength(b)
	var ex = 0
	ensure(res == ex, "test_positionLength, 向量之间的距离", 2)


	var a = GuaVector.new(1, 1, 1)
	var b = GuaVector.new(-1, -1, -1)
	var res = a.positionLength(b)
	var ex = 3.4641016151377544
	ensure(res == ex, "test_positionLength, 向量之间的距离", ex, res)
}

// 测试mesh.js里的函数.
var test_mesh = function() {
	let mesh = GuaMesh.cube()
	mesh.changeRotation(1, 1, 1)
	let res = mesh.rotation
	let exportVal = GuaVector.new(1, 1, 1)
	ensure(res.isEqual(exportVal), "rotationChange", res, exportVal)
}

//测试mesh.js里的fromGua3D 函数.
// 0 0 0#1 0 0#0 1 0
// 0 0 0#1 0 0#0 0 1
// 0 0 0#0 1 0#0 0 1
// 1 0 0#0 1 0#0 0 1`
var test_mesh_fromGua3D = function() {
	 let meshAxe3d = Axe3dData.getCones();	// 三角形.
    let mesh = GuaMesh.fromGua3D(meshAxe3d)

    let c = GuaColor.randomColor()
    let v1 = GuaVector.new(0, 0, 0)
    let v2 = GuaVector.new(1, 0, 0)
    let v3 = GuaVector.new(0, 1, 0)
    let v4 = GuaVector.new(0, 0, 1)
    let p1 = GuaVertex.new(v1, c)
    let p2 = GuaVertex.new(v2, c)
    let p3 = GuaVertex.new(v3, c)
    let p4 = GuaVertex.new(v4, c)
    let exportVal = [p1, p2, p3, p4]

    let bool = mesh.triangles[0].position.isEqual(exportVal[0].position)
    ensure(bool, "test_mesh_fromGua3D", mesh, exportVal)
}


// 测试showAxeImage
var test_mesh_showAxeImage = function() {
	 let meshAxe3d = Axe3dData.getChestAxeImage();	// 箱子的贴图数据.
	 let chest = GuaMesh.showAxeImage(meshAxe3d)
	 ensure(chest.length == 256 * 256 * 4, "test_mesh_showAxeImage", chest.length)
}


// 测试fromAxe3DImage. 贴图数据.
var test_mesh_fromAxe3DImage = function() {
	 let meshAxe3d = Axe3dData.getChestAxeImage();	// 箱子的贴图数据. 给模型上色用.
	 let chest = GuaMesh.formatAxe3DImage(meshAxe3d)
	 ensure(chest.length == 256, "test_mesh_fromAxe3DImage-x", chest.length)
	 ensure(chest[0].length == 256, "test_mesh_fromAxe3DImage-y", chest[0].length)
	 ensure(chest[0][0].length == 4, "test_mesh_fromAxe3DImage-rgba", chest[0][0].length)
}



// 测试向量函数.
var test_vector = function() {
	var a = GuaVector.new(1,2,3)
	var b = GuaVector.new(1,2,3)
	var c = GuaVector.new(2,3,4)

	ensure(a.isEqual(b), "isEqual-1", a, b)
	ensure(!b.isEqual(c), "isEqual-2", b, c)
}


// 测试顶点的函数.
var test_vertex = function() {
	var a = GuaVector.new(1,2,3)
	var b = GuaVector.new(1,2,5)
	var c = GuaVector.new(2,3,4)
	var color = GuaColor.red()

	var av = GuaVertex.new(a, color)
	var bv = GuaVertex.new(b, color)
	var cv = GuaVertex.new(c, color)

	var arr = [av, bv]

	let res =  bv.indexOfVertices(arr)
	let exportVal = 1
	ensure(res == exportVal, "indexOfVertices-1")
	ensure(0 == av.indexOfVertices(arr), "indexOfVertices-2",  av.indexOfVertices(arr))
	ensure(-1 == cv.indexOfVertices(arr), "indexOfVertices-3")
}






var test_main = function() {
	console.log("测试函数")

	test_positionLength()

	test_mesh()

	test_vector()

	test_vertex()

	test_mesh_fromGua3D()

	test_mesh_showAxeImage()

	test_mesh_fromAxe3DImage()

}
test_main()