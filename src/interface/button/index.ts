import { EButton } from "~/enum";

interface IButton {
  content?: string;
  className?: string;
  type?: EButton;
  icon?: JSX.Element;
}

interface IButtonPrimary extends IButton {
  disable?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

interface IButtonLink extends IButton {
  path: string;
}

export type { IButtonPrimary, IButtonLink };
