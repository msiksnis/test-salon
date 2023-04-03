// components/Dashboard/Treatments/DraggableTreatmentjs
import { useDrag } from "react-dnd";

export default function DraggableTreatment({
  id,
  index,
  setDraggedTreatmentIndex,
  children,
  className,
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "treatment",
    item: () => {
      setDraggedTreatmentIndex(index);
      return { id };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={className}
    >
      {children}
    </div>
  );
}
