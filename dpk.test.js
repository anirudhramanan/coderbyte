const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns the literal '-1' when partitionKey is -1", () => {
    const trivialKey = deterministicPartitionKey({ partitionKey: "-1" });
    expect(trivialKey).toBe("-1");
  });

  it("Returns the literal '1' when partitionKey is 1", () => {
    const trivialKey = deterministicPartitionKey({ partitionKey: "1" });
    expect(trivialKey).toBe("1");
  });

  it("Returns the literal hash when the event is an empty object", () => {
    const trivialKey = deterministicPartitionKey({});
    const result = crypto.createHash("sha3-512").update("{}").digest("hex");
    expect(trivialKey).toBe(result);
  });

  it("Returns the literal hash when the event is an object", () => {
    const event = { key: 1 };
    const trivialKey = deterministicPartitionKey(event);
    const result = crypto
      .createHash("sha3-512")
      .update(JSON.stringify(event))
      .digest("hex");
    expect(trivialKey).toBe(result);
  });
});
