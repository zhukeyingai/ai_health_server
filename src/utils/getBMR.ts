import { SEX, Sex } from './constant/user';

export const getBMR = (
  gender: Sex,
  weight: number,
  height: number,
  age: number,
) => {
  let bmr: number;
  switch (gender) {
    case SEX.MALE:
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      break;
    case SEX.FEMALE:
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      break;
    default:
      bmr = 1508;
      break;
  }
  return bmr;
};
