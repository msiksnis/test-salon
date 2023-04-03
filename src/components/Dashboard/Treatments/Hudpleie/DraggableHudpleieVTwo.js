import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import { Motion, spring } from "react-motion";
import { fetchTreatments } from "../../../../../utils/fetchTreatments";
import PulsingLoader from "../../../PulsingLoader";
import { TbDragDrop2 as DragDropIcon } from "react-icons/tb";
import { GoPlus } from "react-icons/go";

const springSetting1 = { stiffness: 180, damping: 10 };
const springSetting2 = { stiffness: 150, damping: 15 };
const gap = 20;

const clamp = (n, min, max) => Math.max(Math.min(n, max), min);

export default function DraggableHudpleieVTwo() {
  const [mouse, setMouse] = useState([0, 0]);
  const [delta, setDelta] = useState([0, 0]);
  const [lastPress, setLastPress] = useState(null);
  const [isPressed, setIsPressed] = useState(false);
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [itemHeights, setItemHeights] = useState([]);
  const [totalHeight, setTotalHeight] = useState(0);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    const newTotalHeight = order.reduce((heightAccumulator, item, index) => {
      const titleHeight = item.title.split("\n").length * 20;
      const descriptionHeight = item.shortDescription
        ? item.shortDescription.split("\n").length * 16
        : 0;

      return heightAccumulator + titleHeight + descriptionHeight + 40;
    }, 0);

    setTotalHeight(newTotalHeight);
  }, [order]);

  useEffect(() => {
    async function fetchData() {
      const items = await fetchTreatments("hudpleie");
      setOrder(items);
      setLoading(false);
    }
    fetchData();
  }, []);

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
          Math.floor((newMouse[1] + itemHeights[lastPress] / 2) / gap),
          0,
          100
        );
        const rowFrom = order.findIndex((item) => item._id === lastPress);
        const newRowOrder = reinsert(order, rowFrom, rowTo);

        setMouse(newMouse);
        setOrder(newRowOrder);
      }
    },
    [isPressed, delta, order, lastPress, itemHeights]
  );

  const reinsert = (array, from, to) => {
    if (from === to) return array;
    const newArray = array.slice(0);
    const val = newArray[from];
    newArray.splice(from, 1);
    newArray.splice(to, 0, val);
    return newArray;
  };

  const setItemHeight = (index, height) => {
    setItemHeights((prevHeights) => {
      const newHeights = [...prevHeights];
      newHeights[index] = height;
      return newHeights;
    });
  };

  const itemRefs = useRef([]);

  useLayoutEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, order.length);

    itemRefs.current.forEach((ref, index) => {
      if (ref) {
        const { height } = ref.getBoundingClientRect();
        setItemHeight(index, height);
      }
    });
  }, [order]);

  const calculateYPosition = (index) => {
    return itemHeights.slice(0, index).reduce((acc, cur) => acc + cur + gap, 0);
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
    <div className="relative mx-14 shadow-box rounded-md bg-white">
      <div className="flex justify-between items-center mr-10">
        <h1 className="text-2xl p-10 text-gray-700 md:text-4xl">Hudpleie</h1>
        <button
          className="flex items-center uppercase border border-slate-900 rounded px-10 py-2 bg-slate-900 text-white hover:bg-white hover:text-slate-900 transition-all duration-300 shadow"
          onClick={toggleModal}
        >
          <GoPlus className="h-[18px] w-[18px] mr-2" /> Add New
        </button>
      </div>
      <h2 className="text-2xl my-10 mx-10">Hudpleie Dame</h2>
      <div
        className="flex flex-col items-center"
        style={{ minHeight: `${totalHeight + 80}px` }}
      >
        {loading ? (
          <PulsingLoader />
        ) : (
          order
            .filter((item) => item && item._id)
            .map((item, index) => {
              let style;
              let y;
              const isActive =
                item &&
                item._id &&
                lastPress &&
                item._id === lastPress &&
                isPressed;

              if (isActive) {
                [, y] = mouse;
                style = {
                  translateY: y,
                  scale: spring(1.02, springSetting1),
                };
              } else {
                y = calculateYPosition(index);
                style = {
                  translateY: spring(y, springSetting2),
                  scale: spring(1, springSetting1),
                };
              }

              return (
                <Motion key={item._id} style={style}>
                  {({ translateY, scale }) => (
                    <div
                      ref={(el) => (itemRefs.current[index] = el)}
                      onMouseDown={handleMouseDown.bind(null, item._id, [0, y])}
                      className={`absolute bg-white group w-full shadow-4 py-2 select-none cursor-grab${
                        isActive ? "cursor-grabbing bg-gray-50" : ""
                      }`}
                      style={{
                        WebkitTransform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
                        transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
                        zIndex: item === lastPress ? 99 : index,
                        width: "calc(100% - 80px)",
                        marginLeft: "40px",
                        marginRight: "40px",
                      }}
                    >
                      <div className="px-10 pl-2">
                        <div className="flex flex-col relative">
                          <DragDropIcon className="absolute left-0 top-1/2 -translate-y-1/2 mr-4 h-6 w-6 opacity-0 group-hover:opacity-80 transition-opacity duration-200" />
                          <div className="flex justify-between pl-10 w-full">
                            <div className="">{item.title}</div>
                            <h3 className="whitespace-nowrap font-normal">
                              {item.price} kr
                            </h3>
                          </div>
                          <p className="pt-1 px-10 text-sm opacity-60">
                            {item.shortDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </Motion>
              );
            })
        )}
      </div>
      <div className="flex justify-center pb-10">
        <button
          // onClick={handleSaveChanges}
          className="bg-slate-900 text-white px-14 py-2 mt-4 rounded uppercase border border-slate-900 hover:bg-white hover:text-slate-900 transition-all duration-300 cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
