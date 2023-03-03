export const isOver = (element, pointerX, pointerY) => {
  const rootPosition = element?.getBoundingClientRect();
  return (
    pointerX <= rootPosition?.right &&
    pointerX >= rootPosition?.left &&
    pointerY <= rootPosition?.bottom &&
    pointerY >= rootPosition?.top
  );
};
