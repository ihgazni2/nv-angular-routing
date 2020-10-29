#!/usr/bin/env node
const { Command } = require('commander');
const efdir = require('efdir');
const {write_all} = require('../writer')

const program = new Command();
program.version('0.0.1')
    .option(
        '--cfg <cfg>',
        `cfg file path,
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
`,
        './cfg'
    )
    .action(function(o) {write_all(efdir.rfile(o.cfg))})
program.parse(process.argv);

