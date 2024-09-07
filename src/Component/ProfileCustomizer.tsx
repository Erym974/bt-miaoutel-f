import React, { useEffect, useState } from "react";
import { ProfileType } from "../Types/ProfileType";

import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";

import './styles/ProfileCustomizer.scss';

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
  const [username, setUsername] = useState<string>(`Guest#${Math.floor(Math.random() * 9999) + 1000}`);

  useEffect(() => {
    setProfile({ ...profile, username: username });
  }, [username]);

  useEffect(() => {
    setProfile({ ...profile, profile: `http://localhost:3001/profile_${pictureId}.jpg` });
  }, [pictureId]);

  useEffect(() => {
    setProfile({ username: username, profile: `http://localhost:3001/profile_${pictureId}.jpg` });
  }, [])

  return (
    <div className="profile-customizer">
      <h2>Personnaliser votre profil</h2>

      <div className="profile-picture my-5">
        <button onClick={() => setPictureId(pictureId > 1 ? pictureId - 1 : pictureId)}><FaLongArrowAltLeft /></button>
        <img src={profile?.profile} alt="Profile picture" />
        <button onClick={() => setPictureId(pictureId < 13 ? pictureId + 1 : pictureId)}><FaLongArrowAltRight /></button>
      </div>

      <input
        type="text"
        placeholder="Username"
        className="mb-2"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
    </div>
  );
}
