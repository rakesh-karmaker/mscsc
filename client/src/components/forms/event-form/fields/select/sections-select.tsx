import { sectionsData } from "@/services/data/event-form-data";
import capitalize from "@/utils/capitalize";
import { Popover } from "@mui/material";
import {
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { SetValueConfig } from "react-hook-form";
import LuPlus from "~icons/lucide/plus";
import LuX from "~icons/lucide/x";
import { TableBtn } from "@/components/ui/btns";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable, isSortable } from "@dnd-kit/react/sortable";

export default function SectionsSelect({
  setValue,
  selectedSections,
  setSelectedSections,
}: {
  setValue: (name: string, value: unknown, config?: SetValueConfig) => void;
  selectedSections: string[];
  setSelectedSections: Dispatch<SetStateAction<string[]>>;
}): ReactNode {
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState<string[]>(selectedSections);
  const id = "sections-select-popover";

  function handleAddSection(section: string) {
    if (!selectedSections.includes(section)) {
      const updatedSections = [...selectedSections, section];
      setSelectedSections(updatedSections);
      setSections(updatedSections);
      setValue("sections", updatedSections); // Sync with form
    }
  }

  function handleRemove(section: string) {
    const updatedSections = selectedSections.filter((item) => item !== section);
    setSelectedSections(updatedSections);
    setSections(updatedSections);
    setValue("sections", updatedSections); // Sync with form
  }

  return (
    <div className="w-full flex flex-wrap gap-4">
      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled) return;

          const { source } = event.operation;

          if (isSortable(source)) {
            const { initialIndex, index } = source;

            if (initialIndex !== index) {
              const newItems = [...selectedSections];
              const [removed] = newItems.splice(initialIndex, 1);
              newItems.splice(index, 0, removed);
              setSelectedSections(newItems);
              setValue("sections", newItems);
            }
          }
        }}
      >
        {sections.map((section, index) => (
          <SectionItem
            key={index}
            index={index}
            section={section}
            handleRemove={handleRemove}
          />
        ))}
      </DragDropProvider>
      <div>
        <button
          id={id}
          className={
            "flex items-center px-3.5! py-0.5! h-12 rounded-sm border border-black/20 hover:bg-lightest-black/20! transition-colors cursor-pointer"
          }
          aria-describedby={id}
          onClick={() => setOpen(!open)}
          style={{
            background: "white",
            opacity:
              sectionsData.sectionOptions.length > selectedSections.length
                ? 1
                : 0.5,
            pointerEvents:
              sectionsData.sectionOptions.length > selectedSections.length
                ? "auto"
                : "none",
          }}
          type="button"
        >
          <LuPlus className="mr-1! opacity-70" /> <span>Add Section</span>
        </button>
        <Popover
          id={id}
          open={open}
          anchorEl={document.getElementById(id)}
          onClose={() => setOpen(false)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          PaperProps={{
            style: {
              boxShadow: "rgba(149, 157, 165, 0.1) 0px 8px 24px",
              marginTop: "4px",
            },
          }}
          style={{
            opacity:
              sectionsData.sectionOptions.length > selectedSections.length
                ? 1
                : 0,
            pointerEvents:
              sectionsData.sectionOptions.length > selectedSections.length
                ? "auto"
                : "none",
          }}
        >
          <div className="w-full h-full flex flex-col bg-primary-bg rounded-md border border-gray-300">
            <div className="max-h-65 scroll-py-1 overflow-y-auto overflow-x-hidden flex flex-col p-1!">
              {sectionsData.sectionOptions.map((section, index) => (
                <div key={index}>
                  {!selectedSections.includes(section) && (
                    <TableBtn onClick={() => handleAddSection(section)}>
                      <LuPlus className="opacity-70" /> {capitalize(section)}
                    </TableBtn>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Popover>
      </div>
    </div>
  );
}

function SectionItem({
  section,
  handleRemove,
  index,
}: {
  section: string;
  handleRemove: (section: string) => void;
  index: number;
}): ReactNode {
  const { ref } = useSortable({ id: section, index });

  return (
    <div
      ref={ref}
      className="flex items-center gap-1 px-3.5! py-0.5! h-12 rounded-sm border bg-primary-bg border-black/20 hover:bg-red/10! transition-colors cursor-pointer"
      onClick={() => handleRemove(section)}
    >
      <div className="flex items-center gap-1">
        <LuX className="text-lg ml-1.5 text-red" />
        <p className="text-base mr-1!">{capitalize(section)}</p>
      </div>
    </div>
  );
}
