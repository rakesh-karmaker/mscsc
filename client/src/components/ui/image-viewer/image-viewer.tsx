import {
  useRef,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import "./image-viewer.css";

type ImageViewerProps = {
  data: { url: string }[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  index: number;
};

export default function ImageViewer({
  data,
  open,
  setOpen,
  index,
}: ImageViewerProps): ReactNode {
  const thumbnailsRef = useRef(null);
  const zoomRef = useRef(null);
  return (
    <Lightbox
      open={open}
      index={index}
      close={() => setOpen(false)}
      slides={data.map((image) => {
        return { src: image.url };
      })}
      animation={{ swipe: 300 }}
      plugins={[Thumbnails, Zoom]}
      carousel={{ finite: true, preload: 100 }}
      thumbnails={{
        ref: thumbnailsRef,
        width: 56,
        height: 56,
        gap: 5,
        vignette: false,
        padding: 3,
      }}
      on={{
        click: () => {
          const thumbnails = thumbnailsRef.current as unknown as {
            isVisible: () => boolean;
            hide: () => void;
            show: () => void;
          };
          if (thumbnails?.isVisible()) {
            thumbnails.hide();
          } else {
            thumbnails?.show();
          }
        },
      }}
      zoom={{ ref: zoomRef }}
    />
  );
}
