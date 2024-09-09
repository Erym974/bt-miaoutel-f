import { useEffect, useState } from "react";
import { ProfileType } from "../Types/ProfileType";

import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";

import './styles/ProfileCustomizer.scss';
import config from "../config";

interface ProfileCustomizer {
  setProfile: (value: ProfileType) => void;
  profile: ProfileType;
}

export default function ProfileCustomizer({
  setProfile,
  profile,
}: ProfileCustomizer) {

  const randomPicture = Math.floor(Math.random() * 13) + 1;

  const [pictureId, setPictureId] = useState<number>(randomPicture);
  const [username, setUsername] = useState<string>(`Guest${Math.floor(Math.random() * 9999) + 1000}`);

  useEffect(() => {
    if(username.length > 14) return
    setProfile({ ...profile, username: username });
  }, [username]);

  useEffect(() => {
    setProfile({ ...profile, profile: `${config.BACK_URL}/profile_${pictureId}.jpg` });
  }, [pictureId]);

  useEffect(() => {
    setProfile({ username: username, profile: `${config.BACK_URL}/profile_${pictureId}.jpg` });
  }, [])

  const handleChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^a-zA-Z0-9]/g, '');
    setUsername(filteredValue.slice(0, 14));
  };

  return (
    <div className="profile-customizer">
      <div className="profile-customizer-header">
        <h2>Personnaliser votre profil</h2>
      </div>

      <div className="profile-picture">
        <img src={profile?.profile} alt="Profile picture" />
        <div className="actions">
          <button onClick={() => setPictureId(pictureId > 1 ? pictureId - 1 : pictureId)}><FaLongArrowAltLeft /></button>
          <button onClick={() => setPictureId(pictureId < 13 ? pictureId + 1 : pictureId)}><FaLongArrowAltRight /></button>
        </div>
      </div>

      <div className="profile-customizer-footer">
        <input
          type="text"
          placeholder="Username"
          className="mb-2"
          value={username}
          onChange={handleChange}
        />
      </div>

    </div>
  );
}
