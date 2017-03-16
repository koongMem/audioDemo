module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    require('time-grunt')(grunt);

    grunt.loadNpmTasks('grunt-replace');

    var appConfig = {
        app: 'webapp',
        admin: 'webapp/admin',
        build: 'build',
        statics: 'statics',
        tmp: 'webapp/'
    };


    // Project configuration.
    grunt.initConfig({
        super: appConfig,
        bower: {
            install: {
                options: {
                    targetDir: '<%= super.app %>/<%= super.statics %>/bower_components',
                    copy: false,
                    cleanBowerDir: false,
                }
            },
            dist: {
                options: {
                    targetDir: '<%= super.build %>/<%= super.statics %>/bower_components',
                    production: true,
                    cleanBowerDir: true,
                }
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['babel-preset-es2015']
            },
            dist: {
                files: {
                    'webapp/statics/scripts/app_es6.js': 'webapp/statics/scripts/app_es6.js'
                }
            }
        },
        // copy: {
        //   dist: {
        //     files: [{
        //       expand: true,
        //       cwd: '<%= super.app %>/<%= super.statics %>',
        //       src: ['**/*', '!scss/**', '!bower_components/**', '!scripts/**'],
        //       dest: '<%= super.build %>/<%= super.statics %>/'
        //     }, {
        //       expand: true,
        //       cwd: '<%= super.app %>',
        //       src: ['**/*.html'],
        //       dest: '<%= super.build %>'
        //     }, {
        //       expand: true,
        //       cwd: '<%= super.app %>/<%= super.statics %>/images',
        //       src: ['**/*'],
        //       dest: '<%= super.build %>/<%= super.statics %>/images'
        //     }]
        //   }
        // },
        copy: {
            dist: {
                expand: true,
                cwd: '<%= super.app %>',
                src: ['**/*', '!**/statics/scss/**', '!**/statics/bower_components/**', '!**/statics/img_source/**', '!**/statics/scripts/**', '!**/statics/components/**', '!**/statics/touchzoom-master/**'],
                dest: '<%= super.build %>'
            }
        },
        clean: {
            dist: ['<%= super.build %>/<%= super.statics %>/**', '<%= super.build %>/view/**'],
            server: ['<%= super.tmp %>']
        },
        watch: {
            compass: {
                files: ['<%= super.app %>/<%= super.statics %>/scss/{,*/}*.{scss,sass}', '<%= super.admin %>/<%= super.statics %>/scss/{,*/}*.{scss,sass}'],
                tasks: ['compass:server', 'compass:server_admin']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= super.app %>/**/*.{html,jsp}',
                    '<%= super.tmp %>/**/*.css',
                    '<%= super.app %>/**/*.js'
                ]
            }
        },
        connect: {
            options: {
                port: 9006,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: '0.0.0.0',
                livereload: 34729
            },
            // 数据中间层
            proxies: [{
                context: '/Course',
                host: '192.168.30.231',
                port: 8380,
                // host: '127.0.0.1',
                // port: 8080,
                changeOrigin: true
            }, {
                context: '/Like',
                host: '192.168.30.231',
                port: 8380,
                // host: '127.0.0.1',
                // port: 8080,
                changeOrigin: true
            }, {
                context: '/CJ',
                host: '192.168.30.224',
                // host: '127.0.0.1',
                port: 8080,
                changeOrigin: true
            }, {
                context: '/Sectioin',
                host: '192.168.30.231',
                port: 8380,
                // host: '127.0.0.1',
                // port: 8080,
                changeOrigin: true
            }, {
                context: '/Evaluate',
                host: '192.168.30.231',
                port: 8380,
                // host: '127.0.0.1',
                // port: 8080,
                changeOrigin: true
            }],
            livereload: {
                options: {
                    open: false,
                    middleware: function(connect) {
                        return [
                            // 数据中间层
                            // require('grunt-connect-proxy/lib/utils').proxyRequest,
                            // require('grunt-connect-jsp/lib/connect-jsp')(appConfig.src, grunt), //添加JSP中间件，第一个参数为 源码目录
                            function(req, res, next) {
                                res.setHeader('Access-Control-Allow-Origin', '*');
                                return next();
                            },
                            require('grunt-connect-proxy/lib/utils').proxyRequest,
                            connect.static(appConfig.tmp),
                            connect.static(appConfig.app)
                        ];
                    }
                }
            }
        },
        uglify: {
            dist: {
                options: {
                    sourceMap: false,
                    compress: {
                        drop_console: true,
                        drop_debugger: true
                    },
                    // sourceMap: false,
                    // compress: {
                    //     drop_console: true,
                    //     drop_debugger: true,
                    //     sequences: true,
                    //     dead_code: true,
                    //     properties: true,
                    //     comparisons: true,
                    //     if_return: true,
                    //     unused: false,
                    // }
                    // mangle: false, //不混淆变量名
                    // preserveComments: 'all', //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
                    // report: "min"//输出压缩率，可选的值有 false(不输出信息)，gzip
                    // beautify:{
                    //     ascii_only:true
                    // }
                },
                // files: [{
                //   expand: true,
                //   cwd: '<%= super.app %>/<%= super.statics %>/scripts',
                //   src: ['**/*.js'],
                //   dest: '<%= super.build %>/<%= super.statics %>/scripts'
                // }]
                files: [{
                    expand: true,
                    cwd: '<%= super.app %>',
                    src: ['**/*.js'],
                    dest: '<%= super.build %>'
                }]
            }
        },
        compass: {
            options: {
                sassDir: '<%= super.app %>/<%= super.statics %>/scss',
                cssDir: '<%= super.app %>/<%= super.statics %>/css',
                generatedImagesDir: '<%= super.tmp %>/<%= super.statics %>/images/generated',
                imagesDir: '<%= super.app %>/<%= super.statics %>/images-source',
                javascriptsDir: '<%= super.app %>/scripts',
                fontsDir: '<%= super.app %>/styles/fonts',
                httpImagesPath: '/<%= super.statics %>/images',
                httpGeneratedImagesPath: '../images/generated',
                relativeAssets: false,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            dist: {
                options: {
                    cssDir: '<%= super.build %>/<%= super.statics %>/css',
                    generatedImagesDir: '<%= super.build %>/<%= super.statics %>/images/generated',
                    outputStyle: 'compressed',
                    noLineComments: true
                }
            },
            dist_admin: {
                options: {
                    sassDir: '<%= super.app %>/admin/statics/scss',
                    cssDir: '<%= super.build %>/admin/statics/css',
                    imagesDir: '<%= super.app %>/admin/statics/img_source',
                    httpImagesPath: '../img/generated',
                    httpGeneratedImagesPath: '../img/generated',
                    generatedImagesDir: '<%= super.build %>/admin/statics/img/generated',
                    // debugInfo: false,
                    outputStyle: 'compressed',
                    noLineComments: true
                }
            },
            server: {
                options: {
                    cssDir: '<%= super.tmp %>/<%= super.statics %>/css',
                    httpImagesPath: '/<%= super.statics %>/images',
                    httpGeneratedImagesPath: '../images/generated',
                    debugInfo: false,
                    outputStyle: 'compressed',
                    noLineComments: true
                }
            },
            server_admin: {
                options: {
                    sassDir: '<%= super.app %>/admin/statics/scss',
                    cssDir: '<%= super.tmp %>/admin/statics/css',
                    imagesDir: '<%= super.app %>/admin/statics/img_source',
                    httpImagesPath: '../img/generated',
                    httpGeneratedImagesPath: '../img/generated',
                    generatedImagesDir: '<%= super.tmp %>/admin/statics/img/generated',
                    debugInfo: false,
                    outputStyle: 'compressed',
                    noLineComments: true
                }
            }
        },
        replace: {
            test: {
                options: {
                    patterns: [{
                        match: /('")?\/statics/g,
                        replacement: function() {
                            return '/ClubMonth/statics'; // replaces "foo" to "bar"
                        }
                    }]
                },
                files: [{
                    expand: true,
                    cwd: '<%= super.build %>/',
                    src: ['**/*.{js,html,css}'],
                    dest: 'test/'
                }]
            }
        },
        concurrent: {
            server: [
                // 'clean:server',
                // 'bower:install',
                'compass:server',
                'compass:server_admin'
            ]
        }
    });

    grunt.registerTask('serve', 'DEPRECATED TASK. Use the "serve" task instead', function(target) {
        grunt.task.run([
            'concurrent:server',
            'configureProxies:server', // 数据层中间代理
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('default', ['babel']);

    grunt.registerTask('build', 'DEPRECATED TASK. Use the "serve" task instead', function(target) {
        grunt.task.run([
            // 'clean:dist',
            // 'bower:dist',
            'compass:dist',
            'compass:dist_admin',
            'uglify:dist',
            'copy:dist'
        ]);
    });
};