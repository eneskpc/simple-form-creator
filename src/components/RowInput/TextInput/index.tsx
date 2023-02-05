import { useAppDispatch } from "../../../app/hooks";
import { removeElement } from "../../../features/form/formSlice";
import IFormElement from "../../../models/IFormElement";

type Props = {
  element: IFormElement;
};

const TextInput = ({ element }: Props) => {
  const dispatch = useAppDispatch();

  const deleteElement = (e: any) => {
    if (
      (e.key === "Backspace" || e.key === "Delete") &&
      e.currentTarget.value.length === 0
    ) {
      e.preventDefault();
      dispatch(removeElement(element));
    }
  };

  return (
    <input
      className="w-full my-3 p-3 border border-gray-200 shadow-md rounded-md focus:outline-none"
      type="text"
      placeholder="Type the placeholder of the input"
      defaultValue={element.content}
      onKeyDown={deleteElement}
    />
  );
};

export default TextInput;
