"use client";

import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import FileUploader from "@/components/fileuploader";

Amplify.configure(outputs);

export default function Page() {
  // however you obtain your entity_id:
  const entity_id = "YOUR_ENTITY_ID_HERE";

  return (
    <main>
      <h1>Upload a File</h1>
      <FileUploader entity_id={entity_id} />
    </main>
  );
}