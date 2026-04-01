import { useEffect, useState } from 'react';

export function useKeyboardNavigation(totalItems: number, onSelect: (index: number) => void) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % totalItems);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          setFocusedIndex((prev) => (prev - 1 + totalItems) % totalItems);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          setFocusedIndex((prev) => Math.min(prev + 3, totalItems - 1));
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          setFocusedIndex((prev) => Math.max(prev - 3, 0));
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          onSelect(focusedIndex);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, totalItems, onSelect]);

  return { focusedIndex, setFocusedIndex };
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();

  return (
    target.isContentEditable ||
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select'
  );
}
