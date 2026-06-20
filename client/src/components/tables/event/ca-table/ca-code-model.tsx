import { Modal, TextField } from "@mui/material";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import FaXmark from "~icons/fa6-solid/xmark";
interface CaCodeModelProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCaCodeModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  caCodeModelOpen: boolean;
  mutation: any;
  documentId: string;
  defaultCode?: string;
}

export default function CaCodeModel({
  setOpen,
  setCaCodeModelOpen,
  mutation,
  documentId,
  caCodeModelOpen,
  defaultCode = "",
}: CaCodeModelProps): ReactNode {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      caCode: defaultCode || "",
    },
  });

  function onSubmit(data: { caCode: string }) {
    mutation.mutate({
      method: defaultCode ? "editCaCode" : "changeStatus",
      documentId: documentId,
      data: { status: "approved", caCode: data.caCode.trim().toUpperCase() },
    });
    setCaCodeModelOpen(false);
    setOpen(false);
  }

  return (
    <Modal
      open={caCodeModelOpen}
      onClose={() => setCaCodeModelOpen(false)}
      aria-labelledby={defaultCode ? "Edit CA Code" : "Provide CA Code"}
      aria-describedby={
        defaultCode
          ? "Edit the CA code for this application"
          : "Provide a CA code for this application"
      }
      className="flex items-center justify-center h-fit min-h-screen max-sm:overflow-y-auto absolute max-sm:bg-primary-bg border-none! outline-none! focus-visible:outline-none"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="w-full max-w-[28.75em] max-sm:max-w-full max-sm:min-h-screen bg-primary-bg max-h-screen overflow-y-auto border-none! outline-none! focus-visible:outline-none rounded-lg">
        <div className="min-h-fit max-sm:max-h-full p-7! rounded-lg max-sm:rounded-none bg-primary-bg flex flex-col max-sm:justify-center gap-5">
          <div className="w-full flex flex-col">
            <div className="w-full flex justify-between items-start gap-4">
              <h2 className="text-2xl font-medium max-xs:text-2xl">
                {defaultCode ? "Edit CA Code" : "Provide CA Code"}
              </h2>
              <button
                onClick={() => setCaCodeModelOpen(false)}
                className="text-3xl transition-all duration-200 hover:text-red-400 cursor-pointer"
              >
                <FaXmark />
              </button>
            </div>
            <p className="text-gray-600 text-sm mt-3!">
              Give a unique CA code to the applicant. This code will be used by
              the applicant to access event resources and will be visible to
              them on their profile after approval.{" "}
            </p>
            <div className="w-full h-px bg-light-black/10 mt-2! mb-7!"></div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-2">
                <TextField
                  label="CA Code"
                  {...register("caCode", { required: true })}
                />
                <button
                  type="submit"
                  className="primary-button text-[1em]! py-1.75! px-3.5! w-fit! h-fit!"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {defaultCode ? "Update" : "Approve"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}
