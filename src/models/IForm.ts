import IFormElement from "./IFormElement";

interface IForm {
  id: string;
  title: string;
  elements: IFormElement[];
  buttonText: string;
  isSelected: boolean;
}

export default IForm;
