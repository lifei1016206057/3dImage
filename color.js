class GuaColor extends GuaObject {
    // 表示颜色的类
    constructor(r, g, b, a) {
        super()
        this.r = r
        this.g = g
        this.b = b
        this.a = a
    }

    // 将16禁止颜色值 #fg23ef 转换成rgba数值,生成颜色对象;
    static newHex(hex) {
        hex = hex.replace('#', '')
        let r = parseInt(hex.substring(0, 2), 16)
        let g = parseInt(hex.substring(2, 4), 16)
        let b = parseInt(hex.substring(4, 6), 16)
        let a = 255
        return this.new(r, g, b, a)
    }

    // 颜色的插值.
    // 插值 计算 this 和 other 之间状态的值, 就是从this 到other之间的过渡状态的值, 
    // factor 因子 过渡的比例, 
    //TODO:  factor 过渡的比例, 比如this是0, other是10. 现在要从0过渡到10,那么第一个点的factor比例就是0.1. 
    // 第二个factor是0.2, 一直到1. 表示过渡的进度. 
    
    // 插值是指 一个坐标点, 到另一个坐标点的 线上的插值. 这个factor就是这个点在这条线上的比例.
    // 比如 一条线长5, 那就是要画5个点. 画到了第三个点. factor就是 3/5 = 0.6 
    interpolate(other, factor) {
        let c1 = this
        let c2 = other
        let r = c1.r + (c2.r - c1.r) * factor
        let g = c1.g + (c2.g - c1.g) * factor
        let b = c1.b + (c2.b - c1.b) * factor
        let a = c1.a + (c2.a - c1.a) * factor
        return GuaColor.new(r, g, b, a)

        // this 1, other 5, factor0.5  1+4*0.5  
    }

    // this 和 c 的颜色是否相同
    equal(c) {
        if (this.r === c.r && this.g === c.g && this.b === c.b && this.a === c.a) {
            return true
        }
        return false
    }
    // 随机颜色
    static randomColor() {
        // random01 是 utils.js 中的函数
        return this.new(random01(255), random01(255), random01(255), 255)
    }
    // 常见的几个颜色
    static black() {    // 黑色
        return this.new(0, 0, 0, 255)
    }
    static white() {    // 白色
        return this.new(255, 255, 255, 255)
    }
    static transparent() {  // 透明色
        return this.new(0, 0, 0, 0)
    }
    static red() {  // 红色
        return this.new(255, 0, 0, 255)
    }
    static green() {    //绿色
        return this.new(0, 255, 0, 255)
    }
    static blue() {     // 蓝色;
        return this.new(0, 0, 255, 255)
    }
}
