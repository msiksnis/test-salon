// components/Dashboard/Treatments/DroppableContainer.js
import { useDrop } from "react-dnd";

export default function DroppableContainer({ children, index, onDrop }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "treatment",
    drop: (item) => onDrop(item, index),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const containerStyle = {
    marginBottom: "16px", // Adds a margin-bottom to create some space between treatments
  };

  return (
    <div
      ref={drop}
      style={{
        ...containerStyle,
        backgroundColor: isOver ? "#f3f4f6" : "white",
      }}
    >
      {children}
    </div>
  );
}
