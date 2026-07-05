export const SIT_OUT_PLAYER_ID = 0;
export const SIT_OUT_DISPLAY_NAME = 'Voľno';

export interface RobinPlayer {
  id: number;
  name: string;
  table?: string;
  isSitOut?: boolean;
}
