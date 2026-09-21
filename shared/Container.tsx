import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  id?: string;
  className?: string;
};

export default function Container({ children, id, className }: ContainerProps) {
  const classes = [
    "mx-auto w-full max-w-[1660px] px-5 md:px-8 lg:px-10",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div id={id} className={classes}>
      {children}
    </div>
  );
}
