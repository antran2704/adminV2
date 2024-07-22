const checkPhoneNumber = (codeArea: string, phone: string): string => {
  let phoneNumber = phone;
  if (phoneNumber.length >= 10) {
    phoneNumber = phoneNumber.slice(1);
  }

  phoneNumber = codeArea.slice(1) + phoneNumber;

  return phoneNumber;
};

export { checkPhoneNumber };
