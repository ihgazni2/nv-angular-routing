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
-   init a new project:    ng new proj            
-   goto the app dir:      cd proj/src/app/ 
-   edit a simple config:  vim cfg                        see [config\_format](config\_format) 
-   just-one-command:      nv\_ngroute\_init --cfg ./cfg

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
                          slider@c
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
            slider
            slide-toggle
        progress
            progress-bar
            progress-spinner
    sessions
        register
            github
            email
            wx
        login
            github
            email
            wx
    --------------------------------------------------------------------------------

    @# nv_ngroute_init --cfg ./all-com.cfg


result
------




API
---
-   NO need, all cli

