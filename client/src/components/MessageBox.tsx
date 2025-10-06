import type { MessageType } from "@/types/messageTypes";
import { Modal } from "@mui/material";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { FaReply } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function MessageBox({
  data,
  setData,
}: {
  data: MessageType | null;
  setData: Dispatch<SetStateAction<MessageType | null>>;
}): ReactNode {
  return (
    <Modal
      open={data ? true : false}
      onClose={() => setData(null)}
      aria-labelledby="Message Box"
      aria-describedby="Display Message Details"
      className="flex items-center justify-center h-fit min-h-screen max-sm:overflow-y-auto absolute max-sm:bg-primary-bg !border-none !outline-none focus-visible:outline-none"
    >
      <div className="w-full max-w-[34.75em] max-sm:max-w-full max-sm:min-h-screen bg-primary-bg max-h-screen overflow-y-auto !border-none !outline-none focus-visible:outline-none rounded-lg">
        <div className="min-h-fit max-sm:max-h-full !p-7 rounded-lg max-sm:rounded-none bg-primary-bg flex flex-col max-sm:justify-center gap-5">
          <div className="w-full flex flex-col">
            <div className="w-full flex justify-between items-center gap-2">
              <h2 className="text-3xl font-medium max-xs:text-2xl">
                {data?.name}
              </h2>
              <button
                onClick={() => setData(null)}
                className="text-3xl transition-all duration-200 hover:text-red-400 cursor-pointer"
              >
                <FaXmark />
              </button>
            </div>
            <a
              href={`mailto:${data?.email}`}
              className="text-blue-500 hover:underline w-fit max-xs:text-sm break-all"
            >
              {data?.email}
            </a>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-highlighted-color font-medium">Subject</h3>
            <p>{data?.subject}</p>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-highlighted-color font-medium">Message</h3>
            <p
              className="text-[1rem]/[145%]"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {data?.message}
            </p>
          </div>
          <Link
            to={`mailto:${data?.email}`}
            className="primary-button w-fit gap-2 min-h-fit !py-2.5"
          >
            <FaReply />
            Reply
          </Link>
        </div>
      </div>
    </Modal>
  );
}
