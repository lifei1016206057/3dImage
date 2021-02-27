class GuaMesh extends GuaObject {
    // 表示三维物体的类
    constructor() {
        super()

        // 一个三维模型的中心位置
        this.position = GuaVector.new(0, 0, 0)
        // 三维模型的旋转角度
        this.rotation = GuaVector.new(0, 0, 0)
        // 三维模型的缩放比例
        this.scale = GuaVector.new(1, 1, 1)

        // 三维模型的顶点数组
        this.triangles  = null

        // 三维模型的三角形数组.
        this.indices = null

        // 为了展示贴图用的数据
        //格式为: 比如是 5*5的贴图
        /*
     [
        r,g,b,a,   
        r,g,b,a, 
        r,g,b,a,
        r,g,b,a,
        .....
     ]
    */
        this.axeImage = []
        this.axeImageWidth = 256
        this.axeImageHeight = 256


        /*为了给三维模型上色的贴图数据
        格式如下. 5*5的贴图数据
        [
            [
                [r,g,b,a],
                [r,g,b,a],
                [r,g,b,a],
                [r,g,b,a],
                [r,g,b,a],
            ],
            [
                [r,g,b,a],
                [r,g,b,a],
                [r,g,b,a],
                [r,g,b,a],
                [r,g,b,a],
            ],
            ......//5个数组. 
        ]
        要拿到坐标为x, y的颜色. 是 this.axe3dImage[x][y]
        */
        this.axe3dImage = []
    }


    getColorFromAxeImage(u, v) {
        let x = Math.round( u * this.axeImageWidth )
        let y = Math.round( v * this.axeImageHeight )
        let pi =  x + y * this.axeImageWidth
        let r1 = pi * 4
        let r = this.axeImage[r1]
        let g = this.axeImage[r1 + 1]
        let b = this.axeImage[r1 + 2]
        let a = this.axeImage[r1 + 3]
        return GuaColor.new(r, g, b, a)

    }

    // 展示贴图用的函数. 格式为

    static showAxeImage(axeImage) {
        let axeImageData = axeImage
        let imageData = []
        let s = axeImageData.split("\n")


        for(var l=4; l < s.length; l++) {
            let t = s[l]
            if (t) {
                let p = t.split("#")
                let pArr = p.forEach(function(v, i) {
                    let item = v.split(" ")
                    item = item.map(function(v) {
                        return Number(v)
                    })
                    imageData.push(...item)
                })
            }
            
        }
       
        return imageData
    }

    static formatAxe3DImage(axeImage) {
        let axeImageData = axeImage
        let imageData = []
        let s = axeImageData.split("\n")
        for(var l=4; l < s.length; l++) {
            
            let t = s[l]    // rgba#rgba#rgba
            if (!t) {
                continue
            }
            let p = t.split("#")    // [rgba, rgba,]
            let imageData_y = []
            p.forEach(function(v, i) {
               
                let item = v.split(" ") // [rgba]
                item = item.map(function(v) {
                    return Number(v)
                })
                imageData_y.push(item)
            })
            imageData.push(imageData_y)

        }

       
        return imageData
    }

    // 设置贴图.
    setAxe3DImage(axe3DImage) {
         this.axe3dImage = axe3DImage
    }

    // 从获取的贴图数据里, 根据u, v找到对应的颜色.
    // TODO: 暂时不用.
    static getImageDetail(imageDetail, u, v) {
        if (u > 1) {
            u = 1
        }
        if (v > 1) {
            v = 1
        }
        if (u < 0) {
            u = Math.abs(u)
        }
        if (v < 0) {
            v = Math.abs(v)
        }

        let int = Math.round
        let width = imageDetail.length
        let height = imageDetail[0].length
        let x = int(u * width)
        let y = int(v * height)

        if(x >= 256) {
            x = 255
        }
        if(y >= 256) {
            y = 255
        }

        let res = imageDetail[x][y]
        let color = GuaColor.new(res[0], res[1], res[2], res[3])
        return color
    }

    // 从获取3d模型的模型数据以及贴图数据展示模型.
    // axe3d: 模型数据
    // axe3dImage: 模型贴图数据.
    static fromAxe3DImage(axe3d, axe3dImage) {
      
        let chest = this.showAxeImage(axe3dImage)
       



        var axe3dArr = axe3d.split("\n")
        var trianglesStr = axe3dArr[2].split(" ")[1]
        var triangles = Number(trianglesStr)    // 三角形数量.

        // 顶点数组, 保存顶点的坐标
        let vertices = []

        //三角形数组, 保存顶点的下标.
        let indices = []

        for (var i = 3 ; i < axe3dArr.length; i++) {
            let item = axe3dArr[i]  // "0 0 0#1 0 0#0 1 0"

            if(!item) {
                continue;
            }

            let itemPArr = item.split("#") //  ["0 0 0", "1 0 0", "0 1 0"]
            

            let indicesItem = []
            for (var j = 0 ; j < itemPArr.length; j++) {    //  ["0 0 0", "1 0 0", "0 1 0"]
                let a = itemPArr[j]     //  "0 0 0"
                let pArr = a.split(" ") // ["0", "0", "0"]

                let _x = Number(pArr[0])
                let _y = Number(pArr[1])
                let _z = Number(pArr[2])
                let _u = Number(pArr[3])
                let _v = Number(pArr[4])
                let v = GuaVector.new(_x, _y, _z)
                let c = GuaColor.black()
                // let c = GuaColor.randomColor()
                // let c = this.getImageDetail(chest, _u, _v)

                var p = GuaVertex.new(v, c, _u, _v)
                var indexVal = p.indexOfVertices(vertices)

               
                if (indexVal > -1) {
                    indicesItem.push(indexVal)
                } 
                if (indexVal == -1) {
                    vertices.push(p)
                    indicesItem.push(vertices.length - 1)
                } 
            }
            indices.push(indicesItem)

        }

        let m = this.new()
        m.triangles  = vertices   // 顶点数组
        m.indices = indices     // 三角形数组.
        m.axeImage = chest;  // 保存贴图数据.
        return m
    }

    static fromGua3D(axe3d) {
        /*
        //         一个 3d 模型由很多个三角形组成 上课板书中的 GuaMesh 类是一个表示模型的类
        // 群文件给出了一个 axe17-axe3d.7z 文件
        // 里面有 3 个 axe3d 格式的模型文件

        // 第一行固定，格式说明，内容为 axe3d
        // 第二行是版本 version 1.0
        // 第三行是三角形数量 triangles 4
        // 第四行开始，每行表示一个三角形的 3 个顶点
        // 例如这个例子 0 0 0#1 0 0#0 1 0
        // 三个顶点由井号分隔
        // 每个顶点的 xyz 坐标用空格分隔

        // 实现一个 axemesh 类，它的 fromAxe3D 类方法能接受一个 axe3d 文件内容字符串作为参数，生成一个模型类

        // 这个模型类有如下 3 个属性
        // // 坐标
        // this.position = GuaVector.new(0, 0, 0)
        // // 旋转角度
        // this.rotation = GuaVector.new(0, 0, 0)
        // // 三角形数组
        // this.triangles = []
        // // 三角形数组的格式如下
        // [
        //     [v1(GuaVector), v2, v3],
        // ]


        // static fromAxe3D(axe3dString) {
        // }
          */

        var axe3dArr = axe3d.split("\n")
        var trianglesStr = axe3dArr[2].split(" ")[1]
        var triangles = Number(trianglesStr)    // 三角形数量.

        // 顶点数组, 保存顶点的坐标
        let vertices = []

        //三角形数组, 保存顶点的下标.
        let indices = []

        for (var i = 3 ; i < axe3dArr.length; i++) {
            let item = axe3dArr[i]  // "0 0 0#1 0 0#0 1 0"

            if(!item) {
                continue;
            }

            let itemPArr = item.split("#") //  ["0 0 0", "1 0 0", "0 1 0"]
            

            let indicesItem = []
            for (var j = 0 ; j < itemPArr.length; j++) {    //  ["0 0 0", "1 0 0", "0 1 0"]
                let a = itemPArr[j]     //  "0 0 0"
                let pArr = a.split(" ") // ["0", "0", "0"]

                let v = GuaVector.new(Number(pArr[0]), Number(pArr[1]), Number(pArr[2]))
                // let c = GuaColor.randomColor()
                let c = GuaColor.randomColor()

                var p = GuaVertex.new(v, c)
                var indexVal = p.indexOfVertices(vertices)

               
                if (indexVal > -1) {
                    indicesItem.push(indexVal)
                } 
                if (indexVal == -1) {
                    vertices.push(p)
                    indicesItem.push(vertices.length - 1)
                } 
            }
            indices.push(indicesItem)

        }

        let m = this.new()
        m.triangles  = vertices   // 顶点数组
        m.indices = indices     // 三角形数组.

        return m
    }



    // 返回一个三角形.
    static triangle() {
 // 8 points
        let points = [
            1,  0,  1,     // 0
            3,  0,  1,     // 1
            2,  2,  1,     // 2

            2,  0,  0,     // 3
            4,  0,  0,      // 4
            3,  2,  0,      // 5
        ]

        let vertices = []
        for (let i = 0; i < points.length; i += 3) {
            let v = GuaVector.new(points[i], points[i+1], points[i+2])
            // let c = GuaColor.randomColor()
            let c = GuaColor.randomColor()
            vertices.push(GuaVertex.new(v, c))
        }

        // 12 triangles * 3 vertices each = 36 vertex indices
        let indices = [
            // 12
            [0, 1, 2],
            [3, 4, 5]
           
        ]
        let m = this.new()
        m.vertices = vertices
        m.indices = indices
        return m
    }

    // 返回一个正方体
    static cube() {
        // 8 points
        let points = [
            -1, 1,  -1,     // 0
            1,  1,  -1,     // 1
            -1, -1, -1,     // 2
            1,  -1, -1,     // 3
            -1, 1,  1,      // 4
            1,  1,  1,      // 5
            -1, -1, 1,      // 6
            1,  -1, 1,      // 7
        ]

        let vertices = []
        for (let i = 0; i < points.length; i += 3) {
            let v = GuaVector.new(points[i], points[i+1], points[i+2])
            // let c = GuaColor.randomColor()
            let c = GuaColor.randomColor()
            vertices.push(GuaVertex.new(v, c))
        }

        // 12 triangles * 3 vertices each = 36 vertex indices
        let indices = [
            // 12
            [0, 1, 2],
            [1, 3, 2],
            [1, 7, 3],
            [1, 5, 7],
            [5, 6, 7],
            [5, 4, 6],
            [4, 0, 6],
            [0, 2, 6],
            [0, 4, 5],
            [5, 1, 0],
            [2, 3, 7],
            [2, 7, 6],
        ]
        let m = this.new()
        m.triangles = vertices
        m.indices = indices
        m.showLine = false
        return m
    }

    changeRotation(x, y, z) {
        this.rotation.x += x
        this.rotation.y += y
        this.rotation.z += z
    }
    setRotation(x, y, z) {
        this.rotation.x = x
        this.rotation.y = y
        this.rotation.z = z
    }
    setScale(x, y, z) {
        this.scale.x = x
        this.scale.y = y
        this.scale.z = z
    }

    setPosition(obj) {
        if (obj.x) {
            this.position.x = obj.x
        }
        if (obj.y) {
            this.position.y = obj.y
        }
        if (obj.z) {
            this.position.z = obj.z
        }
    }


  
}
