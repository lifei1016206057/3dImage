class GuaVertex extends GuaObject {
    // 表示顶点的类, 包含 GuaVector 和 GuaColor
    // 表示了一个坐标和一个颜色
    constructor(position, color, u, v) {
        super()
        this.position = position
        this.color = color
        this.u = u
        this.v = v
    }
    interpolate(other, factor) {
        let a = this
        let b = other
        let p = a.position.interpolate(b.position, factor)
        let c = a.color.interpolate(b.color, factor)
        let u = interpolate(a.u, b.u, factor)
        let v = interpolate(a.v, b.v, factor)
        return GuaVertex.new(p, c, u, v)
    }

    // vertices是 GuaVertex的数组, 判断数组里是否有和this坐标一样的元素.
    // 如果有返回index, 没有返回 -1
    indexOfVertices(vertices) {
        var res = -1
        let p = this.position
        vertices.forEach(function(v, i){
            if (v.position.isEqual(p)) {
                res = i
            }
        })
        return res;
    }
}
