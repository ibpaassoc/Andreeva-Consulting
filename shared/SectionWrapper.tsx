import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type SectionWrapperProps = {
  children: ReactNode;
  id?: string;
  className?: string;
}

export default function SectionWrapper({
  children,
  id,
  className=""
}:SectionWrapperProps) {
  return (
    <section
      id={id}
      className={twMerge(
        `bg-background-secondary py-20 md:py-28 lg:py-32 px-10`, 
        className
      )}
    >
      {children}
    </section>
  )
}
