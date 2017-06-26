var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyjs'),
	cssnano = require('gulp-cssnano'),
	rename = require('gulp-rename'),
	del   = require('del'),
	imagemin    = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant    = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png ;
    cache       = require('gulp-cache'), // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов

gulp.task('sass', function(){
	return gulp.src('www/sass/**/*.sass')
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
	.pipe(gulp.dest('www/css/'))
	.pipe(browserSync.reload({stream: true}))
});


gulp.task('sync', function(){
	browserSync({
		server:{
			baseDir: 'www'
		},
		notify: false
		
	});
});

gulp.task('scripts', function(){
	return gulp.src([
			'www/libs/jquery/jquery.min.js',
			'www/libs/jquery-mobile/js/jquery.mobile.js',
			'www/libs/leaflet/dist/leaflet.js'
		])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('www/js'));
});
gulp.task('css-libs', ['sass'], function() {
	    return gulp.src([
	    'www/libs/leaflet/dist/leaflet.css'
	    ]) // Выбираем файл для минификации
	    .pipe(concat('libs.css'))
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('www/css')); // Выгружаем в папку app/css
});
gulp.task('watch', ['sync', 'css-libs', 'scripts'], function(){
	gulp.watch('www/sass/**/*.sass', ['sass']);
	gulp.watch('www/*.html', browserSync.reload);	
   gulp.watch('www/js/**/*.js', browserSync.reload); 
});

gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});
gulp.task('img', function() {
    return gulp.src('www/img/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({ // Сжимаем их с наилучшими настройками
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

gulp.task('default', ['watch']);
gulp.task('clear', function () {
    return cache.clearAll();
})