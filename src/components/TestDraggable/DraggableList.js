import { useState, useEffect, useCallback } from "react";
import { Motion, spring } from "react-motion";
import styled from "styled-components";

// Constants and utility functions
const dataStructure = [
  [0, 1, 2],
  [3, 4, 5, 6, 7],
  [8, 9, 10, 11],
];

const gutterPadding = 21;
const height = 110;
const springSetting1 = { stiffness: 180, damping: 10 };
const springSetting2 = { stiffness: 150, damping: 16 };

const clamp = (n, min, max) => Math.max(Math.min(n, max), min);

export default function DraggableList() {
  const [mouse, setMouse] = useState([0, 0]);
  const [delta, setDelta] = useState([0, 0]);
  const [lastPress, setLastPress] = useState(null);
  const [currentColumn, setCurrentColumn] = useState(null);
  const [isPressed, setIsPressed] = useState(false);
  const [order, setOrder] = useState(dataStructure);
  const [isResizing, setIsResizing] = useState(false);
  const [columnWidth, setColumnWidth] = useState(0);
  const [layout, setLayout] = useState(() => {
    return dataStructure.map((column, col) => {
      return Array.from({ length: column.length + 1 }, (_, row) => [0, 0]);
    });
  });

  const updateColumnWidth = () => {
    setColumnWidth(
      window.innerWidth / dataStructure.length -
        gutterPadding / dataStructure.length
    );
  };

  useEffect(() => {
    updateColumnWidth();

    window.addEventListener("resize", updateColumnWidth);
    return () => {
      window.removeEventListener("resize", updateColumnWidth);
    };
  }, []);

  useEffect(() => {
    if (columnWidth) {
      calculateVisiblePositions(dataStructure);
    }
  }, [columnWidth]);

  useEffect(() => {
    const handleResize = () => {
      setIsResizing(true);
      setTimeout(() => setIsResizing(false), 100);
    };

    updateColumnWidth();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleTouchStart = useCallback(
    (key, currentColumn, pressLocation, e) => {
      handleMouseDown(key, currentColumn, pressLocation, e.touches[0]);
    },
    []
  );

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    handleMouseMove(e.touches[0]);
  }, []);

  const handleMouseMove = useCallback(
    ({ pageX, pageY }) => {
      if (isPressed) {
        const newMouse = [pageX - delta[0], pageY - delta[1]];
        const colTo = clamp(
          Math.floor((newMouse[0] + columnWidth / 2) / columnWidth),
          0,
          2
        );
        const rowTo = clamp(
          Math.floor((newMouse[1] + height / 2) / height),
          0,
          100
        );
        const rowFrom = order[currentColumn].indexOf(lastPress);
        const newOrder = reinsert(order, currentColumn, rowFrom, colTo, rowTo);

        setMouse(newMouse);
        setOrder(newOrder);
        setCurrentColumn(colTo);
      }
    },
    [isPressed, delta, order, currentColumn, lastPress, columnWidth]
  );

  const handleMouseDown = useCallback(
    (key, currentColumn, [pressX, pressY], { pageX, pageY }) => {
      setLastPress(key);
      setCurrentColumn(currentColumn);
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

  const calculateVisiblePositions = (newOrder) => {
    const newLayout = newOrder.map((column, col) => {
      return Array.from({ length: column.length + 1 }, (_, row) => {
        return [columnWidth * col, height * row];
      });
    });
    setLayout(newLayout);
  };

  const reinsert = (array, colFrom, rowFrom, colTo, rowTo) => {
    const _array = array.slice(0);
    const val = _array[colFrom][rowFrom];
    _array[colFrom].splice(rowFrom, 1);
    _array[colTo].splice(rowTo, 0, val);
    calculateVisiblePositions(_array);
    return _array;
  };

  useEffect(() => {
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchend", handleMouseUp);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleTouchMove, handleMouseMove, handleMouseUp]);

  return (
    <div className="relative">
      {order.map((column, colIndex) =>
        column.map((row) => {
          let style;
          let x, y;
          const visualPosition = order[colIndex].indexOf(row);
          const isActive =
            row === lastPress && colIndex === currentColumn && isPressed;
          if (isActive) {
            [x, y] = mouse;
            style = {
              translateX: x,
              translateY: y,
              scale: spring(1.1, springSetting1),
            };
          } else if (isResizing) {
            [x, y] = layout[colIndex][visualPosition];
            style = {
              translateX: x,
              translateY: y,
              scale: 1,
            };
          } else {
            [x, y] = layout[colIndex][visualPosition];
            style = {
              translateX: spring(x, springSetting2),
              translateY: spring(y, springSetting2),
              scale: spring(1, springSetting1),
            };
          }

          return (
            <Motion key={row} style={style}>
              {({ translateX, translateY, scale }) => (
                <div
                  onMouseDown={handleMouseDown.bind(null, row, colIndex, [
                    x,
                    y,
                  ])}
                  onTouchStart={handleTouchStart.bind(null, row, colIndex, [
                    x,
                    y,
                  ])}
                  className={`bg-white hover:bg-slate-200 shadow border border-slate-900 text-slate-900 rounded p-4 absolute select-none cursor-grab${
                    isActive ? " cursor-grabbing" : ""
                  }`}
                  style={{
                    WebkitTransform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                    transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                    zIndex:
                      row === lastPress && colIndex === currentColumn
                        ? 99
                        : visualPosition,
                  }}
                >
                  Item
                  {row + 1}
                </div>
              )}
            </Motion>
          );
        })
      )}
    </div>
  );
}
