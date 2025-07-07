// postcss.config.js
export default {
    plugins: {
        'postcss-import': {},
        '@tailwindcss/postcss': {
            tailwindConfig: './tailwind.config.js'
        },
        'postcss-nested': {},
        'autoprefixer': {}
    }
}