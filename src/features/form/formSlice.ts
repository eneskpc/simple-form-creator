import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { arrayMove } from "react-sortable-hoc";
import { GenerateKey } from "../../helpers/StringHelper";
import IForm from "../../models/IForm";
import IFormElement from "../../models/IFormElement";
import IFormElementOption from "../../models/IFormElementOption";
import FormElementType from "../../types/FormElementType";

interface FormState {
  forms: IForm[];
}

type IFormElementOptionWithElementId = {
  elementId: string;
} & IFormElementOption;

type ISortPayload = {
  parentId?: string;
  oldIndex: number;
  newIndex: number;
};

const initialState = {
  forms: [],
} as FormState;

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setSelectedForm: (state, action: PayloadAction<IForm | null>) => {
      state.forms = state.forms.map((f) => ({
        ...f,
        isSelected: false,
      }));
      const index = state.forms.findIndex((f) => f.id === action.payload?.id);
      if (index > -1) {
        state.forms[index].isSelected = true;
      }
    },
    createNewForm: (state) => {
      const newForm = {
        id: GenerateKey(),
        title: `New Form #${state.forms.length + 1}`,
        elements: [],
        buttonText: "Send Form",
        isSelected: true,
      } as IForm;

      state.forms = [
        ...state.forms.map((f) => ({
          ...f,
          isSelected: false,
        })),
        newForm,
      ];
    },
    importFromJSON: (state, action: PayloadAction<IForm>) => {
      state.forms = [
        ...state.forms.map((f) => ({
          ...f,
          isSelected: false,
        })),
        {
          ...action.payload,
          isSelected: true,
        },
      ];
    },
    updateForm: (state, action: PayloadAction<IForm>) => {
      const index = state.forms.findIndex((f) => f.id === action.payload.id);
      if (index > -1) {
        state.forms[index] = action.payload;
      }
    },
    updateFormTitle: (state, action: PayloadAction<string>) => {
      const index = state.forms.findIndex((f) => f.isSelected);
      if (index > -1) {
        state.forms[index].title = action.payload;
      }
    },
    addElementToForm: (state, action: PayloadAction<number>) => {
      const index = state.forms.findIndex((f) => f.isSelected);
      if (index === -1) {
        return;
      }

      state.forms[index].elements = [
        ...state.forms[index].elements.map((e) => ({
          ...e,
          isFocused: false,
        })),
        {
          id: GenerateKey(),
          content: "",
          order: action.payload + 1,
          type: FormElementType.TEXT,
          isFocused: true,
        },
      ];

      state.forms[index].elements.sort((a, b) => a.order - b.order);

      state.forms[index].elements = state.forms[index].elements.map((e, i) => {
        return {
          id: e.id,
          content: e.content,
          order: i,
          type: e.type,
          options: e.options,
        };
      });
    },
    updateElementInForm: (state, action: PayloadAction<IFormElement>) => {
      const formIndex = state.forms.findIndex((f) => f.isSelected);
      if (formIndex === -1) {
        return;
      }

      const elementIndex = state.forms[formIndex].elements.findIndex(
        (e) => e.id === action.payload.id
      );
      if (elementIndex === -1) {
        return;
      }

      state.forms[formIndex].elements[elementIndex] = action.payload;
      if (
        state.forms[formIndex].elements[elementIndex].content.startsWith("/")
      ) {
        state.forms[formIndex].elements[elementIndex].content = "";
      }
      if (
        action.payload.type === FormElementType.OPTION &&
        (state.forms[formIndex].elements[elementIndex].options?.length || 0) ===
          0
      ) {
        state.forms[formIndex].elements[elementIndex].options = [
          {
            id: GenerateKey(),
            content: "",
            order: 0,
          },
        ];
      }
    },
    removeElement: (state, action: PayloadAction<IFormElement>) => {
      const formIndex = state.forms.findIndex((f) => f.isSelected);
      if (formIndex === -1) {
        return;
      }

      state.forms[formIndex].elements = state.forms[formIndex].elements.filter(
        (e) => e.id !== action.payload.id
      );
    },
    sortElement: (state, action: PayloadAction<ISortPayload>) => {
      const formIndex = state.forms.findIndex((f) => f.isSelected);
      if (formIndex === -1) {
        return;
      }

      const { oldIndex, newIndex } = action.payload;

      state.forms[formIndex].elements = arrayMove(
        state.forms[formIndex].elements,
        oldIndex,
        newIndex
      ).map((f, index) => ({
        ...f,
        order: index,
      }));
    },
    addOptionToElement: (state, action: PayloadAction<string>) => {
      const formIndex = state.forms.findIndex((f) => f.isSelected);
      if (formIndex === -1) {
        return;
      }

      const elementIndex = state.forms[formIndex].elements.findIndex(
        (e) => e.id === action.payload
      );
      if (elementIndex === -1) {
        return;
      }

      state.forms[formIndex].elements[elementIndex].options = [
        ...(state.forms[formIndex].elements[elementIndex].options || []),
        {
          id: GenerateKey(),
          content: "",
          order: (state.forms[formIndex].elements[elementIndex].options || [])
            .length,
        },
      ];
    },
    updateOptionToElement: (
      state,
      action: PayloadAction<IFormElementOptionWithElementId>
    ) => {
      const formIndex = state.forms.findIndex((f) => f.isSelected);
      if (formIndex === -1) {
        return;
      }

      const elementIndex = state.forms[formIndex].elements.findIndex(
        (e) => e.id === action.payload.elementId
      );
      if (elementIndex === -1) {
        return;
      }

      if (!state.forms[formIndex].elements[elementIndex].options) {
        return;
      }

      const optionIndex = (
        state.forms[formIndex].elements[elementIndex].options || []
      ).findIndex((o) => o.id === action.payload.id);
      if (optionIndex === -1) {
        return;
      }

      (state.forms[formIndex].elements[elementIndex].options || [])[
        optionIndex
      ] = {
        id: action.payload.id,
        content: action.payload.content,
        order: action.payload.order,
      };
    },
    sortOption: (state, action: PayloadAction<ISortPayload>) => {
      const formIndex = state.forms.findIndex((f) => f.isSelected);
      if (formIndex === -1) {
        return;
      }

      const { parentId, oldIndex, newIndex } = action.payload;
      if (!parentId) {
        return;
      }

      const elementIndex = state.forms[formIndex].elements.findIndex(
        (e) => e.id === parentId
      );
      if (elementIndex === -1) {
        return;
      }

      state.forms[formIndex].elements[elementIndex].options = arrayMove(
        state.forms[formIndex].elements[elementIndex].options || [],
        oldIndex,
        newIndex
      ).map((o, index) => ({
        ...o,
        order: index,
      }));
    },
  },
});

export const {
  setSelectedForm,
  createNewForm,
  updateForm,
  updateFormTitle,
  addElementToForm,
  updateElementInForm,
  removeElement,
  addOptionToElement,
  updateOptionToElement,
  sortElement,
  sortOption,
  importFromJSON
} = formSlice.actions;

export default formSlice.reducer;
