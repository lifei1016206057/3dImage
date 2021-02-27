
// 摄像头.
class GuaCamera extends GuaObject {
    constructor() {
        super()
        // 镜头在世界坐标系中的坐标
        this.position = GuaVector.new(0, 0, -10)
        // 镜头看的地方
        this.target = GuaVector.new(0, 0, 0)
        // 镜头向上的方向
        this.up = GuaVector.new(0, 1, 0)
    }
}



class GuaCanvas extends GuaObject {
    constructor(selector) {
        super()
        let canvas = _e(selector)
        this.canvas = canvas
        this.context = canvas.getContext('2d')
        this.w = canvas.width
        this.h = canvas.height
        this.pixels = this.context.getImageData(0, 0, this.w, this.h)
        this.bytesPerPixel = 4
        // this.pixelBuffer = this.pixels.data
        this.camera = GuaCamera.new()

        this.scale = GuaVector.new(1, 1, 1)

        this.zBuffer = []
        this.initZBuffer()

        this.mesh = null

    }

    testCanvas() {

        // init是否成功.
        if (!this.test_initZBuffer()) {
            console.log("this.test_initZBuffer 失败")
        }
        
    }
    test_initZBuffer() {
        this.initZBuffer()
        var total = this.w * this.h
        var num = 0
         for(let x = 0; x< this.w; x++) {
            for(let y=0; y<this.h; y++) {
                let item = this.zBuffer[x][y]
                if (item === null) {
                    num++
                }
            }
        }
        return num == total;
    }



    setScale(x, y, z) {
        this.scale.x = x
        this.scale.y = y
        this.scale.z = z
    }
    initZBuffer() {
        this.zBuffer = []
        for(let x = 0; x< this.w; x++) {
            for(let y=0; y<this.h; y++) {
                if (this.zBuffer[x]) {
                    this.zBuffer[x].push(null)
                } else {
                    this.zBuffer[x] = [null]
                }
            }
        }


    }

    // 用zBuffer判断这个点是否画.
    zBufferDraw(p) {
        let x = Math.round(p.x)
        let y = Math.round(p.y)
        let zBuffer = this.zBuffer[ x ][ y ]

        // 获取p点到摄像头的距离.
        // let pBuffer = this.getCameraLength(p)
         let pBuffer = p.z
         // log("zBuffer", p.z, zBuffer)
         


        // console.log(pBuffer, zBuffer)

        if (pBuffer > zBuffer) {
            // log("覆盖点")
            this.zBuffer[ x ][ y ] = pBuffer
            
            return true
        }

        if ( zBuffer === null) {
            this.zBuffer[ x ][ y ] = pBuffer

            // log("空白点")
            return true
        } else {

            // log("不画点")
            return false
        }
    }

    // 获取到摄像头的距离.
    getCameraLength(p) {
        return this.camera.position.positionLength(p)
    }

