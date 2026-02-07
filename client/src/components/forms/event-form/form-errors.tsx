import { Modal } from "@mui/material";
import { type Dispatch, type ReactNode, type SetStateAction } from "react";
import { FaXmark } from "react-icons/fa6";

type Errors = Record<string, any>;

const humanize = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function FormErrorsModal({
  errors,
  open,
  setOpen,
}: {
  errors: Errors | null;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}): ReactNode {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="delete modal"
      aria-describedby="confirm delete dialog"
      className="flex items-center justify-center h-fit min-h-screen max-sm:overflow-y-auto absolute max-sm:bg-primary-bg border-none! outline-none! focus-visible:outline-none"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="w-full max-w-[28.75em] max-h-[92vh] max-sm:max-h-screen max-sm:max-w-full max-sm:min-h-screen bg-primary-bg overflow-y-auto border-none! outline-none! focus-visible:outline-none rounded-lg">
        <div className="min-h-fit max-sm:max-h-full p-7! flex flex-col max-xs:justify-center gap-3 relative">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center gap-3">
              <h2 className="text-xl font-semibold">Form Errors</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-2xl transition-all duration-200 hover:text-red-400 cursor-pointer"
                aria-label="Close Delete Dialog"
                type="button"
              >
                <FaXmark />
              </button>
            </div>
            <div className="w-full h-px bg-light-black/10 mb-2!"></div>
            <FormErrors errors={errors} />
          </div>
        </div>
      </div>
    </Modal>
  );
}

function FormErrors({
  errors,
  seen = new WeakSet(),
}: {
  errors?: Errors | null;
  seen?: WeakSet<any>;
}): ReactNode {
  if (!errors || typeof errors !== "object" || Object.keys(errors).length === 0)
    return null;
  if (seen.has(errors))
    return <div className="text-sm text-red-500">[Circular]</div>;
  seen.add(errors);

  return (
    <div className="flex flex-col gap-2">
      {Object.entries(errors).map(([key, val]) => {
        if (val == null) return null;

        // simple string messages
        if (typeof val === "string") {
          return (
            <div key={key}>
              <h4 className="font-medium text-[1.1rem]/[115%]">
                {humanize(key)}
              </h4>
              <p className="text-sm text-red-600">{val}</p>
            </div>
          );
        }

        // array of messages / errors
        if (Array.isArray(val) && val.length > 0 && Array.isArray(val[0])) {
          return (
            <div key={key}>
              <h4 className="font-medium text-[1.1rem]/[115%]">
                {humanize(key)}
              </h4>
              <ul className="list-disc ml-5! text-sm text-red-600">
                {val.map((v, i) => (
                  <li key={i}>{(v && v.message) || String(v)}</li>
                ))}
              </ul>
            </div>
          );
        }

        // object that looks like an error leaf (has .message)
        if (
          val &&
          (typeof val.message === "string" || typeof val.type === "string")
        ) {
          const msg = val.message ?? JSON.stringify(val);
          return (
            <div key={key}>
              <h4 className="font-medium text-[1.1rem]/[115%]">
                {humanize(key)}
              </h4>
              <p className="text-sm text-red-600">{msg}</p>
            </div>
          );
        }

        // nested object -> recurse
        return (
          <div key={key}>
            <h4 className="font-medium text-[1.1rem]/[115%]">
              {humanize(key)}
            </h4>
            <div className="pl-3! border-l ml-1! pt-2! border-gray-400">
              <FormErrors errors={val} seen={seen} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
