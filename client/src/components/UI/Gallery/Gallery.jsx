import { useState, useRef } from "react";

import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import "./Gallery.css";

const Gallery = ({ title, images }) => {
  if (images.length === 0) return null;

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const thumbnailsRef = useRef(null);
  const zoomRef = useRef(null);

  return (
    <div className="gallery-container">
      <p className="gallery-title">{title}</p>
      <div className="gallery-images">
        {images.map((image, index) => (
          <img
            src={image.url}
            alt={`activity gallery ${index}`}
            key={index}
            onClick={() => {
              setIndex(index);
              setOpen(true);
            }}
          />
        ))}
      </div>

      <Lightbox
        open={open}
        index={index}
        close={() => setOpen(false)}
        slides={images.map((image) => {
          return { src: image.url };
        })}
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
    </div>
  );
};

export default Gallery;
