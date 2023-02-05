import Button, { ButtonProps } from "../Button";

export type IconButtonProps = {
  icon: React.ForwardRefExoticComponent<
    React.SVGProps<SVGSVGElement> & { title?: string; titleId?: string }
  >;
} & ButtonProps;

const IconButton = (props: IconButtonProps) => {
  const buttonProps: ButtonProps = Object.assign({}, props);
  buttonProps.children = <props.icon className="w-6 h-6 mx-2" />;
  return <Button {...buttonProps} />;
};

export default IconButton;
