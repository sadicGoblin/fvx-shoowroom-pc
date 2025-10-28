export interface Screen {
  id: string;
  name: string;
  ip: string;
  isSelected: boolean;
  lastUpdate: Date;
  isOnline: boolean;
  lastContent: string | null;
}

export interface ContentButton {
  name: string;
  command: string;
  color: string;
  textColor: string;
}
