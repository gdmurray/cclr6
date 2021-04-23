const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
    env: {
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
        FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
        FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
        SECRET_KEY: process.env.SECRET_KEY
    },
    buildDir: 'out',
    future: {
        webpack5: true
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // config.resolve.fallback = { fs: false, module: false }
        // if (!isServer) {
        //     // Unset client-side javascript that only works server-side
        //     // https://github.com/vercel/next.js/issues/7755#issuecomment-508633125
        //     config.node = { fs: 'empty', module: 'empty' }
        // }

        config.module.rules.push(
            ...[
                {
                    test: /\.yml$/,
                    type: 'json',
                    use: 'yaml-loader'
                },
                {
                    test: /\.svg$/,
                    use: '@svgr/webpack'
                }
            ]
        )
        return config
    }
})
