import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Bars2Icon
} from "@heroicons/react/24/outline";
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from "react-sortable-hoc";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  setSelectedForm,
  sortElement,
  updateForm
} from "../../features/form/formSlice";

import { useState } from "react";
import IFormElement from "../../models/IFormElement";
import FormElementType from "../../types/FormElementType";
import Button from "../Button";
import RowInput from "../RowInput";

type ISortableList = {
  items: IFormElement[];
};

type ISortableElement = {
  value: IFormElement;
};

const DragHandle = SortableHandle(() => (
  <Bars2Icon className="w-6 h-6 mt-5 mr-2 cursor-row-resize" />
));

const SortableList = SortableContainer<ISortableList>(
  ({ items }: { items: IFormElement[] }) => {
    return (
      <div className="w-full">
        {items.map((value: IFormElement, index: number) => (
          <SortableItem key={value.id} index={index} value={value} />
        ))}
      </div>
    );
  }
);

const SortableItem = SortableElement<ISortableElement>(
  ({ value }: { value: IFormElement }) => (
    <div className="flex items-start w-full">
      {value.order > -1 && <DragHandle />}
      <RowInput key={value.id} element={value} removable={true} />
    </div>
  )
);

const FormDetail = () => {
  const formDetail = useAppSelector((state) =>
    state.form.forms.find((f) => f.isSelected)
  );
  const dispatch = useAppDispatch();

  const [buttonModal, setButtonModal] = useState(false);

  const back_onClick = () => {
    dispatch(setSelectedForm(null));
  };

  const sendForm_onInput = (event: any) => {
    if (!formDetail) {
      return;
    }
    let form = JSON.parse(JSON.stringify(formDetail));
    form.buttonText = event.currentTarget.value;
    dispatch(updateForm(form));
  };

  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    dispatch(
      sortElement({
        oldIndex,
        newIndex,
      })
    );
  };

  return (
    <div className="py-5">
      <Button
        onClick={back_onClick}
        className="transition-all rounded bg-gray-100 py-1 px-3 active:scale-95 hover:bg-gray-200 hover:shadow-md"
      >
        <div className="flex items-center">
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="ml-1">Back</span>
        </div>
      </Button>

      <RowInput
        element={{
          id: formDetail?.id || "-1",
          content: formDetail?.title || "-",
          order: -1,
          type: FormElementType.HEADLINE,
        }}
      />

      <SortableList
        items={formDetail?.elements || []}
        onSortEnd={onSortEnd}
        useDragHandle
      />
      <div className="relative my-5">
        <Button
          onClick={() => setButtonModal(!buttonModal)}
          className="transition-all rounded bg-slate-900 py-1 px-3 active:scale-95 hover:bg-slate-600 hover:shadow-md"
        >
          <div className="flex items-center">
            <strong className="text-white">{formDetail?.buttonText}</strong>
            <ArrowRightIcon className="text-white w-5 h-5 ml-1" />
          </div>
        </Button>
        {buttonModal && (
          <div className="absolute top-full shadow-md p-4">
            <input
              type="text"
              onChange={sendForm_onInput}
              className="border border-gray-400 px-3 py-2 rounded-md"
              value={formDetail?.buttonText}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormDetail;
