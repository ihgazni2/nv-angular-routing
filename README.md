nv-angular-routing
==================

-   generate all-files-and-routing in a new angular-project based-on a simple config
-   cli tool, NO need to included the codes in your angualar project,
    just use it to generate

install
=======

-   npm install nv-angular-routing -g

usage
=====

brief
-------

-   npm install nv-angular-routing -g
-   init a new project:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    ng new proj            
-   goto the app dir:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      cd proj/src/app/ 
-   edit a simple config:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  vim cfg    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   see [config\_format](#config\_format) 
-   just-one-command: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;     nv\_ngroute\_init --cfg ./cfg

config\_format
--------------

    Usage: init [options]

    Options:
      -V, --version  output the version number
      --cfg <cfg>    cfg file path,
          the cfg is a text to list your project-dirnames with the following format,such as:
              --------------------------------------------------------------------
                  yourdir
                      yourdir
                          yourdir
                      yourdir
                          yourdir
                  yourdir
                      yourdir
                      yourdir
              --------------------------------------------------------------------
          restrict:
              - in yourdir-name,only lower-case and "-" permited
              - the indent must be 4 spaces "    "
              - the suffix @c  means component
              - the suffix @m  means module
              - if skip @ at tail, default is @c
              - a main component for entrance will be AUTO added ignore your config at the first line
              - each @c component will register-to the nearest parent module
              - for each @m  module a lazy-loading loadChildren route will be created
          example:
              ---------------------------------------------------------------------
                  dashboard@c
                  profile@c
                      overview@c
                      settings@c
                  design@m
                      colors@c
                      icons@c
                  forms@m
                      dynamic@c
                      static@c
                  material@m
                      slider@m
                          slider-basic@c
                          slide-toggle@c
                      progress@m
                          progress-bar@c
                          progress-spinner@c
                  sessions@c
                      register@m
                          github-regis@c
                          email-regis@c
                          wx-regis@c
                      login@m
                          github-login@c
                          email-login@c
                          wx-login@c
              ---------------------------------------------------------------------
       (default: "./cfg")
      -h, --help     display help for command


step
----

    @# npm install nv-angular-routing -g
    @# ng new proj
    ? Would you like to add Angular routing? Yes
    @# vim all-com.cfg
    
    --------------------------------------------------------------------------------
    dashboard
    profile
        overview
        settings
    design
        colors
        icons
    forms
        dynamic
        static
    material
        slider
            slider-basic
            slide-toggle
        progress
            progress-bar
            progress-spinner
    sessions
        register
            github-regis
            email-regis
            wx-regis
        login
            github-login
            email-login
            wx-login
    --------------------------------------------------------------------------------

    @# nv_ngroute_init --cfg ./all-com.cfg


result
------

    @#ls -l
    total 36
    -rw-r--r-- 1 root root  328 Oct 29 17:32 all-com.cfg
    -rw-r--r-- 1 root root    0 Oct 29 16:56 app.component.css
    -rw-r--r-- 1 root root   31 Oct 29 17:33 app.component.html
    -rw-r--r-- 1 root root  936 Oct 29 16:56 app.component.spec.ts
    -rw-r--r-- 1 root root  208 Oct 29 16:56 app.component.ts
    -rw-r--r-- 1 root root 2999 Oct 29 17:33 app.module.ts
    -rw-r--r-- 1 root root 7511 Oct 29 17:33 app-routing.module.ts
    drwxr-xr-x 2 root root 4096 Oct 29 17:33 _cfg-srv
    drwxr-xr-x 9 root root 4096 Oct 29 17:33 routes
    @#    

    @#tree routes/ | egrep -v "css|html|spec"
    routes/
    ├── dashboard
    │   └── dashboard.component.ts
    ├── design
    │   ├── colors
    │   │   └── colors.component.ts
    │   ├── design.component.ts
    │   └── icons
    │       └── icons.component.ts
    ├── forms
    │   ├── dynamic
    │   │   └── dynamic.component.ts
    │   ├── forms.component.ts
    │   └── static
    │       └── static.component.ts
    ├── main
    │   └── main.component.ts
    ├── material
    │   ├── material.component.ts
    │   ├── progress
    │   │   ├── progress-bar
    │   │   │   └── progress-bar.component.ts
    │   │   ├── progress.component.ts
    │   │   └── progress-spinner
    │   │       └── progress-spinner.component.ts
    │   └── slider
    │       ├── slider-basic
    │       │   └── slider-basic.component.ts
    │       ├── slider.component.ts
    │       └── slide-toggle
    │           └── slide-toggle.component.ts
    ├── profile
    │   ├── overview
    │   │   └── overview.component.ts
    │   ├── profile.component.ts
    │   └── settings
    │       └── settings.component.ts
    └── sessions
        ├── login
        │   ├── email-login
        │   │   └── email-login.component.ts
        │   ├── github-login
        │   │   └── github-login.component.ts
        │   ├── login.component.ts
        │   └── wx-login
        │       └── wx.component.ts
        ├── register
        │   ├── email-regis
        │   │   └── email-regis.component.ts
        │   ├── github-regis
        │   │   └── github-regis.component.ts
        │   ├── register.component.ts
        │   └── wx-regis
        │       └── wx-regis.component.ts
        └── sessions.component.ts
    
    27 directories, 108 files


generated-routing
-----------------

    @# vim app-routing.module.ts
    
    import { NgModule } from '@angular/core';
    import { Routes, RouterModule } from '@angular/router';
    import { MainComponent } from "./routes/main/main.component";
    import { DashboardComponent } from "./routes/dashboard/dashboard.component";
    import { ProfileComponent } from "./routes/profile/profile.component";
    import { OverviewComponent } from "./routes/profile/overview/overview.component";
    ...
    import { EmailComponent } from "./routes/sessions/login/email/email.component";
    import { WxComponent } from "./routes/sessions/login/wx/wx.component";
    
    const routes: Routes = [
        {
            path:'',
            data:{},
            component:'MainComponent'
        },
        {
            path: 'main',
            data: {},
            component: 'MainComponent',
            children: [
            ]
        },
    ...
    {
        path: 'design',
        data: {},
        component: 'DesignComponent',
        children: [
            {
                path: 'colors',
                data: {},
                component: 'ColorsComponent',
                children: [
                ]
            },
            {
                path: 'icons',
                data: {},
                component: 'IconsComponent',
                children: [
                ]
            }
        ]
    },
    ...
    ]
    ;
    @NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
    })
    export class AppRoutingModule {}    

