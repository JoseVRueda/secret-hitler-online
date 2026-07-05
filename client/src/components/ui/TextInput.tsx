interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> {
  label?: string;
  className?: string;
}

export default function TextInput(props: TextInputProps) {
  const { label, className, id, ...inputProps } = props;

  const inputId = id ?? inputProps.name;

  const classes = [
    "bg-parchment text-ink placeholder:text-ink/40",
    "border-2 border-ink px-3 py-2",
    "font-stamp text-sm tracking-wide",
    "focus:outline-none focus:ring-2 focus:ring-blood focus:ring-offset-2 focus:ring-offset-ink",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="font-stamp text-xs uppercase tracking-[0.2em] text-parchment/80"
        >
          {label}
        </label>
      )}
      <input id={inputId} className={classes} {...inputProps} />
    </div>
  );
}
