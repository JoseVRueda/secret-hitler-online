import { cn } from "@/lib/cn";

interface TextInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className"
> {
  label?: string;
  className?: string;
}

export default function TextInput(props: TextInputProps) {
  const { label, className, id, ...inputProps } = props;
  const inputId = id ?? inputProps.name;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="font-body text-xs font-bold uppercase tracking-[0.18em] text-muted"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "rounded-sm border-2 border-transparent bg-cream px-3 py-2",
          "font-body text-sm font-medium text-ink placeholder:text-muted-dark",
          "focus:border-fascist focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...inputProps}
      />
    </div>
  );
}
