const ast = require("./ast")
const vfs = require("./vfs")
const efdir = require("efdir")
const fs = require("fs")
const punpcfg = require('./punpcfg')

const ROUTES_REPLACER =`/*__@#$replacer$#@__*/`



function init_root_module(rt) {
    let tem =`
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
`
    return(ast.parse(tem))
}

function creat_module(r,f) {
    let t = f(r)
    let deses = vfs.get_all_des_components(r)
    t = ast.insert_components(t,...deses)
    return(ast.unparse(t))
}


function creat_root_module(rt) {return(creat_module(rt,init_root_module))}

function creat_and_write_root_module(rt) {
    let app_mod = creat_root_module(rt)
    efdir.wfile(rt.rel_ts_path,app_mod)
}



function init_nonroot_module(nd) {
    let tem = `
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ${nd.routing.clsname} } from '${nd.routing.rel_to_pmod_import_src}';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ${nd.routing.clsname}
  ]
})
export class ${nd.clsname} { }
`
    return(ast.parse(tem))
}

function creat_nonroot_module(nd) {return(creat_module(nd,init_nonroot_module))}

function creat_and_write_nonroot_module(r) {
    fs.mkdirSync(r.rel_dir_path);
    let mod = creat_nonroot_module(r);
    efdir.wfile(r.rel_ts_path,mod)
}

////

function creat_component_css(r){
    return('')
}

function creat_component_html(nd) {
    return(`<p>${nd.name} works!</p>`)
}

function creat_main_component_html(r) {
    let s = ""
    let sdfs = r.$root().$sdfs()
    let arr = sdfs.slice(1).filter(r=>r.type==="component")
    arr = arr.map(
        r => {
            let ances = r.$ances(true)
            ances = ances.map(r=>r.name)
            ances.reverse()
            ances = ances.slice(1)
            let link = "/"+ances.join('/')
            let txt = `<div><a routerLink="${link}">${link}</a></div>`
            return(txt)
        }
    )
    let html = `\n<p>CHECK YOUR ROUTE LINK</p>\n`
    html = html + arr.join('\n')
    return(html)
}


function creat_component_ts(nd) {
    let tem = `
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-${nd.name}',
  templateUrl: './${nd.name}.component.html',
  styleUrls: ['./${nd.name}.component.css']
})
export class ${nd.clsname} implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
`
    return(tem)
}


function creat_component_spec_ts(nd) {
    let tem = `
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ${nd.clsname} } from './${nd.name}.component';

describe('${nd.clsname}', () => {
  let component: ${nd.clsname};
  let fixture: ComponentFixture<${nd.clsname}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ${nd.clsname} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(${nd.clsname});
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
`
    return(tem)
}


function creat_and_write_component(r) {
    fs.mkdirSync(r.rel_dir_path);
    if(r.name === "main") {
         efdir.wfile(r.rel_html_path,creat_main_component_html(r));
    } else {
        efdir.wfile(r.rel_html_path,creat_component_html(r));
    }
    efdir.wfile(r.rel_css_path,creat_component_css(r));
    efdir.wfile(r.rel_ts_path,creat_component_ts(r));
    efdir.wfile(r.rel_spec_ts_path,creat_component_spec_ts(r));
}


function creat_app_html(r) {
    let html =`<router-outlet></router-outlet>`
    return(html)
}

function creat_app_spec_ts(r,title=`proj`) {
    let tem = `
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '${title}';
}
@#cat app.component.spec.ts
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(\`should have as title '${title}'\`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('${title}');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('${title} app is running!');
  });
});
`
    return(tem)
}

function creat_app_css(r) {return(``) }

function creat_app_ts(r,title='proj') {
    let tem=`import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = ${title};
}
`
    return(tem)
}

function creat_and_write_app_component(r) {
    //currently only rewrite html 
    efdir.wfile('./app.component.html',creat_app_html(r));
    //efdir.wfile('./app.component.css',creat_app_css(r));
    //efdir.wfile('./app.omponent.ts',creat_app_ts(r));
    //efdir.wfile('./app.component.spec.ts',creat_app_spec_ts(r));
}


////////

function init_routing_module(r) {
    let tem = `
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [];
${ROUTES_REPLACER};


@NgModule({
  imports: [RouterModule.${r.routing.type}(routes)],
  exports: [RouterModule]
})
export class ${r.routing.clsname} { }
`
    return(ast.parse(tem))
}

////
//
//

function creat_load_children(nd) {
    if(nd.type === "module") {
        let tem = `() => import('${nd.rel_to_pmod_import_src}').then(m => m.${nd.clsname})`
        return(tem)
    }
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
            r=>{
                let rslt = guids.includes(r.$guid)?r:undefined
                return(rslt)
            }
        )
        return(sedfs)
    } else {
        return([])
    }
}

function is_open_nd(r,i) {return(i === r.$open_at)}
function is_close_nd(r,i) {return(i === r.$close_at)}

