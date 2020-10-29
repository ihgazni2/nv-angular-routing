const TYPE_MD = {
    module:"m",
    component:"c",
    service:"s",
    directive:"d",
    pipe:"p",
    m:"module",
    c:"component",
    s:"service",
    d:"directive",
    p:"pipe"
}



function upper_initial(s) {
    s = s[0].toUpperCase()+s.substr(1)
    return(s)
}

function creat_angular_cls_name(basename,type){
    let arr = basename.split('-')
    arr = arr.map(
        r=> upper_initial(r)
    )
    return(arr.join("")+upper_initial(type))
}


module.exports = {
    TYPE_MD,
    upper_initial,
    creat_angular_cls_name
}

