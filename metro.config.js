const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Disable strict “exports” resolution so Node‑only modules fall back to CJS
config.resolver.unstable_enablePackageExports = false;

//Tell Metro how to transform SVGs into React components and treat .svg as source, not as asset
config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
};
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

module.exports = withNativeWind(config, {
    input: "./src/global.css",
});
