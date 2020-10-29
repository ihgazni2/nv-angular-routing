const efdir = require("efdir")
const nvjson = require("nvjson")
const cmmn = require("./cmmn")

const SP = "@"
const INDENT = "    "

function creat_trim_tail_regexp(indent="    ") {
    let regex = new RegExp('['+indent+']+$','g')
    return(regex)
}

const DFLT_TRIM_TAIL_REGEXP = creat_trim_tail_regexp()


function fmt_cfg(cfg) {
    cfg = cfg.toLowerCase()
    cfg = cfg.replace(/\r\n/g,"\n")
    cfg = cfg.replace(/\r/g,"\n")
    cfg = cfg.replace(/[\n]+/g,"\n")
    cfg = cfg.replace(/^[\n]+/g,"")
    cfg = cfg.replace(/[\n]+$/g,"")
    return(cfg)
}


function tokenize_line(line,regexp=DFLT_TRIM_TAIL_REGEXP,indent="    ",sp="@") {
    line = line.replace(regexp,'')
    let arr = line.split(indent)
    let depth = arr.filter(r=>r==='').length
    let ele = arr.filter(r=>r!=='')[0]
    return({ele,depth})
}


function fmt_lines(lines,regexp=DFLT_TRIM_TAIL_REGEXP,indent="    ",sp="@") {
    lines = lines.map(r=>tokenize_line(r,regexp,indent,sp))
    let depths = lines.map(r=>r.depth)
    let min_depth = Math.min(...depths)
    lines.forEach(r=>{r.depth = r.depth - min_depth})
    lines.unshift({ele:"main@c",depth:0})
    return(lines)
}

function get_pls(lines) {
    let curr_pl = [lines[0].ele]
    let pls = [[lines[0].ele]]
    for(let i=1;i<lines.length;i++) {
        let prev = lines[i-1]
        let line = lines[i]
        let pl;
        if(line.depth > prev.depth) {
            pl = curr_pl.concat(line.ele)
            curr_pl = curr_pl.concat(line.ele)
        } else if(line.depth === prev.depth) {
            curr_pl.pop()
            pl = curr_pl.concat(line.ele)
            curr_pl = curr_pl.concat(line.ele)
        } else {
            let diff =  prev.depth - line.depth + 1
            Array.from({length:diff}).forEach(r=>{curr_pl.pop()}) 
            pl = curr_pl.concat(line.ele)
            curr_pl = curr_pl.concat(line.ele)
        }
        pls.push(pl)
    }
    return(pls)
}


function lines_to_dict(lines,regexp=DFLT_TRIM_TAIL_REGEXP,indent="    ",sp="@") {
    lines = fmt_lines(lines,regexp,indent,sp)
    pls = get_pls(lines)
    let d = {}
    pls.forEach(
        r=>nvjson.set_dflt_dict_via_pl(d,r,{})
    )
    return(d)
}


function cfg_to_dict(cfg,regexp=DFLT_TRIM_TAIL_REGEXP,indent="    ",sp="@") {
    cfg = fmt_cfg(cfg)
    let lines = cfg.split('\n')
    return(lines_to_dict(lines,regexp,indent,sp))
}


function cfgfn_to_dict(fn,regexp=DFLT_TRIM_TAIL_REGEXP,indent="    ",sp="@") {
    let cfg = efdir.rfile(fn)
    return(cfg_to_dict(cfg,regexp,indent,sp))
}


function dict_to_cfg(dict,indent="    ") {
    let entries = nvjson.flatten_to_entries(dict)
    entries = entries.map(r=>JSON.parse(r[0]))
    entries = entries.filter(r=>r.length>0)
    let lines = entries.map(r=>({
        depth:r.length,
        ele:r[r.length-1]
    }))
    let depths = lines.map(r=>r.depth)
    let min_depth = Math.min(...depths)
    lines = lines.map(r=>(indent.repeat(r.depth-min_depth)+r.ele))
    return(lines.join('\n'))
}

function fn_to_cfg(fn,indent="    ") {
    let d = efdir.rjson(fn)
    return(dict_to_cfg(dict,indent))
}

function load(fn,regexp=DFLT_TRIM_TAIL_REGEXP,indent="    ",sp="@") {
    try {
        return(efdir.rjson(fn))
    } catch(err) {
        return(cfgfn_to_dict(fn,regexp,indent,sp))
    }
}


module.exports = {
    creat_trim_tail_regexp,
    fmt_cfg,
    tokenize_line,
    fmt_lines,
    get_pls,
    lines_to_dict,
    cfg_to_dict,
    cfgfn_to_dict,
    dict_to_cfg,
    fn_to_cfg,
    load,
    SP,
    INDENT,
}
