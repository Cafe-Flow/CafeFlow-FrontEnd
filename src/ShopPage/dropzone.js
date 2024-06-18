import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./Shop.css";

function Dropzone({ onDrop, clearFiles }) {
  const [files, setFiles] = useState([]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
      if (onDrop) {
        onDrop(acceptedFiles[0]); // Pass the first file if needed
      }
    },
    [onDrop]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: handleDrop
  });

  const thumbs = files.map((file) => (
    <div className="thumb" key={file.name}>
      <div className="thumb-inner">
        <img src={file.preview} className="thumb-img" alt={file.name} />
      </div>
    </div>
  ));

  return (
    <section className="dropzone-container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>이미지를 업로드하려면 클릭하거나 여기에 파일을 드롭하세요.</p>
        <aside className="thumbs-container">{thumbs}</aside>
      </div>
    </section>
  );
}

export default Dropzone;
