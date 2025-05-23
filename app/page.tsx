"use client";

import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { uploadData } from "@aws-amplify/storage";
import { useRef } from "react";

Amplify.configure(outputs);

interface FileUploaderProps{
  entity_id: string;
}

export default function FileUploader({ entity_id }: FileUploaderProps){

  async function handleUpload(){
    const file = (document.getElementById("file") as HTMLInputElement).files?.[0];
    if (!file){
      console.error("no file selected");
      return;
    } 
    
    try{
    const buffer = await file.arrayBuffer()
    console.log("Complete file read successfully", buffer);

    await uploadData({
      data: buffer,
      path: `private/${entity_id}/${file.name}`,
    });

    console.log("upload successful");
    } catch (e){
      console.error("upload error", e);
    }
  }

  return (
    <div>
      <input
        type="file"
        id="file"
        ref={useRef<HTMLInputElement|null>(null)}
      />
      <button
        id="upload"
        onClick={handleUpload}
      >
        Upload
      </button>
    </div>
  );
 
}
