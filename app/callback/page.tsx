'use client'; // Makes sure AWS knows to use the client and not process this on the server

import { useEffect, useState } from 'react';

function Callback() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleAuthRedirect() {
      try {
        const query = new URLSearchParams(window.location.search);
        const code = query.get('code');

        if (!code) {
          throw new Error('No authorization code found in URL.');
        }

        console.log('Authorization code:', code);

        // Send the code to your backend Lambda via API Gateway
        const response = await fetch('https://yxa0p4y4uc.execute-api.ca-central-1.amazonaws.com/CognitoRedirectURL/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Backend error response:', errorData);
          
            throw new Error(`Failed to get dashboard URL: ${errorData?.error || response.statusText}`);
        }
        
        const data = await response.json();
        const embedUrl = data.embed_url;

        if (!embedUrl) {
          throw new Error('No embed URL returned from Lambda.');
        }

        console.log('Redirecting to QuickSight dashboard:', embedUrl);
        window.location.href = embedUrl;

      } catch (err: any) {
        console.error('Callback error:', err);
        setError(err.message || 'An unknown error occurred.');
      }
    }

    handleAuthRedirect();
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '20vh' }}>
      {!error ? (
        <>
          <div style={{ fontSize: '2rem' }}>Logging you in...</div>
        </>
      ) : (
        <>
          <div style={{ fontSize: '2rem', color: 'red' }}>Login failed</div>
          <div>{error}</div>
          <div style={{ marginTop: '20px' }}>
            <a href="">
              Try Again
            </a>
          </div>
        </>
      )}
    </div>
  );
}

export default Callback;
