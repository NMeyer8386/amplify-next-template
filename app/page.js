"use client";

import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { uploadData } from "@aws-amplify/storage";

Amplify.configure(outputs);

const file = document.getElementById("file");
const upload = document.getElementById("upload");

upload?.addEventListener("click", () => {
  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file.files[0]);

  fileReader.onload = async (event) => {
    console.log("Complete File read successfully!", event.target.result);
    try{
      await uploadData({
        data: event.target.result,
        path: `private/{entity_id}/${file.files[0].name}`
      });
    } catch (e) {
      console.log("error", e);
    }
  }
})