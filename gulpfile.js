var exec = require('child_process').exec,
    fs = require('fs'),
    path = require('path'),
    extend = require('util')._extend,
    http = require('http'),
    url = require('url');

var gulp = require('gulp'),
    /*sass = require('gulp-sass'),*/
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    ssh = require('gulp-ssh'),
    tar = require('gulp-tar'),
    gzip = require('gulp-gzip'),
    replace = require('gulp-just-replace'),
    shell = require('gulp-shell'),
    uglify = require('gulp-uglify'),
    gutil = require("gulp-util"),
    del = require('del'),
    _ = require('underscore'),
    targz = require('tar.gz'),
    browserSync = require('browser-sync'),
    argv = require('yargs').argv,
    open = require('open'),
    concat = require('gulp-concat'),
    spritesmith = require('gulp.spritesmith'),
    merge = require('merge-stream'),
    rev = require('gulp-rev'),
    md5 = require("gulp-md5-plus");

/*------------------------------------------开发项目-------------------------------------------*/


function proxyTo(host, req, res) {
    var toUrl = ('http://' + host + req.url)
        .replace(/(\/image\/)/, '/');
    console.log("[proxy url] " + toUrl);
    console.log("------------------------------------");
    var location = url.parse(toUrl);

    var options = {
        host: location.host,
        hostname: location.hostname,
        port: location.port,
        method: req.method,
        path: location.path,
        headers: req.headers,
        auth: location.auth
    };
    options.headers.host = location.host;

    if (req.headers.referer) {
        options.headers.referer = req.headers.referer.replace(/^(http:\/\/)?([^\/])+\//, "$1" + host + "/");
    }

    console.log("[proxy request]");
    console.log(options);
    console.log("------------------------------------");
    var clientRequest = http.request(options, function(clientResponse) {
        res.writeHead(clientResponse.statusCode, clientResponse.headers);
        clientResponse.pipe(res, {
            end: false
        });
        clientResponse.on("end", function() {
            res.addTrailers(clientResponse.trailers);
            res.end();
        });
    });
    req.pipe(clientRequest);

}

// 搭建本地服务器
gulp.task('browserSync', function(callback) {

    browserSync({
        browser: ["google chrome"],
        port: 15080,
        server: {
            baseDir: './src/app',
            middleware: [
                require('compression')(),
                function(req, res, next) {
                    var urlObj = url.parse(req.url);

                    if (/^(\/)?image\//i.test(urlObj.path)) {
                        proxyTo('image.dolphin.com', req, res);
                    }
                    /*else if (/^(\/)?\/supplier\//i.test(urlObj.path)) {
                                            proxyTo('192.168.10.255:8083', req, res);
                                        }*/
                    else if (/^(\/)?\/supplier\//i.test(urlObj.path)) {
                        proxyTo('hotel-test.rsscc.com', req, res);
                    } else {
                        next();
                    }

                }
            ]
        },
    });
    callback();
});


gulp.task('default', function() {

    // console.log("file name [" + argv.w + "]")
    if (!argv.w) {
        console.log("Usage: gulp --w [filename] ");
        return false;
    }

    gulp.watch([path.join(process.cwd(), 'src', argv.w, 'index.html')], browserSync.reload);
    gulp.watch([path.join(process.cwd(), 'src', argv.w, 'css', '*.css')], browserSync.reload);
    gulp.watch([path.join(process.cwd(), 'src', argv.w, 'js', '*.js')], browserSync.reload);
    gulp.watch([path.join(process.cwd(), 'src', argv.w, 'scripts', '*.js')], browserSync.reload);

    setTimeout(function() {
        var openpage = gulp.series('browserSync');
        openpage();
    }, 2000);

});


/*----------------------------------------压缩项目，添加时间戳-------------------------------------------------*/
// 时间戳函数
var getStamp = function() {
    var myDate = new Date();

    var myYear = myDate.getFullYear().toString();
    var myMonth = ('0' + (myDate.getMonth() + 1)).slice(-2);
    var myDay = ('0' + myDate.getDate()).slice(-2);
    var myHours =  myDate.getHours().toString();
    var myMinutes = myDate.getMinutes().toString();
    var mySeconds = myDate.getSeconds().toString();

    var myFullDate = myYear + myMonth + myDay + myHours + myMinutes + mySeconds;

    return myFullDate;
};

// 转移文件到build
gulp.task('move', function(callback) {
    return gulp.src('./src/app/**/*')
        .pipe(gulp.dest(path.join(__dirname, 'build/app')))
        .on('finish', callback);
});

// 项目添加时间戳
function timeStamp(callback) {
    var time = getStamp();
    return gulp.src('./src/app/*.html')
        .pipe(replace('common.css', "common.css?version=" + time))
        .pipe(replace(/.js/g, ".js?version=" + time))
        .pipe(gulp.dest('./build/app'))
        .on('finish', callback);
}

gulp.task('tar_gz', function(cb) {
    console.log('Compression Start!');
    var compress = new targz().compress('./build/app', './build/app_p2p.tar.gz', function(err) {
        if (err) {
            console.log(err);
        }
        console.log('The compression has ended!');
    });
    cb();
});

// 这里是gulp 执行的起点
gulp.task('build', gulp.series(
    'move',
    timeStamp,
    'tar_gz'
));



/*-------------------------------------------------服务器代码部署-----------------------------------------*/
var options = {
    userName: 'root',
    password: 'JQu3s6nKWk3N',
    privateKey: '../deploy/baina.key',
    packageName: 'app_p2p',
    tarAppDir: 'app',
    appDir: 'supplier',
    distDir: '/usr/local/tomcat7/webapps',
    distDir_APP_BF: '/usr/local/tomcat7/webapps_old'
};

// 服务器代码部署
function _deploy(_options) {

    options = extend(options, _options);

    var ssh_config = {
        host: options.host,
        port: 22,
        username: options.userName,
        debug: function(str) {
            //console.log(str);
        }
    };

    if (options.usedFor === 'development') {
        ssh_config = extend(ssh_config, {
            password: options.password
        });
    } else if (options.usedFor === 'production') {
        ssh_config = extend(ssh_config, {
            privateKey: fs.readFileSync(options.privateKey).toString()
        });
    }

    // 通过ssh 上传到服务器的目录可以通过 ssh 客户端登陆验证一下。
    // 控制台默认是上传至 /home/baina   ，通过pwd 命令查看
    var gulpSSH = new ssh({
        ignoreErrors: false,
        sshConfig: ssh_config
    });

    // put local file to server
    gulp.task('sftp-write', function(cb) {
        gulp.src('build/' + options.packageName + '.tar.gz')
            .pipe(gulpSSH.sftp('write', options.packageName + '.tar.gz'))
            .on('finish', function() {
                var time = (new Date());
                console.log("[" + time + "]" + " Finished 'sftp-write'");
                setTimeout(function() {
                    var shell = gulp.series('shell');
                    shell();
                }, 1000);
            });
    });

    // execute commands in shell
    gulp.task('shell', function(cb) {
        var config = {
                distDir: options.distDir,
                packageName: options.packageName,
                backupDir: options.distDir_APP_BF,
                appDir: options.appDir,
                app: options.appName,
                tarApp: options.tarAppDir,
            },
            postUploadCommand = 'mv -f /root/<%= packageName %>.tar.gz  <%= distDir %>/;rm -rf <%= backupDir %>;mkdir -p -m a+rxw <%= backupDir %>;cd <%= distDir %>;cp -r <%= appDir %>/* <%= backupDir %>;tar zxvf <%= packageName %>.tar.gz;chmod a+wx <%= packageName %>.tar.gz;chmod -R a+xr <%= packageName %>;chmod -R a+xr <%= appDir %>;yes | cp cp -rf <%= tarApp %>/* <%= appDir %>;rm - rf <%= tarApp %>;rm -rf <%= packageName %>.tar.gz;',
            command = _.template(postUploadCommand)(config).split(";");

        gulpSSH
            .shell(command, {
                filePath: 'shell.log'
            })
            .pipe(gulp.dest('logs'))
            .on('finish', cb);
    });

    var deploy = gulp.series('sftp-write');
    deploy();

}

// 测试服务器
gulp.task('deploy_test', function() {

    var _options = {
        host: '43.241.208.237',
        usedFor: 'development'
    };

    _deploy(_options);
});

// 正式服务器
gulp.task('deploy', function() {

    var _options = {
        host: '43.241.216.40',
        usedFor: 'development',
        userName: 'root',
        password: 'admin@huoli2016'
    };

    _deploy(_options);
});
