import { r as reactExports } from "./worker-entry-nmbh7RaZ.js";
function useCallbackRef(callback) {
  const callbackRef = reactExports.useRef(callback);
  reactExports.useEffect(() => {
    callbackRef.current = callback;
  });
  return reactExports.useMemo(() => (...args) => callbackRef.current?.(...args), []);
}
var useLayoutEffect2 = globalThis?.document ? reactExports.useLayoutEffect : () => {
};
export {
  useLayoutEffect2 as a,
  useCallbackRef as u
};
