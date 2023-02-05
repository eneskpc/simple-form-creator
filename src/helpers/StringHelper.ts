import { v4 } from "uuid";

export const GenerateKey = (): string => {
  return v4().replace(/-/g, "");
};

export const Letters = () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
