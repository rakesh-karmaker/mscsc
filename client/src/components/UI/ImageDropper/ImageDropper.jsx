// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import "./ImageDropper.css";
// import { useRef, useState } from "react";

// const ImageDropper = ({ register }) => {
//   const dropArea = useRef(null);
//   const [files, setFiles] = useState(false);

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     console.log("Files dropped:");
//     setFiles(e.target.files.length);
//     // Handle the files here
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     console.log("dragging");
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     console.log("drag leave");
//   };

//   console.log(files);

//   return (
//     <div className="image-dropper">
//       <p className="input-heading">Add Gallery</p>
//       <label
//         className={`${files ? "active" : ""} drop-area`}
//         htmlFor="gallery"
//         ref={dropArea}
//         onDrop={handleDrop}
//         onDragEnter={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onInput={handleDrop}
//       >
//         <input
//           type="file"
//           id="gallery"
//           {...register}
//           accept="image/*"
//           multiple
//           hidden
//         />
//         <div className="drop-icon">
//           {files ? (
//             <>
//               <FontAwesomeIcon icon="fa-solid fa-check" />
//               <p>{files} Images Selected Successfully</p>
//             </>
//           ) : (
//             <>
//               <FontAwesomeIcon icon="fa-solid fa-cloud-arrow-up" />
//               <p>Drag & Drop or Click to upload</p>
//             </>
//           )}
//         </div>
//       </label>
//     </div>
//   );
// };

// export default ImageDropper;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ImageDropper.css";
import { useRef, useState } from "react";

const ImageDropper = ({ register }) => {
  const dropArea = useRef(null);
  const [files, setFiles] = useState(0);
  const [active, setActive] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e?.type === "input") {
      const droppedFiles = e.target.files;
      register.onChange({
        target: {
          name: "gallery",
          value: droppedFiles,
        },
      });
      setFiles(droppedFiles.length);
    } else {
      const droppedFiles = e.dataTransfer.files;
      register.onChange({
        target: {
          name: "gallery",
          value: droppedFiles,
        },
      });
      setFiles(droppedFiles.length);
    }
    setActive(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (files == 0) setActive(false);
  };

  return (
    <div className="image-dropper">
      <p className="input-heading">Add Gallery</p>
      <label
        className={`${files || active ? "active" : ""} drop-area`}
        htmlFor="gallery"
        ref={dropArea}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onInput={handleDrop}
      >
        <input
          type="file"
          id="gallery"
          {...register}
          accept="image/*"
          multiple
          hidden
        />
        <div className="drop-icon">
          {files ? (
            <>
              <FontAwesomeIcon icon="fa-solid fa-check" />
              <p>{files} Images Selected Successfully</p>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon="fa-solid fa-cloud-arrow-up" />
              <p>Drag & Drop or Click to upload</p>
            </>
          )}
        </div>
      </label>
    </div>
  );
};

export default ImageDropper;
