import { PropsWithChildren } from "react";
import type { BaseProps } from "types";

export interface Props {
  as?: "h1" | "h2" | "h3";
  className?: string;
}

export const Title = ({
  as = "h2",
  className = "",
  ...rest
}: PropsWithChildren<Props>) => {
  const Element = as;

  return (
    <Element
      className={`text-xl md:text-2xl font-semibold mb-8 text-neutral-600 ${className}`}
      {...rest}
    />
  );
};

export const Subtitle = ({ children, className = "" }: BaseProps) => (
  <div className={`font-semibold text-neutral-800 ${className}`}>
    {children}
  </div>
);
