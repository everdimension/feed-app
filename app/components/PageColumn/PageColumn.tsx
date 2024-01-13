export function PageColumn(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <main
      style={{ paddingInline: 16, marginInline: 'auto', maxWidth: 600, width: '100%' }}
      {...props}
    />
  );
}
