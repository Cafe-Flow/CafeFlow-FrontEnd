import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./Shop.css";

function Dropzone({ onDrop }) {
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
        onDrop(acceptedFiles[0]); // 여기서는 첫 번째 파일만 전달하도록 설정했습니다. 필요에 따라 수정 가능합니다.
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

  // 리뷰 작성 후 초기화 함수
  const resetDropzone = () => {
    setFiles([]);
  };

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
