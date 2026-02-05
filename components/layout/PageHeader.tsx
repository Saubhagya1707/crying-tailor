type PageHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div
      className={
        actions
          ? "mb-6 flex items-center justify-between gap-4"
          : "mb-6"
      }
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
          {title}
        </h1>
        {description != null && (
          <div className="mt-2 text-sm text-[var(--text-secondary)]">
            {description}
          </div>
        )}
      </div>
      {actions != null && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
