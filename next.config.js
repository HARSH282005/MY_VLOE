const million = require('million/compiler');
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const millionConfig = {
  auto: true, // Automatically optimizes React components
};

// Chain Million.js compiler
const withMillion = million.next(millionConfig)(nextConfig);

// Chain Sentry
module.exports = withSentryConfig(
  withMillion,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options
    silent: true,
    org: "your-org-placeholder",
    project: "your-project-placeholder",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
    widenClientFileUpload: true,
    transpileClientSDK: true,
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  }
);