function creat_routes(r,lyr=1) {
    let sedfs = get_sedfs_of_routing_mod(r)
    let arr = []
    let indent = "    "
    for(let i =0;i<sedfs.length;i++) {
        let r = sedfs[i]
        if( r === undefined) {
        } else {
            let cond = is_open_nd(r,i)
            if(cond) {
                let sblk = indent.repeat(lyr) + "{\n";
                arr.push(sblk)
                let path = indent.repeat(lyr+1) +"path: '"+r.name +"',\n";
                arr.push(path)
                let data = indent.repeat(lyr+1) + "data: {},\n";
                arr.push(data)
                if(r.type === "module") {
                    let lc = creat_load_children(r)
                    lc = indent.repeat(lyr+1) +"loadChildren: " + lc + '\n'
                    arr.push(lc)
                } else {
                    let com = indent.repeat(lyr+1) +"component: '"+r.clsname +"',\n";
                    arr.push(com)
                    let sbracket = indent.repeat(lyr+1) + "children: [\n";
                    arr.push(sbracket)
                    lyr = lyr + 1
                }
                lyr = lyr + 1
            } else {
                lyr = lyr - 1
                if(r.type === "module") {
                } else {
                    let ebracket = indent.repeat(lyr) + "]\n";
                    arr.push(ebracket)
                    lyr = lyr - 1
                }
                let eblk = indent.repeat(lyr) + "},\n";
                arr.push(eblk)
            }
        }
    }
    return(arr.join(''))
}

function rm_tail_comma(s) {
    let ns = Array.from(s)
    let c = 0
    let prev_comma_seq = undefined
    while(c<s.length) {
        if(prev_comma_seq === undefined) {
            if(s[c] === ',') {
                prev_comma_seq = c
            } else {
            }
        } else {
            let cond = (s[c] === ']') || (s[c] === '}')
            if(cond) {
                ns[prev_comma_seq]='';
                prev_comma_seq = undefined
            } else if((s[c] === ' ') || (s[c] === '\n')) {
            } else {
                prev_comma_seq = undefined
            }
        }
        c = c + 1
    }
    if(prev_comma_seq !== undefined) {ns[prev_comma_seq]=''} else {}
    return(ns.join('').replace(/[\n]+$/g,''))
}


function creat_root_routes(r) {
    let head = `const routes: Routes = [\n`
    let main =`    {
        path:'',
        data:{},
        component:'MainComponent'
    },\n`
    let body = creat_routes(r)
    let tail = `]\n`
    let tem =(head + main + body + tail)
    return(rm_tail_comma(tem))
}

function creat_nonroot_routes(r) {
    let head = `const routes: Routes = [\n`
    let body = creat_routes(r)
    let tail = `]\n`
    let tem = (head + body + tail)
    return(rm_tail_comma(tem))
}


function insert_to_routing_module(t,r,routes) {
    let deses = vfs.get_all_des_components(r)
    t = ast.insert_import_declarations(t,...deses)
    t = ast.rm_routes(t)
    //t = ast.insert_routes_with_cd(t,routes)
    return(t)
}

function creat_routing_module(r,f) {
    let t = init_routing_module(r)
    let routes =  f(r)
    t =  insert_to_routing_module(t,r,routes)
    let s = ast.unparse(t)
    // the babel generator format is not good
    s = s.replace(ROUTES_REPLACER,routes)
    return(s)
}


function creat_root_routing_module(r) {return(creat_routing_module(r,creat_root_routes))}

function creat_nonroot_routing_module(r) {return(creat_routing_module(r,creat_nonroot_routes))}

function creat_and_write_root_routing_module(r) {
    fs.mkdirSync("routes");
    let app_routing_mod = creat_root_routing_module(r)
    efdir.wfile(r.routing.rel_ts_path,app_routing_mod)
}

function creat_and_write_nonroot_routing_module(r) {
    fs.mkdirSync(r.rel_dir_path+"/routes");
    let routing_mod = creat_nonroot_routing_module(r)
    efdir.wfile(r.routing.rel_ts_path,routing_mod)
}

///////
function write_all(cfg) {
    //
    fs.mkdirSync("./_cfg-srv")
    efdir.wfile("./_cfg-srv/cfg",cfg)
    efdir.wjson("./_cfg-srv/cfg.json",punpcfg.cfg_to_dict(cfg))
    //
    let sdfs = vfs.init_vfs_with_cfg(cfg)
    efdir.wfile("./_cfg-srv/flat-brief.json",JSON.stringify(sdfs))
    let droutes = sdfs.filter(r=>r.type==='component').map(r=>r.rel_dir_path).map(r=>r.substr(1))
    efdir.wjson("./_cfg-srv/dir-routes.json",droutes)
    let aroutes = droutes.map(r=>r.split('/').slice(1))
    efdir.wjson("./_cfg-srv/array-routes.json",aroutes)
    /////
    let rt = sdfs[0]
    efdir.wjson('./_cfg-srv/flat-detail.json',rt.$dump())
    efdir.wjson('./_cfg-srv/nest-detail.json',rt.$nest_dict())
    ////
    creat_and_write_root_module(rt)
    creat_and_write_app_component(rt);
    creat_and_write_root_routing_module(rt)
    sdfs.slice(1).forEach(
        r=>{
            if(r.type === "module"){
                creat_and_write_nonroot_module(r);
                creat_and_write_nonroot_routing_module(r)
            } else {
                creat_and_write_component(r);
            }
        }
    )
}
///////

module.exports = {
    init_root_module,
    creat_root_module,
    creat_and_write_root_module,
    ////
    init_nonroot_module,
    creat_nonroot_module,
    creat_and_write_nonroot_module,
    ////
    creat_and_write_app_component,
    creat_and_write_component,
    ////
    init_routing_module,
    rm_tail_comma,
    creat_load_children,
    get_des_guids_of_routing_mod,
    get_sedfs_of_routing_mod,
    is_open_nd,
    is_close_nd,
    creat_routes,  
    creat_routing_module,
    ////
    creat_root_routes,
    creat_root_routing_module,
    creat_and_write_root_routing_module,
    ////
    creat_nonroot_routes,
    creat_nonroot_routing_module,
    creat_and_write_nonroot_routing_module,
    ////
    write_all,
}


