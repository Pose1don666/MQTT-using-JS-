const {build} = require(`esbuild`);
const sveltePlugin = require(`esbuild-svelte`);

// Берем содержимое package.json в виде объекта pkg
const pkg = require(`./package.json`);

// Настраиваем плагин компиляции Svelte файлов
const svelte = sveltePlugin({
    compileOptions:{
        // Все стили будут упакованы вместе с компонентом
        css: true
    }
});

// Собираем IIFE-модуль
build({
    // Откуда и куда собирать модули узнаем в package.json
    entryPoints: [pkg.svelte],
    outfile: pkg.cdn,
    format: 'iife',
    bundle: true,
    minify: true,
    sourcemap: true,
    plugins: [svelte],

    // Задаём имя глобальной переменной для доступа к модулю
    globalName: 'svelteMQTT',
})

// Собираем ES-модуль
build({
    entryPoints: [pkg.svelte],
    outfile: pkg.module,
    format: 'esm',
    bundle: true,
    minify: true,
    sourcemap: true,
    plugins: [svelte],

    // Просим не включать в модуль зависимости из разделов
    // dependencies и peerDependencies в файле package.json
    external: [
        ...Object.keys(pkg.peerDependencies),
    ]
})