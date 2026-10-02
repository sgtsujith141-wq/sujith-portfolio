/* The background registers itself here so the intro and the route
 * transition can send a pulse through it without a shared React tree. */
type Pulse = (x?: number, y?: number) => void;
let pulseFn: Pulse = () => {};
export const field = {
  register(fn: Pulse) {
    pulseFn = fn;
  },
  pulse(x?: number, y?: number) {
    pulseFn(x, y);
  },
};
