/* eslint-disable func-names */
/* eslint-disable prefer-rest-params */
import {
  useLayoutEffect,
  useRef,
  useInsertionEffect, // Only available in React 18+
} from "react";

//   type AnyFunction = (...args: any[]) => any;

/*
 * Suppress the warning when using useLayoutEffect with SSR. (https://reactjs.org/link/uselayouteffect-ssr)
 * Make use of useInsertionEffect if available.
 */
const useBrowserEffect =
  typeof window !== "undefined"
    ? useInsertionEffect ?? useLayoutEffect
    : () => {};

/*
 * Similar to useCallback, with a few subtle differences:
 * - The returned function is a stable reference, and will always be the same between renders
 * - No dependency lists required
 * - Properties or state accessed within the callback will always be "current"
 */

export default function useLatestClosure(callback) {
  // Keep track of the latest callback:
  const latestRef = useRef(useLatestClosure_shouldNotBeInvokedBeforeMount);
  useBrowserEffect(() => {
    latestRef.current = callback;
  }, [callback]);

  // Create a stable callback that always calls the latest callback:
  // using useRef instead of useCallback avoids creating and empty array on every render
  const stableRef = useRef(null);
  if (!stableRef.current) {
    stableRef.current = function () {
      return latestRef.current.apply(this, arguments);
    };
  }

  return stableRef.current;
}

/*
 * Render methods should be pure, especially when concurrency is used,
 * so we will throw this error if the callback is called while rendering.
 */
function useLatestClosure_shouldNotBeInvokedBeforeMount() {
  throw new Error(
    "INVALID_USELATESTCLOSURE_INVOCATION: the callback from useLatestClosure cannot be invoked before the component has mounted.",
  );
}
