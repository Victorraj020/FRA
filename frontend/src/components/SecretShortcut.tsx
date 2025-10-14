import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Listens globally for Ctrl+Alt+G and prompts for a passcode to access government login
const SecretShortcut: React.FC = () => {
  const navigate = useNavigate();
  const GOV_PASSCODE = (import.meta as any)?.env?.VITE_GOV_PASSCODE || 'Hackathon';

  useEffect(() => {
    let shiftCount = 0;
    let shiftTimer: number | undefined;
    let clickCount = 0;
    let clickTimer: number | undefined;

    const requestAccess = () => {
      const pass = window.prompt('Enter government access passcode');
      if (pass && pass === GOV_PASSCODE) {
        navigate('/login?role=government');
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      // Debug hint in console to verify listener is active
      if (key === 'f9') {
        console.log('[SecretShortcut] Listener active');
      }

      // Alt+G (simpler/more reliable than Ctrl+Alt+G)
      if (e.altKey && key === 'g') {
        e.preventDefault();
        requestAccess();
        return;
      }

      // Triple-press Shift within 1.2s
      if (key === 'shift') {
        shiftCount += 1;
        if (shiftTimer) window.clearTimeout(shiftTimer);
        shiftTimer = window.setTimeout(() => (shiftCount = 0), 1200);
        if (shiftCount >= 3) {
          shiftCount = 0;
          if (shiftTimer) window.clearTimeout(shiftTimer);
          requestAccess();
        }
      }
    };

    const onClick = (e: MouseEvent) => {
      // Five clicks in top-left 180x80 area within 2s
      if (e.clientX < 180 && e.clientY < 80) {
        clickCount += 1;
        if (clickTimer) window.clearTimeout(clickTimer);
        clickTimer = window.setTimeout(() => (clickCount = 0), 2000);
        if (clickCount >= 5) {
          clickCount = 0;
          if (clickTimer) window.clearTimeout(clickTimer);
          requestAccess();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('click', onClick);
      if (shiftTimer) window.clearTimeout(shiftTimer);
      if (clickTimer) window.clearTimeout(clickTimer);
    };
  }, [navigate]);

  return null;
};

export default SecretShortcut;


