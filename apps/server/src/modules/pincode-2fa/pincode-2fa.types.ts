export type GeneratePinCodeData = {
  userId: string;
};

export type PinCode2FA = {
  code: string;
  userId: string;
};

export type DeletePinCodeProcessData = {
  code: string;
};
