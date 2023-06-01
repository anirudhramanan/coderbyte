# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

1. Since the event can be undefined, it is better to handle it in the first line itself ie `if (!event)`. This is called short-circuit, and we return the expected value from here. This reduces the nesting of if/else blocks and improves code maintainability.
2. Used ternary operator to initiase the candidate variable. Ternary operator improves code readability and also reduces the number of lines. Although this does not mean that we should replace every if/else with ternary operator, but the call should be taken depending on the complexity of the code.
3. Moved out constant methods outside the function.
4. Move to typescript

### Typescript
We should use typescript, a strongly typed language built on javascript. As it is strong typed, it allows type-safety and also enables compile time checks reducing developer/runtime errors.

Converting the above function into ts:
````
import crypto from "crypto";

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

const deterministicPartitionKey = (event: any | undefined): string => {
  if (!event) {
    // since the event can be undefined, return 0 literal
    return TRIVIAL_PARTITION_KEY;
  }

  let candidate: string = event.partitionKey
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

````

The code is mostly similar, but now it has defined types. 
For eg:
1. Event can be undefined. If not handled, it will throw compile error.
2. Candidate type and the return type is `string`.