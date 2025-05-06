import React, { useEffect } from 'react';
import useSound from 'use-sound';

const KeyboardSoundListener = ({ sound, validKeys = ['Space', 'Slash'], children }) => {
  const [playSound] = useSound(sound);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (validKeys.includes(e.code)) {
        playSound();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playSound, validKeys]);

  return <>{children}</>;
};

export default KeyboardSoundListener;