const typ = require("@babel/types")
const _parse = require('@babel/parser').parse
const _gen = require('@babel/generator').default
const nvjson=require('nvjson')

function unparse(ast,decoratorsBeforeExport=true) {
    if(ast.type === "CommentLine"){
        return(ast.value)
    } else if(ast.type === "CommentBlock") {
        return(ast.value)
    } else if(ast.type === "TemplateElement") {
        return(ast.value.cooked)
    }  else {
        return(_gen(ast,{comments:true,decoratorsBeforeExport:decoratorsBeforeExport}).code)
    }
}


function parse(code_str,noloc=true,typ="typescript") {
    //typ="typescript" | "flow"
    let ast= _parse(code_str,{sourceType:'module',ranges:false,plugins:[typ,'decorators-legacy',"jsx","classProperties"]})
    if(noloc){
        let tree = nvjson.jobj2tree(ast)
        let sdfs = tree.$sdfs()
        sdfs.forEach(
            r=>{
                try {
                    delete r.val.loc
                    delete r.val.start
                    delete r.val.end
                } catch(err) {
                }
            }
        )
        let nast = tree.val
        return(nast.program)
    } else {
        return(ast.program)
    }
}




//


function creat_one_import_declaration(imported,source) {
    let local = typ.Identifier(imported)
    imported = typ.Identifier(imported)
    let specifiers = [typ.ImportSpecifier(local,imported)]
    source = typ.StringLiteral(source)
    return(typ.ImportDeclaration(specifiers,source))
}

function insert_import_declarations(ast,...arr) {
    let index = ast.body.findIndex(r=>r.type!=='ImportDeclaration')
    arr = arr.map(r=>creat_one_import_declaration(r.clsname,r.rel_to_pmod_import_src))
    ast.body.splice(index,0,...arr)
    return(ast)
}

function rm_routes(t) {
    let routes = t.body.filter(r=>(r.type==='VariableDeclaration') &&(r.kind==='const') && (r.declarations[0].id.name==='routes'))[0];
    let index = t.body.indexOf(routes);
    t.body.splice(index,1)
    return(t)
}

function insert_routes_with_cd(ast,routes) {
    let t = parse(routes)
    t = t.body[0]
    let index = ast.body.findIndex(r=>r.type!=='ImportDeclaration')
    ast.body.splice(index,1,t)
    return(ast)
}


function insert_declarations(ast,...clses) {
    let tree = nvjson.jobj2tree(ast)
    let sdfs = tree.$sdfs()
    sdfs = sdfs.filter(r=>r.val!==undefined)
    sdfs = sdfs.filter(r=>r.val!==null)
    sdfs = sdfs.filter(r=>r.val.type==="ObjectProperty")
    sdfs = sdfs.filter(r=>r.val.key.name==='declarations')
    let nd = sdfs[0].val
    nd.value.elements = nd.value.elements.concat(clses.map(r=>typ.identifier(r)))
    return(ast)
}

function insert_components(ast,...arr) {
    ast = insert_import_declarations(ast,...arr)
    ast = insert_declarations(ast,...arr.map(r=>r.clsname))
    return(ast)
}

module.exports = {
    parse,
    unparse,
    insert_import_declarations,
    insert_components,
    rm_routes,
    insert_routes_with_cd,
}
