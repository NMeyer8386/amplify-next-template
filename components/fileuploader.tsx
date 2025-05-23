"use client";

import React, { useRef } from "react";
import { uploadData } from "@aws-amplify/storage";

interface FileUploaderProps {
  entity_id: string;
}

export default function FileUploader({ entity_id }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement|null>(null);

  async function handleUpload() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      console.error("No file selected");
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      console.log("Complete File read successfully!", buffer);

      await uploadData({
        data: buffer,
        path: `private/${entity_id}/${file.name}`,
      });
      console.log("Upload successful!");
    } catch (e) {
      console.error("Upload error", e);
    }
  }

  return (
    <div>
      <input type="file" ref={fileInputRef} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
