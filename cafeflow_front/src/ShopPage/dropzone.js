import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import "./Shop.css";

function Dropzone() {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    }
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
