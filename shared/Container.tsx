import { ReactNode } from "@node_modules/@types/react";

type ContainerProps = {
  children: ReactNode;
  id?: string;
  className?: string;
}
export default function Container({
  children,
  id,
  className
}:ContainerProps) {
  return (
    <div
      id={id}
      className={`
        mx-auto
        w-full
        max-w-[1660px]
        px-5
        md:px-8
        lg:px-10
        ${className}
      `}
    >
      {children}
    </div>
)}
