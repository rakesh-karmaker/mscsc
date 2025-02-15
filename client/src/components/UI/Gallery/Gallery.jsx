import { useState } from "react";
import "./Gallery.css";
import ImageViewer from "../ImageViewer/ImageViewer";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Gallery = ({ title, images }) => {
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
};

export default Gallery;
