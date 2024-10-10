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
var getPlatform_exports = {};
__export(getPlatform_exports, {
  computeLibSSLSpecificPaths: () => computeLibSSLSpecificPaths,
  getArchFromUname: () => getArchFromUname,
  getPlatform: () => getPlatform,
  getPlatformInfo: () => getPlatformInfo,
  getPlatformInfoMemoized: () => getPlatformInfoMemoized,
  getPlatformInternal: () => getPlatformInternal,
  getSSLVersion: () => getSSLVersion,
  getos: () => getos,
  parseDistro: () => parseDistro,
  parseLibSSLVersion: () => parseLibSSLVersion,
  parseOpenSSLVersion: () => parseOpenSSLVersion,
  resolveDistro: () => resolveDistro
});
module.exports = __toCommonJS(getPlatform_exports);
var import_debug = __toESM(require("@prisma/debug"));
var import_child_process = __toESM(require("child_process"));
var import_promises = __toESM(require("fs/promises"));
var import_os = __toESM(require("os"));
var import_ts_pattern = require("ts-pattern");
var import_util = require("util");
var import_link = require("./link");
var import_logger = require("./logger");
const exec = (0, import_util.promisify)(import_child_process.default.exec);
const debug = (0, import_debug.default)("prisma:get-platform");
const supportedLibSSLVersions = ["1.0.x", "1.1.x", "3.0.x"];
async function getos() {
  const platform = import_os.default.platform();
  const arch = process.arch;
  if (platform === "freebsd") {
    const version = await getCommandOutput(`freebsd-version`);
    if (version && version.trim().length > 0) {
      const regex = /^(\d+)\.?/;
      const match2 = regex.exec(version);
      if (match2) {
        return {
          platform: "freebsd",
          targetDistro: `freebsd${match2[1]}`,
          arch
        };
      }
    }
  }
  if (platform !== "linux") {
    return {
      platform,
      arch
    };
  }
  const distroInfo = await resolveDistro();
  const archFromUname = await getArchFromUname();
  const libsslSpecificPaths = computeLibSSLSpecificPaths({ arch, archFromUname, familyDistro: distroInfo.familyDistro });
  const { libssl } = await getSSLVersion(libsslSpecificPaths);
  return {
    platform: "linux",
    libssl,
    arch,
    archFromUname,
    ...distroInfo
  };
}
function parseDistro(osReleaseInput) {
  const idRegex = /^ID="?([^"\n]*)"?$/im;
  const idLikeRegex = /^ID_LIKE="?([^"\n]*)"?$/im;
  const idMatch = idRegex.exec(osReleaseInput);
  const id = idMatch && idMatch[1] && idMatch[1].toLowerCase() || "";
  const idLikeMatch = idLikeRegex.exec(osReleaseInput);
  const idLike = idLikeMatch && idLikeMatch[1] && idLikeMatch[1].toLowerCase() || "";
  const distroInfo = (0, import_ts_pattern.match)({ id, idLike }).with(
    { id: "alpine" },
    ({ id: originalDistro }) => ({
      targetDistro: "musl",
      familyDistro: originalDistro,
      originalDistro
    })
  ).with(
    { id: "raspbian" },
    ({ id: originalDistro }) => ({
      targetDistro: "arm",
      familyDistro: "debian",
      originalDistro
    })
  ).with(
    { id: "nixos" },
    ({ id: originalDistro }) => ({
      targetDistro: "nixos",
      originalDistro,
      familyDistro: "nixos"
    })
  ).with(
    { id: "debian" },
    { id: "ubuntu" },
    ({ id: originalDistro }) => ({
      targetDistro: "debian",
      familyDistro: "debian",
      originalDistro
    })
  ).with(
    { id: "rhel" },
    { id: "centos" },
    { id: "fedora" },
    ({ id: originalDistro }) => ({
      targetDistro: "rhel",
      familyDistro: "rhel",
      originalDistro
    })
  ).when(
    ({ idLike: idLike2 }) => idLike2.includes("debian") || idLike2.includes("ubuntu"),
    ({ id: originalDistro }) => ({
      targetDistro: "debian",
      familyDistro: "debian",
      originalDistro
    })
  ).when(
    ({ idLike: idLike2 }) => id === "arch" || idLike2.includes("arch"),
    ({ id: originalDistro }) => ({
      targetDistro: "debian",
      familyDistro: "arch",
      originalDistro
    })
  ).when(
    ({ idLike: idLike2 }) => idLike2.includes("centos") || idLike2.includes("fedora") || idLike2.includes("rhel") || idLike2.includes("suse"),
    ({ id: originalDistro }) => ({
      targetDistro: "rhel",
      familyDistro: "rhel",
      originalDistro
    })
  ).otherwise(({ id: originalDistro }) => {
    return {
      targetDistro: void 0,
      familyDistro: void 0,
      originalDistro
    };
  });
  debug(`Found distro info:
${JSON.stringify(distroInfo, null, 2)}`);
  return distroInfo;
}
async function resolveDistro() {
  const osReleaseFile = "/etc/os-release";
  try {
    const osReleaseInput = await import_promises.default.readFile(osReleaseFile, { encoding: "utf-8" });
    return parseDistro(osReleaseInput);
  } catch (_) {
    return {
      targetDistro: void 0,
      familyDistro: void 0,
      originalDistro: void 0
    };
  }
}
function parseOpenSSLVersion(input) {
  const match2 = /^OpenSSL\s(\d+\.\d+)\.\d+/.exec(input);
  if (match2) {
    const partialVersion = `${match2[1]}.x`;
    return sanitiseSSLVersion(partialVersion);
  }
  return void 0;
}
function parseLibSSLVersion(input) {
  const match2 = /libssl\.so\.(\d)(\.\d)?/.exec(input);
  if (match2) {
    const partialVersion = `${match2[1]}${match2[2] ?? ".0"}.x`;
    return sanitiseSSLVersion(partialVersion);
  }
  return void 0;
}
function sanitiseSSLVersion(version) {
  const sanitisedVersion = (() => {
    if (isLibssl1x(version)) {
      return version;
    }
    const versionSplit = version.split(".");
    versionSplit[1] = "0";
    return versionSplit.join(".");
  })();
  if (supportedLibSSLVersions.includes(sanitisedVersion)) {
    return sanitisedVersion;
  }
  return void 0;
}
function computeLibSSLSpecificPaths(args) {
  return (0, import_ts_pattern.match)(args).with({ familyDistro: "musl" }, () => {
    debug('Trying platform-specific paths for "alpine"');
    return ["/lib"];
  }).with({ familyDistro: "debian" }, ({ archFromUname }) => {
    debug('Trying platform-specific paths for "debian" (and "ubuntu")');
    return [`/usr/lib/${archFromUname}-linux-gnu`, `/lib/${archFromUname}-linux-gnu`];
  }).with({ familyDistro: "rhel" }, () => {
    debug('Trying platform-specific paths for "rhel"');
    return ["/lib64", "/usr/lib64"];
  }).otherwise(({ familyDistro, arch, archFromUname }) => {
    debug(`Don't know any platform-specific paths for "${familyDistro}" on ${arch} (${archFromUname})`);
    return [];
  });
}
async function getSSLVersion(libsslSpecificPaths) {
  const excludeLibssl0x = 'grep -v "libssl.so.0"';
  const libsslFilenameFromSpecificPath = await findLibSSLInLocations(libsslSpecificPaths);
  if (libsslFilenameFromSpecificPath) {
    debug(`Found libssl.so file using platform-specific paths: ${libsslFilenameFromSpecificPath}`);
    const libsslVersion = parseLibSSLVersion(libsslFilenameFromSpecificPath);
    debug(`The parsed libssl version is: ${libsslVersion}`);
    if (libsslVersion) {
      return { libssl: libsslVersion, strategy: "libssl-specific-path" };
    }
  }
  debug('Falling back to "ldconfig" and other generic paths');
  let libsslFilename = await getCommandOutput(
    `ldconfig -p | sed "s/.*=>s*//" | sed "s|.*/||" | grep libssl | sort | ${excludeLibssl0x}`
  );
  if (!libsslFilename) {
    libsslFilename = await findLibSSLInLocations(["/lib64", "/usr/lib64", "/lib"]);
  }
  if (libsslFilename) {
    debug(`Found libssl.so file using "ldconfig" or other generic paths: ${libsslFilename}`);
    const libsslVersion = parseLibSSLVersion(libsslFilename);
    debug(`The parsed libssl version is: ${libsslVersion}`);
    if (libsslVersion) {
      return { libssl: libsslVersion, strategy: "ldconfig" };
    }
  }
  const openSSLVersionLine = await getCommandOutput("openssl version -v");
  if (openSSLVersionLine) {
    debug(`Found openssl binary with version: ${openSSLVersionLine}`);
    const openSSLVersion = parseOpenSSLVersion(openSSLVersionLine);
    debug(`The parsed openssl version is: ${openSSLVersion}`);
    if (openSSLVersion) {
      return { libssl: openSSLVersion, strategy: "openssl-binary" };
    }
  }
  debug(`Couldn't find any version of libssl or OpenSSL in the system`);
  return {};
}
async function findLibSSLInLocations(directories) {
  for (const dir of directories) {
    const libssl = await findLibSSL(dir);
    if (libssl) {
      return libssl;
    }
  }
  return void 0;
}
async function findLibSSL(directory) {
  try {
    const dirContents = await import_promises.default.readdir(directory);
    return dirContents.find((value) => value.startsWith("libssl.so") && !value.startsWith("libssl.so.0"));
  } catch (e) {
    if (e.code === "ENOENT") {
      return void 0;
    }
    throw e;
  }
}
async function getPlatform() {
  const { binaryTarget } = await getPlatformInfoMemoized();
  return binaryTarget;
}
function isPlatformInfoDefined(args) {
  return args.binaryTarget !== void 0;
}
async function getPlatformInfo() {
  const { memoized: _, ...rest } = await getPlatformInfoMemoized();
  return rest;
}
let memoizedPlatformWithInfo = {};
async function getPlatformInfoMemoized() {
  if (isPlatformInfoDefined(memoizedPlatformWithInfo)) {
    return Promise.resolve({ ...memoizedPlatformWithInfo, memoized: true });
  }
  const args = await getos();
  const binaryTarget = getPlatformInternal(args);
  memoizedPlatformWithInfo = { ...args, binaryTarget };
  return { ...memoizedPlatformWithInfo, memoized: false };
}
function getPlatformInternal(args) {
  const { platform, arch, archFromUname, libssl, targetDistro, familyDistro, originalDistro } = args;
  if (platform === "linux" && !["x64", "arm64"].includes(arch)) {
    (0, import_logger.warn)(
      `Prisma only officially supports Linux on amd64 (x86_64) and arm64 (aarch64) system architectures. If you are using your own custom Prisma engines, you can ignore this warning, as long as you've compiled the engines for your system architecture "${archFromUname}".`
    );
  }
  const defaultLibssl = "1.1.x";
  if (platform === "linux" && libssl === void 0) {
    const additionalMessage = (0, import_ts_pattern.match)({ familyDistro }).with({ familyDistro: "debian" }, () => {
      return "Please manually install OpenSSL via `apt-get update -y && apt-get install -y openssl` and try installing Prisma again. If you're running Prisma on Docker, add this command to your Dockerfile, or switch to an image that already has OpenSSL installed.";
    }).otherwise(() => {
      return "Please manually install OpenSSL and try installing Prisma again.";
    });
    (0, import_logger.warn)(
      `Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-${defaultLibssl}".
${additionalMessage}`
    );
  }
  const defaultDistro = "debian";
  if (platform === "linux" && targetDistro === void 0) {
    (0, import_logger.warn)(
      `Prisma doesn't know which engines to download for the Linux distro "${originalDistro}". Falling back to Prisma engines built "${defaultDistro}".
Please report your experience by creating an issue at ${(0, import_link.link)(
        "https://github.com/prisma/prisma/issues"
      )} so we can add your distro to the list of known supported distros.`
    );
  }
  if (platform === "darwin" && arch === "arm64") {
    return "darwin-arm64";
  }
  if (platform === "darwin") {
    return "darwin";
  }
  if (platform === "win32") {
    return "windows";
  }
  if (platform === "freebsd") {
    return targetDistro;
  }
  if (platform === "openbsd") {
    return "openbsd";
  }
  if (platform === "netbsd") {
    return "netbsd";
  }
  if (platform === "linux" && targetDistro === "nixos") {
    return "linux-nixos";
  }
  if (platform === "linux" && arch === "arm64") {
    const baseName = targetDistro === "musl" ? "linux-musl-arm64" : "linux-arm64";
    return `${baseName}-openssl-${libssl || defaultLibssl}`;
  }
  if (platform === "linux" && arch === "arm") {
    return `linux-arm-openssl-${libssl || defaultLibssl}`;
  }
  if (platform === "linux" && targetDistro === "musl") {
    const base = "linux-musl";
    if (!libssl) {
      return base;
    }
    if (isLibssl1x(libssl)) {
      return base;
    } else {
      return `${base}-openssl-${libssl}`;
    }
  }
  if (platform === "linux" && targetDistro && libssl) {
    return `${targetDistro}-openssl-${libssl}`;
  }
  if (platform !== "linux") {
    (0, import_logger.warn)(`Prisma detected unknown OS "${platform}" and may not work as expected. Defaulting to "linux".`);
  }
  if (libssl) {
    return `${defaultDistro}-openssl-${libssl}`;
  }
  if (targetDistro) {
    return `${targetDistro}-openssl-${defaultLibssl}`;
  }
  return `${defaultDistro}-openssl-${defaultLibssl}`;
}
async function discardError(runPromise) {
  try {
    return await runPromise();
  } catch (e) {
    return void 0;
  }
}
function getCommandOutput(command) {
  return discardError(async () => {
    const result = await exec(command);
    debug(`Command "${command}" successfully returned "${result.stdout}"`);
    return result.stdout;
  });
}
async function getArchFromUname() {
  if (typeof import_os.default["machine"] === "function") {
    return import_os.default["machine"]();
  }
  const arch = await getCommandOutput("uname -m");
  return arch?.trim();
}
function isLibssl1x(libssl) {
  return libssl.startsWith("1.");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  computeLibSSLSpecificPaths,
  getArchFromUname,
  getPlatform,
  getPlatformInfo,
  getPlatformInfoMemoized,
  getPlatformInternal,
  getSSLVersion,
  getos,
  parseDistro,
  parseLibSSLVersion,
  parseOpenSSLVersion,
  resolveDistro
});
