const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
    env: {
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
        FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
        FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
        FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
        PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
        PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
        PAYPAL_ACCOUNT: process.env.PAYPAL_ACCOUNT,
        DISABLED_FEATURES: process.env.DISABED_FEATURES,
        FIREBASE_ADMIN_DATABASE: process.env.FIREBASE_ADMIN_DATABASE,
        TOORNAMENT_API_KEY: process.env.TOORNAMENT_API_KEY,
        TOORNAMENT_CLIENT_ID: process.env.TOORNAMENT_CLIENT_ID,
        TOORNAMENT_CLIENT_SECRET: process.env.TOORNAMENT_CLIENT_SECRET
    },
    buildDir: 'out',
    future: {
        webpack5: true
    },
    async headers() {
        return [
            {
                source: '/api/positions',
                headers: [
                    {
                        key: 'cache-control',
                        value: 's-maxage=3600'
                    }
                ]
            }
        ]
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
