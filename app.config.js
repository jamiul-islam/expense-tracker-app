export default ({ config }) => ({
  ...config,
  expo: {
    name: 'Tranzo',
    slug: 'tranzo',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    splash: {
      resizeMode: 'contain',
      backgroundColor: '#1A1F4B',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.tranzo.app',
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#1A1F4B',
      },
      package: 'com.tranzo.app',
    },
    web: {},
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      eas: {
        projectId: process.env.EAS_PROJECT_ID || undefined,
      },
    },
  },
});
