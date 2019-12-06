import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { mkReddit } from '../lib/reddit';
import { useRedditAuth } from '../lib/redditAuth'

interface AuthedZoneProps {
  component: React.ComponentType<{reddit: ReturnType<typeof mkReddit>}>;
}

const AuthedZone: React.FC<AuthedZoneProps> = (props) => {
  const history = useHistory()

  const { component: Component } = props;
  const { reddit, redditError } = useRedditAuth(() => history.push('/'));

  if (redditError) {
    return <p>{redditError}</p>;
  }

  if (!reddit) {
    return <p>Loading your session...</p>;
  }

  return <Component reddit={reddit} />
}
export default AuthedZone;