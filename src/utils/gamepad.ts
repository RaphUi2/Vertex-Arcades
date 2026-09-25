import { useState, useEffect, useRef } from 'react';
import { audio } from './audio';

export interface GamepadStatus {
  connected: boolean;
  id: string;
  buttons: boolean[];
  axes: number[];
}

export function useGamepad(onButtonAction?: (action: string) => void) {
  const [gamepadState, setGamepadState] = useState<GamepadStatus>({
    connected: false,
    id: '',
    buttons: [],
    axes: [0, 0, 0, 0]
  });

  const prevButtonsRef = useRef<boolean[]>([]);
  const lastActionTimeRef = useRef<number>(0);

  // Vibration support
  const vibrate = (duration = 80, weak = 0.5, strong = 0.8) => {
    try {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      const gp = gamepads[0];
      if (gp && (gp as any).vibrationActuator && typeof (gp as any).vibrationActuator.playEffect === 'function') {
        (gp as any).vibrationActuator.playEffect('dual-rumble', {
          startDelay: 0,
          duration,
          weakMagnitude: weak,
          strongMagnitude: strong
        }).catch(() => {});
      }
    } catch (e) {
      // Haptic fallback
    }
  };

  useEffect(() => {
    let animFrame: number;

    const isRealGamepad = (gp: Gamepad | null): boolean => {
      if (!gp || !gp.connected || !gp.buttons || gp.buttons.length < 8) return false;
      const lower = (gp.id || '').toLowerCase();
      // Ignore android internal virtual sensor / motion devices
      if (lower.includes('sensor') || lower.includes('motion') || lower.includes('touch') || lower.includes('digitizer')) {
        return false;
      }
      return gp.mapping === 'standard' || lower.includes('gamepad') || lower.includes('controller') || lower.includes('xbox') || lower.includes('playstation') || lower.includes('wireless');
    };

    const handleConnect = (e: GamepadEvent) => {
      if (!isRealGamepad(e.gamepad)) return;

      setGamepadState({
        connected: true,
        id: e.gamepad.id || 'Manette Connectée',
        buttons: e.gamepad.buttons.map(b => b.pressed),
        axes: [...e.gamepad.axes]
      });
      audio.playPowerup();
      vibrate(100, 0.3, 0.6);
    };

    const handleDisconnect = () => {
      setGamepadState({
        connected: false,
        id: '',
        buttons: [],
        axes: [0, 0, 0, 0]
      });
    };

    window.addEventListener('gamepadconnected', handleConnect);
    window.addEventListener('gamepaddisconnected', handleDisconnect);

    const pollGamepad = () => {
      try {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        const gp = Array.from(gamepads).find(g => isRealGamepad(g));

        if (gp) {
          const currentButtons = gp.buttons.map(b => b.pressed);
          const now = Date.now();

          // Debounce threshold
          if (now - lastActionTimeRef.current > 220) {
            // Button 0 (A / Cross) -> Accept
            if (currentButtons[0] && !prevButtonsRef.current[0]) {
              onButtonAction?.('A');
              vibrate(50, 0.3, 0.5);
              lastActionTimeRef.current = now;
            }
            // Button 1 (B / Circle) -> Back (only if real deliberate press)
            else if (currentButtons[1] && !prevButtonsRef.current[1]) {
              onButtonAction?.('B');
              vibrate(50, 0.3, 0.5);
              lastActionTimeRef.current = now;
            }
            // Button 2 (X / Square) -> Favorite
            else if (currentButtons[2] && !prevButtonsRef.current[2]) {
              onButtonAction?.('X');
              vibrate(60, 0.4, 0.6);
              lastActionTimeRef.current = now;
            }
            // Button 3 (Y / Triangle) -> Profile
            else if (currentButtons[3] && !prevButtonsRef.current[3]) {
              onButtonAction?.('Y');
              vibrate(60, 0.4, 0.6);
              lastActionTimeRef.current = now;
            }
            // LB / RB
            else if (currentButtons[4] && !prevButtonsRef.current[4]) {
              onButtonAction?.('LB');
              lastActionTimeRef.current = now;
            } else if (currentButtons[5] && !prevButtonsRef.current[5]) {
              onButtonAction?.('RB');
              lastActionTimeRef.current = now;
            }
          }

          prevButtonsRef.current = currentButtons;
          setGamepadState({
            connected: true,
            id: gp.id,
            buttons: currentButtons,
            axes: [...gp.axes]
          });
        }
      } catch (e) {
        // Safe fallback
      }

      animFrame = requestAnimationFrame(pollGamepad);
    };

    animFrame = requestAnimationFrame(pollGamepad);

    return () => {
      window.removeEventListener('gamepadconnected', handleConnect);
      window.removeEventListener('gamepaddisconnected', handleDisconnect);
      cancelAnimationFrame(animFrame);
    };
  }, [onButtonAction]);

  return { gamepadState, vibrate };
}
