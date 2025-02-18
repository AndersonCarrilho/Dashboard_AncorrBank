import { Buffer } from "buffer";

// Polyfill Buffer
if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

if (typeof global !== "undefined") {
  global.Buffer = Buffer;
}

// Polyfill process
if (typeof window !== "undefined" && !window.process) {
  window.process = { env: {} };
}

// Initialize crypto
if (typeof window !== "undefined" && !window.crypto) {
  window.crypto = require("crypto").webcrypto;
}

export {};
