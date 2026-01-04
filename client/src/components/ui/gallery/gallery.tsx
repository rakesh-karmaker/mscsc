import { useState, type ReactNode } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ImageViewer from "@/components/ui/image-viewer/image-viewer";

import "./gallery.css";

export default function Gallery({
  title,
  images,
}: {
  title: string;
  images: { url: string }[];
}): ReactNode {
  if (images.length === 0) return null;

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <div className="gallery-container">
      <p className="gallery-title">{title}</p>
      <div className="gallery-images">
        {images.map((image, index) => (
          <LazyLoadImage
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
      <ImageViewer data={images} open={open} setOpen={setOpen} index={index} />
    </div>
  );
}
