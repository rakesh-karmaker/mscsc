import { useRef } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import "./ImageViewer.css";

const ImageViewer = ({ data, open, setOpen, index }) => {
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
          (thumbnailsRef.current?.visible
            ? thumbnailsRef.current?.hide
            : thumbnailsRef.current?.show)?.();
        },
      }}
      zoom={{ ref: zoomRef }}
    />
  );
};

export default ImageViewer;
