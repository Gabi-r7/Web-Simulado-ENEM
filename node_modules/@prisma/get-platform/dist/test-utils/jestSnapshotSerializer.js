"use strict";
const path = require("path");
const replaceAll = require("replace-string");
const stripAnsi = require("strip-ansi");
const { platformRegex } = require("./platformRegex");
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
function normalizePrismaPaths(str) {
  return str.replace(/prisma\\([\w-]+)\.prisma/g, "prisma/$1.prisma").replace(/prisma\\seed\.ts/g, "prisma/seed.ts").replace(/custom-folder\\seed\.js/g, "custom-folder/seed.js");
}
function normalizeLogs(str) {
  return str.replace(
    /Started query engine http server on http:\/\/127\.0\.0\.1:\d{1,5}/g,
    "Started query engine http server on http://127.0.0.1:00000"
  ).replace(/Starting a postgresql pool with \d+ connections./g, "Starting a postgresql pool with XX connections.");
}
function normalizeTmpDir(str) {
  return str.replace(/\/tmp\/([a-z0-9]+)\//g, "/tmp/dir/");
}
function trimErrorPaths(str) {
  const parentDir = path.dirname(path.dirname(path.dirname(__dirname)));
  return replaceAll(str, parentDir, "");
}
function normalizeToUnixPaths(str) {
  return replaceAll(str, path.sep, "/");
}
function normalizeGitHubLinks(str) {
  return str.replace(/https:\/\/github.com\/prisma\/prisma(-client-js)?\/issues\/new\S+/, "TEST_GITHUB_LINK");
}
function normalizeTsClientStackTrace(str) {
  return str.replace(/([/\\]client[/\\]src[/\\]__tests__[/\\].*test\.ts)(:\d*:\d*)/, "$1:0:0").replace(/([/\\]client[/\\]tests[/\\]functional[/\\].*\.ts)(:\d*:\d*)/, "$1:0:0");
}
function removePlatforms(str) {
  return str.replace(platformRegex, "TEST_PLATFORM");
}
function normalizeNodeApiLibFilePath(str) {
  return str.replace(
    /((lib)?query_engine-TEST_PLATFORM\.)(.*)(\.node)/g,
    "libquery_engine-TEST_PLATFORM.LIBRARY_TYPE.node"
  );
}
function normalizeBinaryFilePath(str) {
  return str.replace(/\.exe(\s+)?(\W.*)/g, "$1$2").replace(/\.exe$/g, "");
}
function normalizeMigrateTimestamps(str) {
  return str.replace(/(?<!\d)\d{14}(?!\d)/g, "20201231000000");
}
function normalizeDbUrl(str) {
  return str.replace(/(localhost|postgres|mysql|mssql|mongodb_migrate|cockroachdb):(\d+)/g, "localhost:$2");
}
function normalizeRustError(str) {
  return str.replace(/\/rustc\/(.+)\//g, "/rustc/hash/").replace(/(\[.*)(:\d*:\d*)(\])/g, "[/some/rust/path:0:0$3");
}
function normalizeRustCodeLocation(str) {
  return str.replace(/(\w+\.rs):(\d+):(\d+)/g, "$1:0:0");
}
function normalizeArtificialPanic(str) {
  return str.replace(/(Command failed with exit code 101:) (.+) /g, "$1 prisma-engines-path ");
}
function normalizeTime(str) {
  return str.replace(/ \d+ms/g, " XXXms").replace(/ \d+(\.\d+)?s/g, " XXXms");
}
function prepareSchemaForSnapshot(str) {
  if (!str.includes("tmp/prisma-tests/integration-test"))
    return str;
  const urlRegex = /url\s*=\s*.+/;
  const outputRegex = /output\s*=\s*.+/;
  return str.split("\n").map((line) => {
    const urlMatch = urlRegex.exec(line);
    if (urlMatch) {
      return `${line.slice(0, urlMatch.index)}url = "***"`;
    }
    const outputMatch = outputRegex.exec(line);
    if (outputMatch) {
      return `${line.slice(0, outputMatch.index)}output = "***"`;
    }
    return line;
  }).join("\n");
}
module.exports = {
  test(value) {
    return typeof value === "string" || value instanceof Error;
  },
  serialize(value) {
    const message = typeof value === "string" ? value : value instanceof Error ? value.message : "";
    return pipe(
      stripAnsi,
      prepareSchemaForSnapshot,
      normalizeTmpDir,
      normalizeTime,
      normalizeGitHubLinks,
      removePlatforms,
      normalizeNodeApiLibFilePath,
      normalizeBinaryFilePath,
      normalizeTsClientStackTrace,
      trimErrorPaths,
      normalizePrismaPaths,
      normalizeLogs,
      normalizeToUnixPaths,
      normalizeDbUrl,
      normalizeRustError,
      normalizeRustCodeLocation,
      normalizeMigrateTimestamps,
      normalizeArtificialPanic
    )(message);
  }
};
