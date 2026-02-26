/**
 * Expo config plugin that adds a release signing configuration to the Android build.
 *
 * When the RELEASE_KEYSTORE_FILE environment variable is set (e.g. in CI),
 * the release build uses that keystore. Otherwise it falls back to the
 * debug keystore so local builds keep working without any setup.
 */
const { withAppBuildGradle } = require('expo/config-plugins');

function withReleaseSigning(config) {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    const releaseSigningConfig = [
      '        release {',
      '            def ksFile = System.getenv("RELEASE_KEYSTORE_FILE")',
      '            if (ksFile != null && !ksFile.isEmpty() && file(ksFile).exists()) {',
      '                storeFile file(ksFile)',
      '                storePassword System.getenv("RELEASE_KEYSTORE_PASSWORD")',
      '                keyAlias System.getenv("RELEASE_KEY_ALIAS")',
      '                keyPassword System.getenv("RELEASE_KEY_PASSWORD")',
      '            } else {',
      "                storeFile file('debug.keystore')",
      "                storePassword 'android'",
      "                keyAlias 'androiddebugkey'",
      "                keyPassword 'android'",
      '            }',
      '        }',
    ].join('\n');

    // Add release signing config after the debug signing config block
    const beforeSigning = contents;
    contents = contents.replace(
      /(signingConfigs\s*\{\s*debug\s*\{[^}]*\})\s*(\})/,
      `$1\n${releaseSigningConfig}\n    $2`
    );
    if (contents === beforeSigning) {
      throw new Error('withReleaseSigning: Failed to inject release signing config into build.gradle');
    }

    // In the buildTypes release block, switch to the release signing config
    const beforeBuildType = contents;
    contents = contents.replace(
      /(buildTypes\s*\{[\s\S]*?release\s*\{[^}]*?)signingConfig signingConfigs\.debug/,
      '$1signingConfig signingConfigs.release'
    );
    if (contents === beforeBuildType) {
      throw new Error('withReleaseSigning: Failed to update release buildType signing config in build.gradle');
    }

    config.modResults.contents = contents;
    return config;
  });
}

module.exports = withReleaseSigning;
