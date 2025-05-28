const fs = require("fs");
const path = require("path");

const sdkPath = process.env.HOME + "/Library/Android/sdk";
const localPropsPath = path.join(process.cwd(), "android", "local.properties");

fs.writeFileSync(localPropsPath, `sdk.dir=${sdkPath}`);
console.log("✅ local.properties written:", localPropsPath);
