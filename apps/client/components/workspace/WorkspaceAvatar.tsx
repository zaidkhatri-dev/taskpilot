export function WorkspaceAvatar({ name }: { name: string }) {
  return (
    <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-foreground">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
