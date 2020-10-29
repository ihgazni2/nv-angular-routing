const path = require("path")
const cmmn = require("./cmmn")
const nvjson = require("nvjson")
const punp = require('./punpcfg')

function get_import_src_basename(r) {
    let name = r.name
    let type = r.type
    name = name+'.'+type
    return(name)
}

function get_pmod_index(ances) {
    let index;
    for(let i=1;i<ances.length;i++) {
        let cond = ances[i].type === "module"
        if(cond) {index = i;break;}
    }
    return(index)
}

function get_rel_path(ances) {
    let rel_path = ances.map(
        (r,i)=> {
            if(r.type === "module" && i!==0) {
                return(["routes",r.name])
            } else {
                return(r.name)
            }
        }
    )
    rel_path = rel_path.flat()
    rel_path.reverse()
    rel_path[0] = "."
    return(rel_path)
}

function set_rel_dir_path(ances,nd) {
    let rel_path = get_rel_path(ances)
    let rel_dir_path = './'+path.join(...rel_path)
    nd.rel_dir_path = rel_dir_path
}

function set_rel_ts_path(ances,nd) {
    let rel_path = get_rel_path(ances)
    //rel_path = rel_path.slice(0,rel_path.length)
    rel_path.push(get_import_src_basename(nd))
    nd.rel_ts_path = './'+path.join(...rel_path) +".ts"
    if(nd.type === "component") {
        nd.rel_css_path = './'+path.join(...rel_path) +".css"
        nd.rel_html_path = './'+path.join(...rel_path) +".html"
        nd.rel_spec_ts_path = './'+path.join(...rel_path) +".spec.ts"
    } else {
    }
}

function set_rel(nd) {
    let ances = nd.$ances(true);
    set_rel_dir_path(ances,nd);
    set_rel_ts_path(ances,nd);
    let lngth = ances.length
    let index = get_pmod_index(ances)
    nd.pmod_index = index
    let pl =[]
    if(index === undefined) {
    } else {
        ances = ances.slice(0,index)
        pl = ances.map(
            (r,i)=> {
                if(r.type === "module" && i!==0) {
                    return(["routes",r.name])
                } else {
                    return(r.name)
                }
            }
        )
        pl = pl.flat()
        pl.reverse()
    }
    pl.unshift(".")
    let import_src_basename = get_import_src_basename(nd)
    pl.push(import_src_basename)
    nd.rel_to_pmod_import_src = './routes/'+path.join(...pl)
}

function set_module_routing(nd) {
    nd.routing = {}
    nd.routing.name = nd.name + "-routing"
    nd.routing.rel_dir_path = nd.rel_dir_path
    nd.routing.rel_ts_path = nd.rel_dir_path + '/'+nd.routing.name +'.module.ts'
    nd.routing.rel_to_pmod_import_src = "./" + nd.routing.name + ".module"
    nd.routing.rel_regis_dst = nd.rel_ts_path
    nd.routing.clsname = cmmn.upper_initial(nd.name) + "RoutingModule"
    nd.routing.type = "forChild"
}


function set_rel_regis_dst(nd) {
    let ances = nd.$ances(true)
    let index = nd.pmod_index
    delete nd.pmod_index
    let pmod = ances[index]
    nd.rel_regis_dst = pmod.routing.rel_ts_path
}



function init_root(sdfs) {
    //以app 所在 文件夹为根
    sdfs[0].type = "module"
    sdfs[0].name = "app"
    sdfs[0].rel_dir_path = "./"               //自己的文件夹相对路径
    sdfs[0].rel_ts_path = "./app.module.ts"   //自己的ts文件相对路径
    sdfs[0].rel_to_pmod_import_src = null    //向直接parent 模块 注册时候的导入 相对 路径
    sdfs[0].rel_regis_dst = null             //pmod 的相对路径
    sdfs[0].clsname = "AppModule"            //module 里面只需要插入import { AppRoutingModule } from './app-routing.module';
                                             //然后 @NgModule imports 里插入AppRoutingModule
    
    //routing module 的注册对象永远是 同级的 module
    sdfs[0].routing = {                       
        name:"app-routing",
        rel_dir_path : "./",
        rel_ts_path:"./app-routing.module.ts",
        rel_to_pmod_import_src:"./app-routing.module",
        rel_regis_dst:"./app.module.ts",
        clsname:"AppRoutingModule",
        type:"forRoot",                     //forRoot forChild
    }
}


function init_nonroot(sdfs) {
    for(let i=1;i<sdfs.length;i++) {
        let r = sdfs[i]
        let arr = r.key.split(punp.SP)
        r.type = (arr.length>1)?cmmn.TYPE_MD[arr[1]]:'component'
        r.name = arr[0]
        r.clsname = cmmn.creat_angular_cls_name(r.name,r.type)
    }
    
    for(let i=1;i<sdfs.length;i++) {
        let r = sdfs[i]
        set_rel(r)
    }
    
    for(let i=1;i<sdfs.length;i++) {
        let r = sdfs[i]
        if(r.type === "module") {
            set_module_routing(r)
        }
    }
    
    for(let i=1;i<sdfs.length;i++) {
        let r = sdfs[i]
        set_rel_regis_dst(r)
    }
}


function init_vfs_with_cfg(cfg) {
    let d = punp.cfg_to_dict(cfg)
    let tree = nvjson.jobj2tree(d)
    let sdfs = tree.$sdfs()
    init_root(sdfs)
    init_nonroot(sdfs)
    return(sdfs)
}

////
function get_all_des_components(nd) {
    //module 模块需要
    //module-routing 模块需要
    if(nd.type !== "module") {return([])}
    let rel_ts_path = nd.routing.rel_ts_path
    let deses = nd.$sdfs().filter(r=>r.rel_regis_dst === rel_ts_path)
    deses = deses.filter(r=>r.type === 'component')
    return(deses)
}

function get_all_des_modules(nd) {
    ///module-routing 模块需要
    if(nd.type !== "module") {return([])}
    let rel_ts_path = nd.routing.rel_ts_path
    let deses = nd.$sdfs().filter(r=>r.rel_regis_dst === rel_ts_path)
    deses = deses.filter(r=>r.type === 'module')
    return(deses)
}

function get_des_guids_of_routing_mod(nd){
    if(nd.type === "module") {
        let rel_ts_path = nd.routing.rel_ts_path
        let deses = nd.$sdfs().filter(r=>r.rel_regis_dst === rel_ts_path)
        let guids = deses.map(r=>r.$guid)
        return(guids)
    } else {
        return([])
    }
}

function get_sedfs_of_routing_mod(nd){
    if(nd.type === "module") {
        let sedfs = nd.$sedfs()
        let guids = get_des_guids_of_routing_mod(nd)
        sedfs = sedfs.map(
            (r,i)=>{
                let cond = guids.includes(r.$guid)
                if(cond) {
                    return(r)
                } else {undefined}
            }
        )
        return(sedfs)
    } else {
        return([])
    }
}


module.exports  = {
    init_vfs_with_cfg,
    get_all_des_components,
    get_all_des_modules,
    get_sedfs_of_routing_mod,
}
