const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

exports.deterministicPartitionKey = (event) => {
  if (!event) {
    // since the event can be undefined, return 0 literal
    return TRIVIAL_PARTITION_KEY;
  }

  let candidate = event.partitionKey
    ? event.partitionKey
    : crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex");

  if (typeof candidate !== "string") {
    candidate = JSON.stringify(candidate);
  }

  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }
  return candidate;
};
