import FormElementType from "../types/FormElementType";
import IFormElementOption from "./IFormElementOption";

interface IFormElement {
  id: string;
  order: number;
  type: FormElementType;
  content: string;
  options?: IFormElementOption[];
}

export default IFormElement;
