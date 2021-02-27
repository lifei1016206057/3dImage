class GuaVector extends GuaObject {
    // 表示三维方向的类. 向量; 
    // 有x,y,z三个方向;
    constructor(x, y, z) {
        super()
        this.x = x
        this.y = y
        this.z = z
    }

    isEqual(v) {
        if( v &&this.x == v.x && this.y == v.y && this.z == v.z) {
            return true
        } else {
            return false
        }
    }

    // 计算插值;
    interpolate(other, factor) {
        let p1 = this
        let p2 = other
        let x = p1.x + (p2.x - p1.x) * factor
        let y = p1.y + (p2.y - p1.y) * factor
        let z = p1.z + (p2.z - p1.z) * factor
        return GuaVector.new(x, y, z)
    }

    // 返回字符串格式: '1.22. 3.44 5.66'
    toString() {
        let s = ''
        s += this.x.toFixed(3)
        s += this.y.toFixed(3)
        s += this.z.toFixed(3)
        return s
    }

    // 向量乘以 n 倍;返回一个新的向量;
    multi_num(n) {
        return GuaVector.new(this.x * n, this.y * n, this.z * n)
    }

    // 子向量, 当前向量-参数向量 = 子向量;
    sub(v) {
        let x = this.x - v.x
        let y = this.y - v.y
        let z = this.z - v.z
        return GuaVector.new(x, y, z)
    }

    // Math.sqrt(num) 返回num的平方根.
    // 一般根据勾股定理来计算 斜边长 . 即 c = Math.sqrt(a*a + b*b). c就是斜边长(a*a + b*b = c*c)
    // 这里用来获取正方体的对角顶点斜边长度;
    // 也就是向量的长度(向量包括长度和方向) 这里返回的是向量的长度;
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }

    //这里是将向量长度变成1. 方向不变.可以认为是当前向量的单位. 返回一个长度为1的向量.  即当前向量的一个单位. 
    normalize() {

        //l 正方体的对角顶点斜边长;
        let l = this.length()
        if (l == 0) {
            return this
        }
        let factor = 1 / l

        return this.multi_num(factor)
    }

    // 向量点积. 表示一个向量在另一个向量的投影面积,
    //  在数值上等于这两个向量组成的平行四边形的面积
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z
    }

    // 向量叉积. 返回一个新的向量, 当前向量和v向量的叉积,
    //  方向上 和 当前向量 与v向量 组成的平面 相垂直
    //  值上 为. 当前向量 和 v向量 做组成的三角形的面积;
    cross(v) {
        let x = this.y * v.z - this.z * v.y
        let y = this.z * v.x - this.x * v.z
        let z = this.x * v.y - this.y * v.x
        return GuaVector.new(x, y, z)
    }


    // 当前向量到p向量之间的距离.
    positionLength(p) {
        var x = this.x - p.x
        var y = this.y - p.y
        var z = this.z - p.z
        return Math.sqrt(x * x + y * y + z * z)
    }
}
