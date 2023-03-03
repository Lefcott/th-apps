export function generateIdFn(componentName) {
  const base = componentName;
  return (name) => `${base}-${name}`;
}
