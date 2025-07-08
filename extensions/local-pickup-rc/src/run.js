// @ts-check

/**
* @typedef {import("../generated/api").RunInput} RunInput
* @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
*/

/**
* @param {RunInput} input
* @returns {FunctionRunResult}
*/
export function run(input) {
  // ✅ Check if any product has the "pickup-only" tag
  const hasPickupOnlyTag = input.cart.lines.some(line => {
    if (line.merchandise.__typename === 'ProductVariant') {
      return line.merchandise.product.hasAnyTag;
    }
    return false;
  });

  // ✅ If no tagged product, return no pickup option
  if (!hasPickupOnlyTag) {
    return {
      operations: [],
    };
  }

  // ✅ Else, show free pickup option with custom instruction
  return {
    operations: input.locations.map(location => ({
      add: {
        title: location.name,
        cost: 0.0, // Free pickup
        pickupLocation: {
          locationHandle: location.handle,
          pickupInstruction: "Ready for pickup today",
        }
      }
    }))
  };
}
