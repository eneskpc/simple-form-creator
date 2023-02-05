import {
  removeElement,
  updateElementInForm,
  updateFormTitle
} from "../../../features/form/formSlice";

import { useAppDispatch } from "../../../app/hooks";
import IFormElement from "../../../models/IFormElement";

type Props = {
  element: IFormElement;
};

const Headline = ({ element }: Props) => {
  const dispatch = useAppDispatch();

  const updateElement = (e: any) => {
    if (element.order === -1) {
      dispatch(updateFormTitle(e.currentTarget.value));
    } else {
      dispatch(
        updateElementInForm({
          ...element,
          content: e.currentTarget.value,
        })
      );
    }
  };

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
      className="w-full my-5 text-3xl font-bold focus:outline-none"
      type="text"
      placeholder="Type header text"
      defaultValue={element.content}
      onKeyDown={deleteElement}
      onChange={updateElement}
    />
  );
};

export default Headline;
