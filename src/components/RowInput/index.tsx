import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { addElementToForm, removeElement } from "../../features/form/formSlice";

import { useAppDispatch } from "../../app/hooks";
import IFormElement from "../../models/IFormElement";
import FormElementType from "../../types/FormElementType";
import IconButton from "../IconButton";
import Headline from "./Headline";
import Option from "./Option";
import Text from "./Text";
import TextInput from "./TextInput";

type Props = {
  element: IFormElement;
  removable?: boolean;
};


const RowInput = ({ element, removable }: Props) => {
  const dispatch = useAppDispatch();

  const renderElement = (element: IFormElement) => {
    switch (element.type) {
      case FormElementType.HEADLINE:
        return <Headline element={element} />;
      case FormElementType.TEXT:
        return <Text element={element} />;
      case FormElementType.TEXTINPUT:
        return <TextInput element={element} />;
      case FormElementType.OPTION:
        return <Option element={element} />;
      default:
        return null;
    }
  };

  const addNewElement_onClick = () => {
    dispatch(addElementToForm(element.order));
  };

  const removeElement_onClick = () => {
    dispatch(removeElement(element));
  };

  return (
    <div className="flex items-start group w-full">
      {renderElement(element)}
      {removable && (
        <IconButton
          className="transition-all opacity-0 group-hover:opacity-100 mt-6"
          icon={TrashIcon}
          onClick={removeElement_onClick}
        />
      )}
      <IconButton
        className="transition-all opacity-0 group-hover:opacity-100 mt-6"
        icon={PlusIcon}
        onClick={addNewElement_onClick}
      />
    </div>
  );
};

export default RowInput;
