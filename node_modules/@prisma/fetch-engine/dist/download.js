"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var download_exports = {};
__export(download_exports, {
  BinaryType: () => BinaryType,
  download: () => download,
  getBinaryEnvVarPath: () => getBinaryEnvVarPath,
  getBinaryName: () => getBinaryName,
  getVersion: () => getVersion,
  maybeCopyToTmp: () => maybeCopyToTmp,
  plusX: () => plusX
});
module.exports = __toCommonJS(download_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_get_platform = require("@prisma/get-platform");
var import_execa = __toESM(require("execa"));
var import_fs = __toESM(require("fs"));
var import_fs_extra = require("fs-extra");
var import_colors = require("kleur/colors");
var import_p_filter = __toESM(require("p-filter"));
var import_path = __toESM(require("path"));
var import_temp_dir = __toESM(require("temp-dir"));
var import_util = require("util");
var import_chmod = __toESM(require("./chmod"));
var import_cleanupCache = require("./cleanupCache");
var import_downloadZip = require("./downloadZip");
var import_getHash = require("./getHash");
var import_log = require("./log");
var import_utils = require("./utils");
const { enginesOverride } = require("../package.json");
const debug = (0, import_debug.default)("prisma:download");
const exists = (0, import_util.promisify)(import_fs.default.exists);
const channel = "master";
var BinaryType = /* @__PURE__ */ ((BinaryType2) => {
  BinaryType2["QueryEngineBinary"] = "query-engine";
  BinaryType2["QueryEngineLibrary"] = "libquery-engine";
  BinaryType2["MigrationEngineBinary"] = "migration-engine";
  return BinaryType2;
})(BinaryType || {});
const BINARY_TO_ENV_VAR = {
  ["migration-engine" /* MigrationEngineBinary */]: "PRISMA_MIGRATION_ENGINE_BINARY",
  ["query-engine" /* QueryEngineBinary */]: "PRISMA_QUERY_ENGINE_BINARY",
  ["libquery-engine" /* QueryEngineLibrary */]: "PRISMA_QUERY_ENGINE_LIBRARY"
};
async function download(options) {
  if (enginesOverride?.["branch"] || enginesOverride?.["folder"]) {
    options.version = "_local_";
    options.skipCacheIntegrityCheck = true;
  }
  const platform = await (0, import_get_platform.getPlatform)();
  const os = await (0, import_get_platform.getos)();
  if (os.targetDistro && ["nixos"].includes(os.targetDistro)) {
    console.error(`${(0, import_colors.yellow)("Warning")} Precompiled engine files are not available for ${os.targetDistro}.`);
  } else if (["freebsd11", "freebsd12", "freebsd13", "openbsd", "netbsd"].includes(platform)) {
    console.error(
      `${(0, import_colors.yellow)(
        "Warning"
      )} Precompiled engine files are not available for ${platform}. Read more about building your own engines at https://pris.ly/d/build-engines`
    );
  } else if ("libquery-engine" /* QueryEngineLibrary */ in options.binaries) {
    (0, import_get_platform.assertNodeAPISupported)();
  }
  if (!options.binaries || Object.values(options.binaries).length === 0) {
    return {};
  }
  const opts = {
    ...options,
    binaryTargets: options.binaryTargets ?? [platform],
    version: options.version ?? "latest",
    binaries: mapKeys(options.binaries, (key) => engineTypeToBinaryType(key, platform))
  };
  const binaryJobs = Object.entries(opts.binaries).flatMap(
    ([binaryName, targetFolder]) => opts.binaryTargets.map((binaryTarget) => {
      const fileName = getBinaryName(binaryName, binaryTarget);
      const targetFilePath = import_path.default.join(targetFolder, fileName);
      return {
        binaryName,
        targetFolder,
        binaryTarget,
        fileName,
        targetFilePath,
        envVarPath: getBinaryEnvVarPath(binaryName),
        skipCacheIntegrityCheck: !!opts.skipCacheIntegrityCheck
      };
    })
  );
  if (process.env.BINARY_DOWNLOAD_VERSION) {
    opts.version = process.env.BINARY_DOWNLOAD_VERSION;
  }
  if (opts.printVersion) {
    console.log(`version: ${opts.version}`);
  }
  const binariesToDownload = await (0, import_p_filter.default)(binaryJobs, async (job) => {
    const needsToBeDownloaded = await binaryNeedsToBeDownloaded(job, platform, opts.version);
    const isSupported = import_get_platform.platforms.includes(job.binaryTarget);
    const shouldDownload = isSupported && !job.envVarPath && needsToBeDownloaded;
    if (needsToBeDownloaded && !isSupported) {
      throw new Error(`Unknown binaryTarget ${job.binaryTarget} and no custom engine files were provided`);
    }
    return shouldDownload;
  });
  if (binariesToDownload.length > 0) {
    const cleanupPromise = (0, import_cleanupCache.cleanupCache)();
    let finishBar;
    let setProgress;
    if (opts.showProgress) {
      const collectiveBar = getCollectiveBar(opts);
      finishBar = collectiveBar.finishBar;
      setProgress = collectiveBar.setProgress;
    }
    await Promise.all(
      binariesToDownload.map(
        (job) => downloadBinary({
          ...job,
          version: opts.version,
          failSilent: opts.failSilent,
          progressCb: setProgress ? setProgress(job.targetFilePath) : void 0
        })
      )
    );
    await cleanupPromise;
    if (finishBar) {
      finishBar();
    }
  }
  const binaryPaths = binaryJobsToBinaryPaths(binaryJobs);
  const dir = eval("__dirname");
  if (dir.startsWith("/snapshot/")) {
    for (const engineType in binaryPaths) {
      const binaryTargets = binaryPaths[engineType];
      for (const binaryTarget in binaryTargets) {
        const binaryPath = binaryTargets[binaryTarget];
        binaryTargets[binaryTarget] = await maybeCopyToTmp(binaryPath);
      }
    }
  }
  return binaryPaths;
}
function getCollectiveBar(options2) {
  const hasNodeAPI = "libquery-engine" in options2.binaries;
  const bar = (0, import_log.getBar)(
    `Downloading Prisma engines${hasNodeAPI ? " for Node-API" : ""} for ${options2.binaryTargets?.map((p) => (0, import_colors.bold)(p)).join(" and ")}`
  );
  const progressMap = {};
  const numDownloads = Object.values(options2.binaries).length * Object.values(options2?.binaryTargets ?? []).length;
  const setProgress = (sourcePath) => (progress) => {
    progressMap[sourcePath] = progress;
    const progressValues = Object.values(progressMap);
    const totalProgress = progressValues.reduce((acc, curr) => {
      return acc + curr;
    }, 0) / numDownloads;
    if (options2.progressCb) {
      options2.progressCb(totalProgress);
    }
    if (bar) {
      bar.update(totalProgress);
    }
  };
  return {
    setProgress,
    finishBar: () => {
      bar.update(1);
      bar.terminate();
    }
  };
}
function binaryJobsToBinaryPaths(jobs) {
  return jobs.reduce((acc, job) => {
    if (!acc[job.binaryName]) {
      acc[job.binaryName] = {};
    }
    acc[job.binaryName][job.binaryTarget] = job.envVarPath || job.targetFilePath;
    return acc;
  }, {});
}
async function binaryNeedsToBeDownloaded(job, nativePlatform, version) {
  if (job.envVarPath && import_fs.default.existsSync(job.envVarPath)) {
    return false;
  }
  const targetExists = await exists(job.targetFilePath);
  const cachedFile = await getCachedBinaryPath({
    ...job,
    version
  });
  if (cachedFile) {
    if (job.skipCacheIntegrityCheck === true) {
      await (0, import_utils.overwriteFile)(cachedFile, job.targetFilePath);
      return false;
    }
    const sha256FilePath = cachedFile + ".sha256";
    if (await exists(sha256FilePath)) {
      const sha256File = await import_fs.default.promises.readFile(sha256FilePath, "utf-8");
      const sha256Cache = await (0, import_getHash.getHash)(cachedFile);
      if (sha256File === sha256Cache) {
        if (!targetExists) {
          debug(`copying ${cachedFile} to ${job.targetFilePath}`);
          await import_fs.default.promises.utimes(cachedFile, new Date(), new Date());
          await (0, import_utils.overwriteFile)(cachedFile, job.targetFilePath);
        }
        const targetSha256 = await (0, import_getHash.getHash)(job.targetFilePath);
        if (sha256File !== targetSha256) {
          debug(`overwriting ${job.targetFilePath} with ${cachedFile} as hashes do not match`);
          await (0, import_utils.overwriteFile)(cachedFile, job.targetFilePath);
        }
        return false;
      } else {
        return true;
      }
    } else if (process.env.PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING) {
      debug(`The checksum file: ${sha256FilePath} is missing but this was ignored as the PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING environment variable is truthy.`);
      return false;
    } else {
      return true;
    }
  }
  if (!targetExists) {
    debug(`file ${job.targetFilePath} does not exist and must be downloaded`);
    return true;
  }
  if (job.binaryTarget === nativePlatform) {
    const currentVersion = await getVersion(job.targetFilePath, job.binaryName);
    if (currentVersion?.includes(version) !== true) {
      debug(`file ${job.targetFilePath} exists but its version is ${currentVersion} and we expect ${version}`);
      return true;
    }
  }
  return false;
}
async function getVersion(enginePath, binaryName) {
  try {
    if (binaryName === "libquery-engine" /* QueryEngineLibrary */) {
      (0, import_get_platform.assertNodeAPISupported)();
      const commitHash = require(enginePath).version().commit;
      return `${"libquery-engine" /* QueryEngineLibrary */} ${commitHash}`;
    } else {
      const result = await (0, import_execa.default)(enginePath, ["--version"]);
      return result.stdout;
    }
  } catch {
  }
  return void 0;
}
function getBinaryName(binaryName, platform2) {
  if (binaryName === "libquery-engine" /* QueryEngineLibrary */) {
    return `${(0, import_get_platform.getNodeAPIName)(platform2, "fs")}`;
  }
  const extension = platform2 === "windows" ? ".exe" : "";
  return `${binaryName}-${platform2}${extension}`;
}
async function getCachedBinaryPath({
  version,
  binaryTarget,
  binaryName
}) {
  const cacheDir = await (0, import_utils.getCacheDir)(channel, version, binaryTarget);
  if (!cacheDir) {
    return null;
  }
  const cachedTargetPath = import_path.default.join(cacheDir, binaryName);
  if (!import_fs.default.existsSync(cachedTargetPath)) {
    return null;
  }
  if (version !== "latest") {
    return cachedTargetPath;
  }
  if (await exists(cachedTargetPath)) {
    return cachedTargetPath;
  }
  return null;
}
function getBinaryEnvVarPath(binaryName) {
  const envVar = BINARY_TO_ENV_VAR[binaryName];
  if (envVar && process.env[envVar]) {
    const envVarPath = import_path.default.resolve(process.cwd(), process.env[envVar]);
    if (!import_fs.default.existsSync(envVarPath)) {
      throw new Error(
        `Env var ${(0, import_colors.bold)(envVar)} is provided but provided path ${(0, import_colors.underline)(process.env[envVar])} can't be resolved.`
      );
    }
    debug(
      `Using env var ${(0, import_colors.bold)(envVar)} for binary ${(0, import_colors.bold)(binaryName)}, which points to ${(0, import_colors.underline)(
        process.env[envVar]
      )}`
    );
    return envVarPath;
  }
  return null;
}
async function downloadBinary(options2) {
  const { version, progressCb, targetFilePath, binaryTarget, binaryName } = options2;
  const downloadUrl = (0, import_utils.getDownloadUrl)("all_commits", version, binaryTarget, binaryName);
  const targetDir = import_path.default.dirname(targetFilePath);
  try {
    import_fs.default.accessSync(targetDir, import_fs.default.constants.W_OK);
    await (0, import_fs_extra.ensureDir)(targetDir);
  } catch (e) {
    if (options2.failSilent || e.code !== "EACCES") {
      return;
    } else {
      throw new Error(`Can't write to ${targetDir} please make sure you install "prisma" with the right permissions.`);
    }
  }
  debug(`Downloading ${downloadUrl} to ${targetFilePath}`);
  if (progressCb) {
    progressCb(0);
  }
  const { sha256, zippedSha256 } = await (0, import_downloadZip.downloadZip)(downloadUrl, targetFilePath, progressCb);
  if (progressCb) {
    progressCb(1);
  }
  if (process.platform !== "win32") {
    (0, import_chmod.default)(targetFilePath);
  }
  await saveFileToCache(options2, version, sha256, zippedSha256);
}
async function saveFileToCache(job, version, sha256, zippedSha256) {
  const cacheDir = await (0, import_utils.getCacheDir)(channel, version, job.binaryTarget);
  if (!cacheDir) {
    return;
  }
  const cachedTargetPath = import_path.default.join(cacheDir, job.binaryName);
  const cachedSha256Path = import_path.default.join(cacheDir, job.binaryName + ".sha256");
  const cachedSha256ZippedPath = import_path.default.join(cacheDir, job.binaryName + ".gz.sha256");
  try {
    await (0, import_utils.overwriteFile)(job.targetFilePath, cachedTargetPath);
    if (sha256 != null) {
      await import_fs.default.promises.writeFile(cachedSha256Path, sha256);
    }
    if (zippedSha256 != null) {
      await import_fs.default.promises.writeFile(cachedSha256ZippedPath, zippedSha256);
    }
  } catch (e) {
    debug(e);
  }
}
function engineTypeToBinaryType(engineType, binaryTarget) {
  if (BinaryType[engineType]) {
    return BinaryType[engineType];
  }
  if (engineType === "native") {
    return binaryTarget;
  }
  return engineType;
}
function mapKeys(obj, mapper) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[mapper(key)] = value;
    return acc;
  }, {});
}
async function maybeCopyToTmp(file) {
  const dir = eval("__dirname");
  if (dir.startsWith("/snapshot/")) {
    const targetDir = import_path.default.join(import_temp_dir.default, "prisma-binaries");
    await (0, import_fs_extra.ensureDir)(targetDir);
    const target = import_path.default.join(targetDir, import_path.default.basename(file));
    const data = await import_fs.default.promises.readFile(file);
    await import_fs.default.promises.writeFile(target, data);
    plusX(target);
    return target;
  }
  return file;
}
function plusX(file2) {
  const s = import_fs.default.statSync(file2);
  const newMode = s.mode | 64 | 8 | 1;
  if (s.mode === newMode) {
    return;
  }
  const base8 = newMode.toString(8).slice(-3);
  import_fs.default.chmodSync(file2, base8);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BinaryType,
  download,
  getBinaryEnvVarPath,
  getBinaryName,
  getVersion,
  maybeCopyToTmp,
  plusX
});
