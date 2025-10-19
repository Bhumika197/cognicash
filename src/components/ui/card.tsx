import * as React from "react";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-sm",
        "dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["p-4 sm:p-6", className].filter(Boolean).join(" ")} {...props} />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={["text-lg font-semibold", className].filter(Boolean).join(" ")} {...props} />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["p-4 sm:p-6", className].filter(Boolean).join(" ")} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["p-4 sm:p-6 pt-0", className].filter(Boolean).join(" ")} {...props} />
  );
}
