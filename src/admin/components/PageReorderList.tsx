import { useRef } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { GripVertical, X } from "lucide-react";

const ItemType = "COMIC_PAGE";

interface DraggablePageProps {
  id: string;
  url: string;
  index: number;
  movePage: (dragIndex: number, hoverIndex: number) => void;
  removePage: (index: number) => void;
}

const DraggablePage = ({ id, url, index, movePage, removePage }: DraggablePageProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemType,
    collect(monitor) {
      return { handlerId: monitor.getHandlerId() };
    },
    hover(item: any, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      movePage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: () => ({ id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div 
      ref={ref} 
      className={`relative group bg-slate-100 rounded border border-slate-200 overflow-hidden flex items-center ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      data-handler-id={handlerId}
    >
      <div className="p-2 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600">
        <GripVertical size={16} />
      </div>
      <img src={url} alt={`Page ${index + 1}`} className="w-12 h-16 object-cover border-l border-r border-slate-200" />
      <div className="flex-1 px-3">
        <span className="text-sm font-medium text-slate-700">Page {index + 1}</span>
      </div>
      <button 
        type="button" 
        onClick={() => removePage(index)}
        className="p-3 text-slate-400 hover:text-red-600 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export function PageReorderList({ pages, onChange }: { pages: string[]; onChange: (pages: string[]) => void }) {
  if (!pages || pages.length === 0) return null;

  const movePage = (dragIndex: number, hoverIndex: number) => {
    const updated = [...pages];
    const [dragged] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, dragged);
    onChange(updated);
  };

  const removePage = (indexToRemove: number) => {
    onChange(pages.filter((_, i) => i !== indexToRemove));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-2 mt-4 max-h-[400px] overflow-y-auto pr-2">
        {pages.map((url, i) => (
          <DraggablePage 
            key={url + i} 
            id={url} 
            url={url} 
            index={i} 
            movePage={movePage} 
            removePage={removePage} 
          />
        ))}
      </div>
    </DndProvider>
  );
}
