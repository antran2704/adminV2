interface IInputField {
  title?: string;
  name: string;
  value?: string;
  isError?: boolean;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  onChange?: (value: string, name: string) => void;
  onPressEnter?: () => void;
  onBlur?: () => void;
}

interface IInputPasswordField extends IInputField {
  important?: boolean;
  message?: string;
}

interface IInputSelectPhoneField extends IInputField {
  important?: boolean;
  selectedCode: string;
  onChangeCodeArea?: (value: string) => void;
}

interface IInputSearchField extends IInputField {
  onSearch?: (value: string, name: string) => void;
}

export type {
  IInputField,
  IInputPasswordField,
  IInputSelectPhoneField,
  IInputSearchField,
};
