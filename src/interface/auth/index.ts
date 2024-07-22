interface ILogin {
  username: string;
  password: string;
}

interface ISignup {
  phoneNumber: string;
  email: string;
  username: string;
  fullname: string;
  password: string;
  confirmPassword: string;
}

interface IForgotPassword {
  email: string;
  newPassword: string;
  verifyAccountOtp: string;
  confirmPassword: string;
}

interface IAuthToken {
  accessToken: string;
  refreshToken: string;
}

export type { ILogin, IAuthToken, IForgotPassword, ISignup };
