const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "api.tokkit.site",
                pathname: "/admin-api/s3/images/**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "8080",
                pathname: "/admin-api/s3/images/**",
            },
        ],
    },
};