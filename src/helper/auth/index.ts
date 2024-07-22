const setAuthToken = (key: string, token: string) => {
  localStorage.setItem(key, JSON.stringify(token));
};

const getAuthToken = (key: string): string | null => {
  return JSON.parse(localStorage.getItem(key) as string) || null;
};

const removeAuthToken = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

const checkPassword = (password: string): string | null => {
  if (password.length < 8) {
    return "Mật khẩu phải từ 8 kí tự";
  }

  const regexAlphaLower = /[a-z]/;
  const regexAlphaUpper = /[A-Z]/;
  const regexNumber = /\d/;
  const regexSpecialCharacter = /[!@#$%^&]/;

  if (!regexAlphaLower.test(password)) {
    return "Phải có ít nhất một chữ thường";
  }
  if (!regexAlphaUpper.test(password)) {
    return "Phải có ít nhất một chữ hoa";
  }
  if (!regexNumber.test(password)) {
    return "Phải có ít nhất một số";
  }

  if (!regexSpecialCharacter.test(password)) {
    return "Phải có ít nhất một ký tự đặc biệt: !,@,#,$,%,^,&";
  }

  return null;
};

const checkEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

// eslint-disable-next-line no-unused-vars
const checkFields = <T>(data: { [k in keyof T]: string }): boolean => {
  const keys: string[] = Object.keys(data);

  for (let key of keys) {
    if (!data[key as keyof T]) {
      return false;
    }
  }

  return true;
};

export {
  setAuthToken,
  getAuthToken,
  checkPassword,
  checkEmail,
  checkFields,
  removeAuthToken,
};