    render() {
        // 执行这个函数后, 才会实际地把图像画出来
        // ES6 新语法, 取出想要的属性并赋值给变量, 不懂自己搜「ES6 新语法」
        let {pixels, context} = this
        context.putImageData(pixels, 0, 0)
    }
    clear(color=GuaColor.transparent()) {
        // color GuaColor
        // 用 color 填充整个 canvas
        // 遍历每个像素点, 设置像素点的颜色
        // transparent 透明色
        let {w, h} = this
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                this._setPixel(x, y, color)
            }
        }
        this.initZBuffer()
        

        this.render()
    }

    // 获取坐标为x, y处的像素的颜色GuaColor
    _getPixel(x, y) {
        let int = Math.floor
        x = int(x)
        y = int(y)
        // 用座标算像素下标
        let i = (y * this.w + x) * this.bytesPerPixel
        // 设置像素
        let p = this.pixels.data
        return GuaColor.new(p[i], p[i+1], p[i+2], p[i+3])
    }

    // 设置坐标为x,y处的像素的颜色为color
    // Math.round 小数部分.四舍五入. 所以划线时,会类似折线. 
    _setPixel(x, y, color) {
        // color: GuaColor
        // 这个函数用来设置像素点, _ 开头表示这是一个内部函数, 这是我们的约定
        // 浮点转 int
        let int = Math.round
        x = int(x)
        y = int(y)
        // 用座标算像素下标
        let i = (y * this.w + x) * this.bytesPerPixel
        // 设置像素
        let p = this.pixels.data
        let {r, g, b, a} = color
        // 一个像素 4 字节, 分别表示 r g b a
        p[i] = int(r)
        p[i+1] = int(g)
        p[i+2] = int(b)
        p[i+3] = int(a)
    }

    // 画点 point: {x: xx, y: xx}
    drawPoint(point, color=GuaColor.black()) {
        // TODO: z-buffer
        // point: GuaPoint
        let {w, h} = this
        let p = point
        if (p.x >= 0 && p.x <= w) {
            if (p.y >= 0 && p.y <= h) {
                let x = Math.round(p.x)
                let y = Math.round(p.y)

               
                // 是否开启zBuffer.
                if (this.zBufferDraw(p)) {
                    this._setPixel(x, y, color)
                    
                    // console.log("画点")
                } 

            }
        }
    }

    // 画一条p1到p2的线. 颜色为color;. 
    // 这个函数是画边框线用的, 物体颜色的填充是 drawScanline
    drawLine(p1, p2, color=GuaColor.black()) {
        let [x1, y1, z1, x2, y2, z2] = [p1.x, p1.y, p1.z, p2.x, p2.y, p2.z]
        let dx = x2 - x1
        let dy = y2 - y1

        // dx ** 2是 dx的平方. 即 dx * dx.   dx ** 4 是 dx * dx * dx * dx. 四次方.
        // R是p1到p2的距离. [(x1 - x2)平方 + (y1 - y2)平方]开平方 获取到p1到p2的距离.
        let R = (dx ** 2 + dy ** 2) ** 0.5

        // ratio比例.
        let ratio = dx === 0 ? undefined : dy / dx

        // angle角度. 
        let angle = 0
        if (ratio === undefined) {
            const p = Math.PI / 2
            angle = dy >= 0 ? p : -p
        } else {
            const t = Math.abs(dy / R)
            const sin = ratio >= 0 ? t : -t
            const asin = Math.asin(sin)
            angle = dx > 0 ? asin : asin + Math.PI
        }

        // 用三角函数, 根据起点x1, y1, 和 线R 以及R与水平线的夹角 计算 R上每一个像素点的坐标.
        // 要画的线长度为R, 即要画R个像素.
        // x坐标为 x1 + cos(夹角) * r
        // y坐标   y1 + sin(夹角) * r
        // 获取到x, y后, 画点. 
        // canvas的划线的方法应该一样. 

       
        for (let r = 0; r <= R; r++) {
            const x = x1 + Math.cos(angle) * r
            const y = y1 + Math.sin(angle) * r

            let factor = 0
            if (x2 != x1) {
                factor = (x - x1) / (x2 - x1);
            }
            let z = z1 + (z2 - z1) * factor
            this.drawPoint(GuaVector.new(x, y, z), color)
        }
    }

    // 计算v1, v2, 之间的过渡值为factor的点的颜色.
    getPointColor(v1, v2, factor) {

        if (v1.u) {
            let axeImage = this.mesh.axeImage
            var u = interpolate(v1.u, v2.u, factor)
            let v = interpolate(v1.v, v2.v, factor)

            let color = this.mesh.getColorFromAxeImage(u, v)
            return color
        } else {
            return v1.color.interpolate(v2.color, factor)
        }
        
        
    }

    // 这个是画两个顶点之间的线.
    // 这两个顶点处于同一水平线上. 也就是说, x不同, y相同.
    // 也就是在坐标为y的水平线上, 从 x1画到x2.  
    // 插值factor是 点在线上移动的比例.
    drawScanline(v1, v2) {
        let [a, b] = [v1, v2].sort((va, vb) => va.position.x - vb.position.x)
        let y = a.position.y
        let x1 = a.position.x
        let x2 = b.position.x
        let z1 = a.position.z
        let z2 = b.position.z

        if(this.mesh) {
             let axe3dImage = this.mesh.axeImage
        }
       
        // 从x1开始, 到x2停止. 
        for (let x = x1; x <= x2; x++) {
            let factor = 0
            if (x2 != x1) {
                factor = (x - x1) / (x2 - x1);
            }

            // let vectorF = a.interpolate(b, factor)
            let z = interpolate(z1, z2, factor)

            let color = this.getPointColor(a, b, factor)
            // let color = a.color.interpolate(b.color, factor)
                       // let color = a.color
            if(color.a == 0) {

            } else {
                this.drawPoint(GuaVector.new(x, y, z), color)
            }
            
        }
    }

     //画三角形
    drawTriangle1(v1, v2, v3) {
        let [a, b, c] = [v1, v2, v3].sort((va, vb) => va.position.y - vb.position.y)
        // log(a, b, c)
        let middle_factor = 0
        if (c.position.y - a.position.y != 0) {
            middle_factor = (b.position.y - a.position.y) / (c.position.y - a.position.y)
        }

        // 获取中间点M, M与b在同一条水平线上 即 y相同.
        let middle = a.interpolate(c, middle_factor)

        // 后面就是用 a的y开始, 到b的y结束. 中间画水平线. 用点的y计算插值, , 然后用插值计算三角形边上的两点, 画水平线. 
        // 直到把amb这个上半边的三角形填完.
        let start_y = a.position.y
        let end_y = b.position.y

        // 画abm
        for (let y = start_y; y <= end_y; y++) {
            let factor = 0
            if (end_y != start_y) {
                factor = (y - start_y) / (end_y - start_y)
            }
            let va = a.interpolate(middle, factor)
            let vb = a.interpolate(b, factor)
            // log(va.position, vb.position)
            this.drawScanline(va, vb)
        }

        // 画mbc
        start_y = b.position.y
        end_y = c.position.y
        for (let y = start_y; y <= end_y; y++) {
            let factor = 0
            if (end_y != start_y) {
                factor = (y - start_y) / (end_y - start_y)
            }
            let va = middle.interpolate(c, factor)
            let vb = b.interpolate(c, factor)
            // log(va.position, vb.position)
            this.drawScanline(va, vb)
        }

        /*
    首先 按照 y 对 三个顶点坐标 排序，注意 canvas中的坐标系是 y朝下

            let [a, b, c] = [v1, v2, v3].sort((va, vb) => va.position.y - vb.position.y)
     经过这样排序后，a就是我们看到的三角形 的最上面的那个顶点，也就是实际中y最小的那个点
     
     按照 知乎链接中，校长描述的，需要按照 b点 做一条 平行与 x轴 的直线，与 ac 的交点 记为m
     
     现在 三角形 分为了 abm 和 bmc
     
     首先 需要计算出m的坐标
     
     这里先计算出 m 在直线ac上的比值
     
     用 a 到 线段bm 的垂直距离 比上 a 到 c点的垂直举例 就是 m在线段 ac上的比值了
     
     也就是函数中的 middle_factor 计算过程
     
     知道了m的比值，就可以计算出 m的坐标了
     
             let middle = a.interpolate(c, middle_factor)
     这就是 从a点 到 c 点 的直线，知道了任意一点 m - am与ac的比值（也就是参数 middle_factor）计算出m的坐标
     
     接下来 就是 从 a点 不断 drawScaline 直到 bm 为止。
     其中 y不断+1
     y不断+1 我们就能 按照上面计算m的套路 不断计算出 每一次循环中 两个点的坐标
     其中一个点 是 直线 与 ab的 交点 另一个点 是 直线与 am的交点
     因为我们知道 现在的y是多少，我们就能知道 y 与 （a到直线bm的水平距离）总的y的比值，
     
     和计算m相同的套路，然后每次循环计算出 当前y 对应的 两个点的坐标
     
     当 上面 的循环结束后 我们画完了三角形的上半部分
     
     下半部分 和上半部分的套路是一模一样的
     
     忘了说颜色，颜色的套路 和上面的也是一模一样的
     */
    }

    //画三角形
    drawTriangle(v1, v2, v3) {
        let [a, b, c] = [v1, v2, v3].sort((va, vb) => va.position.y - vb.position.y)
        // log(a, b, c)
        let middle_factor = 0
        if (c.position.y - a.position.y != 0) {
            middle_factor = (b.position.y - a.position.y) / (c.position.y - a.position.y)
        }

        // 获取中间点M, M与b在同一条水平线上 即 y相同.
        let middle = a.interpolate(c, middle_factor)

        // 后面就是用 a的y开始, 到b的y结束. 中间画水平线. 用点的y计算插值, , 然后用插值计算三角形边上的两点, 画水平线. 
        // 直到把amb这个上半边的三角形填完.
        let start_y = a.position.y
        let end_y = b.position.y

        // 画abm
        for (let y = start_y; y <= end_y; y++) {
            let factor = 0
            if (end_y != start_y) {
                factor = (y - start_y) / (end_y - start_y)
            }
            let va = a.interpolate(middle, factor)
            let vb = a.interpolate(b, factor)
            // log(va.position, vb.position)
            this.drawScanline(va, vb)
        }

        // 画mbc
        start_y = b.position.y
        end_y = c.position.y
        for (let y = start_y; y <= end_y; y++) {
            let factor = 0
            if (end_y != start_y) {
                factor = (y - start_y) / (end_y - start_y)
            }
            let va = middle.interpolate(c, factor)
            let vb = b.interpolate(c, factor)
            // log(va.position, vb.position)
            this.drawScanline(va, vb)
        }

        /*
    首先 按照 y 对 三个顶点坐标 排序，注意 canvas中的坐标系是 y朝下

            let [a, b, c] = [v1, v2, v3].sort((va, vb) => va.position.y - vb.position.y)
     经过这样排序后，a就是我们看到的三角形 的最上面的那个顶点，也就是实际中y最小的那个点
     
     按照 知乎链接中，校长描述的，需要按照 b点 做一条 平行与 x轴 的直线，与 ac 的交点 记为m
     
     现在 三角形 分为了 abm 和 bmc
     
     首先 需要计算出m的坐标
     
     这里先计算出 m 在直线ac上的比值
     
     用 a 到 线段bm 的垂直距离 比上 a 到 c点的垂直举例 就是 m在线段 ac上的比值了
     
     也就是函数中的 middle_factor 计算过程
     
     知道了m的比值，就可以计算出 m的坐标了
     
             let middle = a.interpolate(c, middle_factor)
     这就是 从a点 到 c 点 的直线，知道了任意一点 m - am与ac的比值（也就是参数 middle_factor）计算出m的坐标
     
     接下来 就是 从 a点 不断 drawScaline 直到 bm 为止。
     其中 y不断+1
     y不断+1 我们就能 按照上面计算m的套路 不断计算出 每一次循环中 两个点的坐标
     其中一个点 是 直线 与 ab的 交点 另一个点 是 直线与 am的交点
     因为我们知道 现在的y是多少，我们就能知道 y 与 （a到直线bm的水平距离）总的y的比值，
     
     和计算m相同的套路，然后每次循环计算出 当前y 对应的 两个点的坐标
     
     当 上面 的循环结束后 我们画完了三角形的上半部分
     
     下半部分 和上半部分的套路是一模一样的
     
     忘了说颜色，颜色的套路 和上面的也是一模一样的
     */
    }
    // drawTriangleLine
    // coordVector是三维坐标系的 顶点, transformMatrix是完整版的矩阵.
    // 返回值是 计算后的 二维坐标系的 顶点. 
    project(coordVector, transformMatrix) {
        let {w, h} = this
        let [w2, h2] = [w/2, h/2]
        let point = transformMatrix.transform(coordVector.position)

        let scale_x = this.scale.x;
        let scale_y = this.scale.y;
        let scale_z = this.scale.z;

        let x = point.x * w2 * scale_x + w2
        let y = - point.y * h2 * scale_y + h2
        let z = - point.z * 1 * scale_z + 1

        let v = GuaVector.new(x, y, z)
        return GuaVertex.new(v, coordVector.color, coordVector.u, coordVector.v)
    }

    // 画模型
    drawMesh(mesh) {
        let self = this

        this.mesh = mesh

        // camera
        let {w, h} = this
        let {position, target, up} = self.camera
        const view = Matrix.lookAtLH(position, target, up)
        // field of view
        const projection = Matrix.perspectiveFovLH(0.8, w / h, 0.1, 1)

        // 得到 mesh 中点在世界中的坐标
        const rotation = Matrix.rotation(mesh.rotation)
        const translation = Matrix.translation(mesh.position)
        const world = rotation.multiply(translation)

        // transform就是最后的矩阵.
        const transform = world.multiply(view).multiply(projection)

        // indices三角形的数组
        for (let t of mesh.indices) {
            // 拿到三角形的三个顶点
            let [a, b, c] = t.map(i => mesh.triangles[i])
            // 拿到屏幕上的 3 个像素点
            let [v1, v2, v3] = [a, b, c].map(v => self.project(v, transform))
            // 把这个三角形画出来
            self.drawTriangle(v1, v2, v3)

            if(mesh.showLine) {
                self.drawLine(v1.position, v2.position)
                self.drawLine(v1.position, v3.position)
                self.drawLine(v2.position, v3.position)
            }
           
        }
    }
    __debug_draw_demo() {
        // 这是一个 demo 函数, 用来给你看看如何设置像素
        // ES6 新语法, 取出想要的属性并赋值给变量, 不懂自己搜「ES6 新语法」
        let {context, pixels} = this
        // 获取像素数据, data 是一个数组
        let data = pixels.data
        // 一个像素 4 字节, 分别表示 r g b a
        for (let i = 0; i < data.length; i += 4) {
            let [r, g, b, a] = data.slice(i, i + 4)
            r = 255
            a = 255
            data[i] = r
            data[i+3] = a
        }
        context.putImageData(pixels, 0, 0)

        /*
        var c=document.getElementById("myCanvas");
        var ctx=c.getContext("2d");
        ctx.fillStyle="red";
        ctx.fillRect(10,10,50,50);
        
        // 获取canvas上的像素数据. 参数(x, y, w, h)
        var imgData=ctx.getImageData(10,10,50,50);
       imgData的格式如下: 
       {
        height: 50,
        width: 50,
        data: [
            255, 0,0, 255,
            255, 0,0, 255,
            255, 0,0, 255,
            ......
            ]
        }
        imageData.data里的数据是, 50*50= 2500个像素点的数据. 
        每一个像素点, 按 rgba的顺序排列, 因为是红色, 所以前三个是 255, 0, 0 透明度不透明, 没有小数,记255. 
        2500个像素, 每一个像素4个数据. 一共10000个数据.

        imgData.data[1] =  255
        ctx.putImageData(imgData,10,10);
        使用putImageData之后, 会直接改变canvas上的像素颜色.
       
        */
    }
}
