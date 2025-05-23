"use client";

import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import {generateClient} from "aws-amplify/data" 
import type { Schema } from "@/amplify/data/resource";
import { Authenticator } from "@aws-amplify/ui-react";
import { FileUploader } from "@aws-amplify/ui-react-storage";

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

export const DefaultFileUploaderExample = () => {
  return (
    <FileUploader
      acceptedFileTypes={['image/*']}
      path="public/"
      maxFileCount={1}
      isResumable
    />
  );
};

export default function App() {

  return (

    <Authenticator>

      {({ signOut, user }) => (

        <main>

          {user && (

            <h1>Welcome, {user.username}</h1>

          )}

          <button onClick={signOut}>Sign out</button>

          <h1>Upload a File</h1>
          {user &&     <FileUploader
      acceptedFileTypes={['image/*']}
      path="public/"
      maxFileCount={1}
      isResumable
    />}
        </main>

      )}

    </Authenticator>

  );
}