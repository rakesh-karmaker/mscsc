import { useSortable } from "@dnd-kit/sortable";
import { type ReactNode } from "react";
import { CSS } from "@dnd-kit/utilities";
import { LuGripVertical } from "react-icons/lu";

export default function DraggableItem({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}): ReactNode {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <LuGripVertical {...listeners} size={15} />
      {children}
    </div>
  );
}
