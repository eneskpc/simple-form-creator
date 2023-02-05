import { CheckIcon } from "@heroicons/react/24/outline";

type Props = {
  isChecked: boolean;
  className?: string;
  onCheckedChanged: (isChecked: boolean) => void;
};

const CheckBox = (props: Props) => {
  if (props.isChecked) {
    return (
      <div className={props.className}>
        <button
          onClick={() => props.onCheckedChanged(false)}
          className="transition-all w-6 h-6 rounded-md bg-slate-900 border border-gray-300"
        >
          <CheckIcon className="text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className={props.className}>
      <button
        onClick={() => props.onCheckedChanged(true)}
        className="transition-all w-6 h-6 rounded-md border border-gray-300"
      ></button>
    </div>
  );
};

export default CheckBox;
