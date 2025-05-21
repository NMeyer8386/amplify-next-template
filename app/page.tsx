"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

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
      {({ signOut, user }) => (
        <main>
          {user && (
            <h1>Welcome, {user.username}</h1>
          )}
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}