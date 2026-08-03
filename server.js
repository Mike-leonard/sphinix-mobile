const { execSync } = require("child_process");
const path = require("path");

// Set production environment
process.env.NODE_ENV = "production";

// Start Next.js production server
const nextBin = path.join(__dirname, "node_modules", ".bin", "next");
execSync(`${nextBin} start -p ${process.env.PORT || 3000}`, {
  stdio: "inherit",
  cwd: __dirname,
});
