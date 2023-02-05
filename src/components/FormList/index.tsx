import { ArrowDownTrayIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  createNewForm,
  importFromJSON,
  setSelectedForm
} from "../../features/form/formSlice";

import { ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import IForm from "../../models/IForm";
import Button from "../Button";

const FormList = () => {
  const forms = useAppSelector((state) => state.form.forms);
  const dispatch = useDispatch();

  const form_onClick = (form: IForm) => {
    dispatch(setSelectedForm(form));
  };

  const addNewForm_onClick = () => {
    dispatch(createNewForm());
  };
  const importFromFile = (e: ChangeEvent<HTMLInputElement>) => {
    if ((e.currentTarget.files || []).length === 0) {
      return;
    }
    const file = (e.currentTarget.files || [])[0];

    const reader = new FileReader();
    reader.addEventListener("load", (ev) => {
      if (
        ev.target &&
        typeof ev.target.result === "string" &&
        ev.target.result.length > 0
      ) {
        dispatch(importFromJSON(JSON.parse(ev.target.result) as IForm));
      }
    });
    reader.readAsText(file);
  };

  return (
    <div className="py-5">
      <div className="text-right">
        <Button className="relative transition-all rounded bg-gray-100 py-1 px-3 mr-2 active:scale-95 hover:bg-gray-200 hover:shadow-md">
          <>
            <input
              type="file"
              onChange={importFromFile}
              className="opacity-0 absolute left-0 top-0 w-full h-full"
            />
            <div className="flex items-center">
              <PlusIcon className="w-5 h-5" />
              <span className="ml-1">Import From JSON File</span>
            </div>
          </>
        </Button>
        <Button
          onClick={addNewForm_onClick}
          className="transition-all rounded bg-gray-100 py-1 px-3 active:scale-95 hover:bg-gray-200 hover:shadow-md"
        >
          <div className="flex items-center">
            <PlusIcon className="w-5 h-5" />
            <span className="ml-1">New</span>
          </div>
        </Button>
      </div>
      {forms.map((f) => {
        return (
          <div
            key={f.id}
            className="w-full transition-all flex justify-between items-center p-4 my-5 rounded-md border border-gray-200 hover:bg-gray-100 hover:shadow-md"
          >
            <Button onClick={() => form_onClick(f)}>{f.title}</Button>
            <a
              href={
                "data:text/json;charset=utf-8," +
                encodeURIComponent(JSON.stringify(f))
              }
              download={`${f.title}.json`}
            >
              <ArrowDownTrayIcon className="w-6 h-6" />
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default FormList;
