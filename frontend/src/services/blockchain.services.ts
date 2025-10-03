export const getUserBalance = async (
  account: any,
  token: string
): Promise<number> => {
  let userBalance = 0;

  token;
  account;

  return userBalance;
};

export const getLiquidity = async ({
  lender,
  token,
  account,
}: {
  lender: string;
  token: string;
  account: any;
}) => {
  lender;
  token;
  account;
  return 0;
};

export const getCollaterial = async ({
  borrower,
  token,
  account,
}: {
  borrower: string;
  token: string;
  account: any;
}) => {
  borrower;
  token;
  account;
  return 0;
};
export const getDebt = async ({
  borrower,
  token,
  account,
}: {
  borrower: string;
  token: string;
  account: any;
}) => {
  borrower;
  token;
  account;
  return 0;
};

export const createLoan = async ({
  account,
  token,
  amount,
  duration,
}: {
  token: string;
  amount: number;
  duration: bigint;
  account: any;
}) => {
  account;
  token;
  amount;
  duration;
};

export const acceptLoan = async ({
  account,
  lender,
  token,
  amount,
}: {
  lender: string;
  token: string;
  amount: number;
  account: any;
}) => {
  account;
  lender;
  token;
  amount;
};

export const payLoan = async ({
  account,
  lender,
  token,
  amount,
}: {
  lender: string;
  token: string;
  amount: number;
  account: any;
}) => {
  account;
  lender;
  token;
  amount;
};

export const lockCollateral = async ({
  account,
  token,
  amount,
}: {
  token: string;
  amount: number;
  account: any;
}) => {
  account;
  token;
  amount;
};
