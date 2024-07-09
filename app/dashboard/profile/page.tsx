import ProfileView from "@/components/Dashboard/ProfileView";
import { cookies } from 'next/headers'

export const metadata = {
  title: 'Profile'
}

const ProfilePage = () => {
  return <ProfileView />;
};

export default ProfilePage;
