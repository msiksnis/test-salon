import { useState, useEffect, useCallback } from "react";
import { Motion, spring } from "react-motion";

const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const height = 60;
const springSetting1 = { stiffness: 180, damping: 10 };
const springSetting2 = { stiffness: 150, damping: 16 };

const clamp = (n, min, max) => Math.max(Math.min(n, max), min);

export default function OneColumn() {
  const [mouse, setMouse] = useState([0, 0]);
  const [delta, setDelta] = useState([0, 0]);
  const [lastPress, setLastPress] = useState(null);
  const [isPressed, setIsPressed] = useState(false);
  const [order, setOrder] = useState(data);

  const handleMouseDown = useCallback(
    (key, [pressX, pressY], { pageX, pageY }) => {
      setLastPress(key);
      setIsPressed(true);
      setDelta([pageX - pressX, pageY - pressY]);
      setMouse([pressX, pressY]);
    },
    []
  );

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
    setDelta([0, 0]);
  }, []);

  const handleMouseMove = useCallback(
    ({ pageX, pageY }) => {
      if (isPressed) {
        const newMouse = [pageX - delta[0], pageY - delta[1]];
        const rowTo = clamp(
          Math.floor((newMouse[1] + height / 2) / height),
          0,
          100
        );
        const rowFrom = order.indexOf(lastPress);
        const newRowOrder = reinsert(order, rowFrom, rowTo);

        setMouse(newMouse);
        setOrder(newRowOrder);
      }
    },
    [isPressed, delta, order, lastPress]
  );

  const reinsert = (array, from, to) => {
    const newArray = array.slice(0);
    const val = newArray[from];
    newArray.splice(from, 1);
    newArray.splice(to, 0, val);
    return newArray;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className="relative mx-40 mt-20">
      {order.map((item, index) => {
        let style;
        let y;
        const isActive = item === lastPress && isPressed;

        if (isActive) {
          [, y] = mouse;
          style = {
            translateY: y,
            scale: spring(1.1, springSetting1),
          };
        } else {
          y = height * index;
          style = {
            translateY: spring(y, springSetting2),
            scale: spring(1, springSetting1),
          };
        }

        return (
          <Motion key={item} style={style}>
            {({ translateY, scale }) => (
              <div
                onMouseDown={handleMouseDown.bind(null, item, [0, y])}
                className={`bg-green-500 text-white rounded flex justify-center w-full py-2 absolute select-none cursor-grab${
                  isActive ? " cursor-grabbing" : ""
                }`}
                style={{
                  WebkitTransform: `translate3d(${translateY}px, 0) scale(${scale})`,
                  transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
                  zIndex: item === lastPress ? 99 : index,
                }}
              >
                Item {item + 1}
              </div>
            )}
          </Motion>
        );
      })}
    </div>
  );
}
