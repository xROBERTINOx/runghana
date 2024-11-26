import { Dispatch, SetStateAction } from 'react';

export const createKeyboardControls = (
  setKeysPressed: Dispatch<SetStateAction<Set<string>>>
) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    setKeysPressed(prev => new Set(prev).add(e.key));
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    setKeysPressed(prev => {
      const next = new Set(prev);
      next.delete(e.key);
      return next;
    });
  };

  return { handleKeyDown, handleKeyUp };
};