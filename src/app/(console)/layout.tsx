import ConsoleClientLayout from './client-layout';

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConsoleClientLayout>{children}</ConsoleClientLayout>;
}