export const getEnumApiOpts = (object: object) => {
  return Object.values(object)
    .map((val) => `"${val}"`)
    .join(' | ');
};

export const defaultAccountingPeriod = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export const defaultPaymentDeadline = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export const round = (value: number, precision: number) => {
  const k = Math.pow(10, precision);
  return Math.round(value * k) / k;
};
