import {
  removeElement,
  updateElementInForm
} from "../../../features/form/formSlice";

import { useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import IFormElement from "../../../models/IFormElement";
import FormElementType from "../../../types/FormElementType";

type Props = {
  element: IFormElement;
};

function Text({ element }: Props) {
  const dispatch = useAppDispatch();
  const [openCompleteList, setOpenCompleteList] = useState(false);
  const [elementTypeIndex, setElementTypeIndex] = useState(0);

  const toggleCompleteList = (isShown: boolean) => {
    setOpenCompleteList(isShown);
    setElementTypeIndex(0);
  };

  const updateElement = (e: any) => {
    dispatch(
      updateElementInForm({
        ...element,
        content: e.currentTarget.value,
      })
    );
  };

  const changeElementType = (type: FormElementType) => {
    dispatch(
      updateElementInForm({
        ...element,
        type: type,
      })
    );
  };

  const manageKeys = (e: any) => {
    if (
      (e.key === "Backspace" || e.key === "Delete") &&
      e.currentTarget.value.length === 0
    ) {
      // deleting element
      e.preventDefault();
      dispatch(removeElement(element));
    } else if (e.key === "ArrowUp") {
      // selecting a upper element type
      if (elementTypeIndex - 1 >= 0) setElementTypeIndex(elementTypeIndex - 1);
    } else if (e.key === "ArrowDown") {
      // selecting a lower element type
      const shownChoicesLength = Object.values(FormElementType).filter((fet) =>
        fet.includes(element.content)
      ).length;
      if (elementTypeIndex + 1 < shownChoicesLength)
        setElementTypeIndex(elementTypeIndex + 1);
    } else if (e.key === "Enter") {
      // change element type with selected
      const selectedElementType = Object.values(FormElementType).filter((fet) =>
        fet.includes(element.content)
      )[elementTypeIndex];
      changeElementType(selectedElementType);
    }
  };

  return (
    <div className="relative w-full">
      <input
        className="w-full my-5 focus:outline-none"
        type="text"
        placeholder="Type '/' to insert blocks or type anything"
        defaultValue={element.content}
        onKeyDown={manageKeys}
        onChange={updateElement}
        onInput={(e) =>
          toggleCompleteList(
            e.currentTarget.value.length > 0 && e.currentTarget.value[0] === "/"
          )
        }
        onFocus={(e) =>
          toggleCompleteList(
            e.currentTarget.value.length > 0 && e.currentTarget.value[0] === "/"
          )
        }
        onBlur={(e) => setTimeout(() => toggleCompleteList(false), 250)}
      />
      {openCompleteList && (
        <div className="absolute top-full z-10 w-full shadow-md rounded-md">
          {Object.values(FormElementType)
            .filter((fet) => {
              console.log(element.content);
              return fet.includes(element.content.substring(1));
            })
            .map((fet, index) => {
              if (elementTypeIndex === index) {
                return (
                  <button
                    key={fet}
                    onClick={() => changeElementType(fet)}
                    className="transition-all w-full text-left block p-2 bg-gray-100"
                  >
                    /{fet}
                  </button>
                );
              }
              return (
                <button
                  key={fet}
                  onClick={() => changeElementType(fet)}
                  className="transition-all w-full text-left block p-2 bg-white hover:bg-gray-100"
                >
                  /{fet}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default Text;
