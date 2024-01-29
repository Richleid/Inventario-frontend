export const ArrayKardexOrdenado = (productosComprados = [], productosVendidos = [], detalles = [], Orden = 1) => {
    const ArrayKardex = [].concat(productosComprados, productosVendidos, detalles)
    if (Orden === 0) {
        ArrayKardex.sort((a,b)=>{
            const dateA = new Date(a.fecha)
            const dateB = new Date(b.fecha)
            return dateA.getTime()-dateB.getTime()
        })
    } else {
        ArrayKardex.sort((a,b)=>{
            const dateA = new Date(a.fecha)
            const dateB = new Date(b.fecha)
            return dateB.getTime()-dateA.getTime()
        })
    }
    return ArrayKardex
}
