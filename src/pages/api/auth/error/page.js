'use client'; // Since it's in the `app` directory and needs to handle client-side routing

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Error() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const errorType = searchParams.get('error');
    let message;

    switch (errorType) {
      case 'CredentialsSignin':
        message = 'Sign in failed. Please check your credentials and try again.';
        break;
      case 'AccessDenied':
        message = 'You do not have permission to sign in.';
        break;
      case 'Configuration':
        message = 'There is a problem with the server configuration.';
        break;
      case 'Verification':
        message = 'The sign-in link is no longer valid or has expired.';
        break;
      default:
        message = 'An unknown error occurred. Please try again later.';
    }

    setErrorMessage(message);
  }, [searchParams]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Sign In Error</h1>
      <p>{errorMessage}</p>
      <a href="/login">Go back to login</a>
    </div>
  );
}
