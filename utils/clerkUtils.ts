// Packages
import axios from 'axios';

// Types
import { User } from 'types';

const getClerkUser = async (userId: string | string[]) => {
  const { data: user, status } = await axios.get<User>(
    `https://api.clerk.dev/v1/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_API_KEY}`
      }
    }
  );

  return { user, status };
};

export default getClerkUser;
