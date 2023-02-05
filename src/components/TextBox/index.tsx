import IconButton, { IconButtonProps } from "../IconButton";
import { useRef, useState } from "react";

type Props = {
  className: string;
  value: string;
  placeholder: string;
  leftIcon?: IconButtonProps;
  rightIcon?: IconButtonProps;
  onInput: (text: string) => void;
};

const TextBox = ({
  value,
  className,
  placeholder,
  leftIcon,
  rightIcon,
  onInput,
}: Props) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const input_forceFocus = () => {
    if (inputRef) {
      inputRef.current?.focus();
    }
  };

  return (
    <div className={className}>
      <div className="flex border border-gray-300 rounded-md">
        {leftIcon && <IconButton {...leftIcon} />}
        <div className="relative w-full">
          {focused || (inputRef && inputRef.current?.value) ? (
            <label
              className="bg-white text-sm transition-all absolute ml-2 top-[-10px] cursor-text max-w-full overflow-hidden"
              onClick={input_forceFocus}
            >
              <span className="whitespace-nowrap">{placeholder}</span>
            </label>
          ) : (
            <label
              className="bg-white transition-all absolute top-2 ml-2 cursor-text max-w-full overflow-hidden"
              onClick={input_forceFocus}
            >
              <span className="whitespace-nowrap">{placeholder}</span>
            </label>
          )}

          <input
            type="text"
            ref={inputRef}
            className="p-2 w-full bg-transparent focus:outline-none"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => onInput(e.currentTarget.value)}
            value={value}
          />
        </div>
        {rightIcon && <IconButton {...rightIcon} />}
      </div>
    </div>
  );
};

export default TextBox;
