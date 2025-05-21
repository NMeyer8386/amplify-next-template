"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { downloadMyFile, uploadMyFile, listMyFiles } from './storage';

Amplify.configure(outputs);

Amplify.configure({
  Auth: {
    Cognito: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: 'ca-central-1:ffbd856b-eac4-4af3-9d04-5b04eee9e989', 
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'ca-central-1_URmo5iTYo',
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolClientId: '6ulhpadeqg7f8cb7u8c2m03t98',
    loginWith: { email: false, username: true }
    }
  }
});

const client = generateClient<Schema>();

export default function App() {
  return (
    <Authenticator>
      {/* wrap the signout in a void cast  */}
      {({ signOut, user }) => <Dashboard signOut={() => signOut?.()} username={user!.username} />} 
    </Authenticator>
  );
}

type DashboardProps = {
  signOut: () => void;
  username: string;
};

function Dashboard({ signOut, username }: DashboardProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [contentUrl, setContentUrl] = useState<string>('');

  // Load file list on mount
  useEffect(() => {
    listMyFiles().then(setFiles);
  }, []);

  // Download when user selects a file
  useEffect(() => {
    if (!selected) return;
    downloadMyFile(selected).then(blob => {
      const url = URL.createObjectURL(blob);
      setContentUrl(url);
    });
  }, [selected]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadMyFile(file.name, file);
    setFiles(await listMyFiles());
  }

  return (
    <main>
      <h1>Hello, {username}</h1>
      <button onClick={signOut}>Sign Out</button>

      <section>
        <h2>Your Files</h2>
        <ul>
          {files.map(f => (
            <li key={f}>
              <button onClick={() => setSelected(f)}>{f}</button>
            </li>
          ))}
        </ul>
        <input type="file" onChange={handleUpload} />
      </section>

      {contentUrl && (
        <section>
          <h2>Preview: {selected}</h2>
          {/* For images/pdf embed, or provide a download link */}
          <a href={contentUrl} download={selected}>Download</a>
        </section>
      )}
    </main>
  );
}