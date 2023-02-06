import { Bars2Icon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from "react-sortable-hoc";
import {
  addOptionToElement,
  removeElement,
  sortOption,
  updateElementInForm,
  updateOptionToElement
} from "../../../features/form/formSlice";

import { useAppDispatch } from "../../../app/hooks";
import { Letters } from "../../../helpers/StringHelper";
import IFormElement from "../../../models/IFormElement";
import IFormElementOption from "../../../models/IFormElementOption";
import IconButton from "../../IconButton";

type Props = {
  element: IFormElement;
};

type ISortableList = {
  items: IFormElementOption[];
  addOption: () => void;
  updateOption: (option: IFormElementOption) => void;
};

type ISortableElement = {
  value: IFormElementOption;
  elementIndex: number;
  size: number;
  addOption: () => void;
  updateOption: (option: IFormElementOption) => void;
};

const DragHandle = SortableHandle(() => (
  <Bars2Icon className="w-6 h-6 mt-5 mr-2 cursor-row-resize" />
));

const SortableList = SortableContainer<ISortableList>(
  ({
    items,
    addOption,
    updateOption,
  }: {
    items: IFormElement[];
    addOption: () => void;
    updateOption: (option: IFormElementOption) => void;
  }) => {
    return (
      <div className="w-full">
        {items.map((value: IFormElement, index: number) => (
          <SortableItem
            key={value.id}
            index={index}
            elementIndex={index}
            value={value}
            addOption={addOption}
            updateOption={updateOption}
            size={items.length}
          />
        ))}
      </div>
    );
  }
);

const SortableItem = SortableElement<ISortableElement>(
  ({
    value,
    elementIndex,
    size,
    addOption,
    updateOption,
  }: {
    value: IFormElement;
    elementIndex: number;
    size: number;
    addOption: () => void;
    updateOption: (option: IFormElementOption) => void;
  }) => (
    <div className="flex items-start w-full">
      {value.order > -1 && <DragHandle />}
      <div key={value.id} className="flex group/option">
        <div
          key={value.id}
          className="my-3 max-w-xl w-full p-3 flex items-center border border-gray-200 shadow-md rounded-md"
        >
          <div className="flex flex-shrink-0 justify-center items-center w-5 h-5 rounded-md bg-gray-500 ">
            <strong className="text-white text-xs">
              {Letters()[elementIndex % Letters().length]}
            </strong>
          </div>
          <input
            className="w-full ml-2 focus:outline-none"
            defaultValue={value.content}
            placeholder="Option Text"
            onChange={(e) =>
              updateOption({
                id: value.id,
                content: e.currentTarget.value,
                order: value.order,
              })
            }
          />
        </div>
        {size > 1 && (
          <IconButton
            className="transition-all opacity-0 group-hover/option:opacity-100"
            icon={TrashIcon}
          />
        )}

        <IconButton
          className="transition-all opacity-0 group-hover/option:opacity-100"
          icon={PlusIcon}
          onClick={addOption}
        />
      </div>
    </div>
  )
);

const Option = ({ element }: Props) => {
  const dispatch = useAppDispatch();

  const updateElement = (e: any) => {
    dispatch(
      updateElementInForm({
        ...element,
        content: e.currentTarget.value,
      })
    );
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

  const addOption = () => {
    dispatch(addOptionToElement(element.id));
  };

  const updateOption = (option: IFormElementOption) => {
    dispatch(
      updateOptionToElement({
        ...option,
        elementId: element.id,
      })
    );
  };

  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    dispatch(
      sortOption({
        parentId: element.id,
        oldIndex,
        newIndex,
      })
    );
  };

  return (
    <div className="w-full">
      <input
        className="w-full mt-5 font-bold focus:outline-none"
        type="text"
        placeholder="Type the question of the options"
        defaultValue={element.content}
        onKeyDown={deleteElement}
        onChange={updateElement}
      />
      <SortableList
        items={element.options || []}
        addOption={addOption}
        updateOption={updateOption}
        onSortEnd={onSortEnd}
        useDragHandle
      />
    </div>
  );
};

export default Option;