generated main html
-------------------
    
    @# vim routes/main/main.component.html

    ...
    <div><a routerLink="/main">/main</a></div>
    ...
    <div><a routerLink="/sessions/login/wx">/sessions/login/wx</a></div>
    ...

other
-----
    - some json will be generated in ./cfg-srv
    - you can DELETE them and the cfg file after generate

    @#ls -l _cfg-srv/
    total 80
    -rw-r--r-- 1 root root  1063 Oct 29 17:33 array-routes.json
    -rw-r--r-- 1 root root   328 Oct 29 17:33 cfg
    -rw-r--r-- 1 root root   686 Oct 29 17:33 cfg.json
    -rw-r--r-- 1 root root   755 Oct 29 17:33 dir-routes.json
    -rw-r--r-- 1 root root 15017 Oct 29 17:33 flat-brief.json
    -rw-r--r-- 1 root root 24571 Oct 29 17:33 flat-detail.json
    -rw-r--r-- 1 root root 23762 Oct 29 17:33 nest-detail.json
    @#

###array-routes

    [
        [ 'routes', 'main' ],
        [ 'routes', 'dashboard' ],
        [ 'routes', 'profile' ],
        [ 'routes', 'profile', 'overview' ],
    ...


###cfg.json

    {
      'main@c': {},
      dashboard: {},
      profile: { overview: {}, settings: {} },
      design: { colors: {}, icons: {} },
      forms: { dynamic: {}, static: {} },
      material: {
        slider: { slider-basic: {}, 'slide-toggle': {} },
        progress: { 'progress-bar': {}, 'progress-spinner': {} }
      },
      sessions: {
        register: { github-regis: {}, email-regis: {}, wx-regis: {} },
        login: { github-login: {}, email-login: {}, wx-login: {} }
      }
    }

###dir-routes

    [
      '/routes/main',
      '/routes/dashboard',
      '/routes/profile',
      '/routes/profile/overview',
      '/routes/profile/settings',
      '/routes/design',
      '/routes/design/colors',
      '/routes/design/icons',
      '/routes/forms',
      '/routes/forms/dynamic',
      '/routes/forms/static',
      '/routes/material',
      '/routes/material/slider',
      '/routes/material/slider/slider-basic',
      '/routes/material/slider/slide-toggle',
      '/routes/material/progress',
      '/routes/material/progress/progress-bar',
      '/routes/material/progress/progress-spinner',
      '/routes/sessions',
      '/routes/sessions/register',
      '/routes/sessions/register/github-regis',
      '/routes/sessions/register/email-regis',
      '/routes/sessions/register/wx-regis',
      '/routes/sessions/login',
      '/routes/sessions/login/github-login',
      '/routes/sessions/login/email-login',
      '/routes/sessions/login/wx-login'
    ]


###flat-brief

    [
        ...
        {
          type: 'component',
          key: 'wx',
          val: {},
          name: 'wx',
          clsname: 'WxRegisComponent',
          rel_dir_path: './routes/sessions/register/wx-regis',
          rel_ts_path: './routes/sessions/register/wx-regis/wx-regis.component.ts',
          rel_css_path: './routes/sessions/register/wx-regis/wx-regis.component.css',
          rel_html_path: './routes/sessions/register/wx-regis/wx-regis.component.html',
          rel_spec_ts_path: './routes/sessions/register/wx-regis/wx-regis.component.spec.ts',
          rel_to_pmod_import_src: './routes/sessions/register/wx-regis/wx-regis.component',
          rel_regis_dst: './app-routing.module.ts'
        },
        ...
    ]


###flat-detail

    - this is used when your project have hundreds/thousands components
    - such as some auto-testbed
    - normally it is no need

    [
        ...
      '26': {
        _tree: 0,
        _fstch: null,
        _rsib: 27,
        _id: 26,
        _guid: '84a8c1d0-9b87-4712-b639-6c27ffb1514c',
        type: 'component',
        key: 'email',
        val: {},
        name: 'email',
        clsname: 'EmailLoginComponent',
        rel_dir_path: './routes/sessions/login/email-login',
        rel_ts_path: './routes/sessions/login/email-login/email-login.component.ts',
        rel_css_path: './routes/sessions/login/email-login/email-login.component.css',
        rel_html_path: './routes/sessions/login/email-login/email-login.component.html',
        rel_spec_ts_path: './routes/sessions/login/email-login/email-login.component.spec.ts',
        rel_to_pmod_import_src: './routes/sessions/login/email-login/email-login.component',
        rel_regis_dst: './app-routing.module.ts'
      },
      ....
    ]


###nest-detail

    - this is used when your project have hundreds/thousands components
    - such as some auto-testbed
    - normally it is no need


    [
        ...
        '$guid': 'bd3b0e4d-26c5-40a3-bccb-47e469066735',
        type: 'module',
        key: null,
        val: {
          'main@c': {},
          dashboard: {},
          profile: { overview: {}, settings: {} },
          design: { colors: {}, icons: {} },
          forms: { dynamic: {}, static: {} },
          material: { slider: [Object], progress: [Object] },
          sessions: { register: [Object], login: [Object] }
        },
        name: 'app',
        rel_dir_path: './',
        rel_ts_path: './app.module.ts',
        rel_to_pmod_import_src: null,
        rel_regis_dst: null,
        clsname: 'AppModule',
        routing: {
          name: 'app-routing',
          rel_dir_path: './',
          rel_ts_path: './app-routing.module.ts',
          rel_to_pmod_import_src: './app-routing.module',
          rel_regis_dst: './app.module.ts',
          clsname: 'AppRoutingModule',
          type: 'forRoot'
        }
        ...
    ]


example with lazy-loading
-------------------------

    @# vim .mod-and-com.cfg
    
    dashboard@c
    profile@c
        overview@c
        settings@c
    design@m
        colors@c
        icons@c
    forms@m
        dynamic@c
        static@c
    material@m
        slider@m
            slider-basic@c
            slide-toggle@c
        progress@m
            progress-bar@c
            progress-spinner@c
    sessions@c
        register@m
            github@c
            email@c
            wx@c
        login@m
            github@c
            email@c
            wx@c
 
    @# nv_ngroute_init --cfg mod-and-com.cfg

    @#ls -l | egrep -v "cfg"
    total 36
    -rw-r--r-- 1 root root    0 Oct 29 16:56 app.component.css
    -rw-r--r-- 1 root root   31 Oct 29 18:03 app.component.html
    -rw-r--r-- 1 root root  936 Oct 29 16:56 app.component.spec.ts
    -rw-r--r-- 1 root root  208 Oct 29 16:56 app.component.ts
    -rw-r--r-- 1 root root  927 Oct 29 18:03 app.module.ts
    -rw-r--r-- 1 root root 2487 Oct 29 18:03 app-routing.module.ts
    drwxr-xr-x 9 root root 4096 Oct 29 18:03 routes
    @#

    @#tree routes/ | egrep -v "html|css|spec"
    routes/
    ├── dashboard
    │   └── dashboard.component.ts
    ├── design
    │   ├── design.module.ts
    │   ├── design-routing.module.ts
    │   └── routes
    │       ├── colors
    │       │   └── colors.component.ts
    │       └── icons
    │           └── icons.component.ts
    ├── forms
    │   ├── forms.module.ts
    │   ├── forms-routing.module.ts
    │   └── routes
    │       ├── dynamic
    │       │   └── dynamic.component.ts
    │       └── static
    │           └── static.component.ts
    ├── main
    │   └── main.component.ts
    ├── material
    │   ├── material.module.ts
    │   ├── material-routing.module.ts
    │   └── routes
    │       ├── progress
    │       │   ├── progress.module.ts
    │       │   ├── progress-routing.module.ts
    │       │   └── routes
    │       │       ├── progress-bar
    │       │       │   └── progress-bar.component.ts
    │       │       └── progress-spinner
    │       │           └── progress-spinner.component.ts
    │       └── slider
    │           ├── routes
    │           │   ├── slider-basic
    │           │   │   └── slider-basic.component.ts
    │           │   └── slide-toggle
    │           │       └── slide-toggle.component.ts
    │           ├── slider.module.ts
    │           └── slider-routing.module.ts
    ├── profile
    │   ├── overview
    │   │   └── overview.component.ts
    │   ├── profile.component.ts
    │   └── settings
    │       └── settings.component.ts
    └── sessions
        ├── login
        │   ├── login.module.ts
        │   ├── login-routing.module.ts
        │   └── routes
        │       ├── email
        │       │   └── email.component.ts
        │       ├── github
        │       │   └── github.component.ts
        │       └── wx
        │           └── wx.component.ts
        ├── register
        │   ├── register.module.ts
        │   ├── register-routing.module.ts
        │   └── routes
        │       ├── email
        │       │   └── email.component.ts
        │       ├── github
        │       │   └── github.component.ts
        │       └── wx
        │           └── wx.component.ts
        └── sessions.component.ts
    
    34 directories, 94 files

    @# vim app-routing.module.ts

    ...
        {
            path: 'design',
            data: {},
            loadChildren: () => import('./routes/design/design.module').then(m => m.DesignModule)
        },
        {
            path: 'forms',
            data: {},
            loadChildren: () => import('./routes/forms/forms.module').then(m => m.FormsModule)
        },
        {
            path: 'material',
            data: {},
            loadChildren: () => import('./routes/material/material.module').then(m => m.MaterialModule)
        },

    ...


    @#tree routes/design/ | egrep -v "html|css|spec"
    routes/design/
    ├── design.module.ts
    ├── design-routing.module.ts
    └── routes
        ├── colors
        │   └── colors.component.ts
        └── icons
            └── icons.component.ts

    3 directories, 10 files
    @#


    @# cat routes/design/design-routing.module.ts
    ...
    @NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule]
    })
    export class DesignRoutingModule {}
    ...

API
===

-   NO need, all cli

