export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex-grow flex items-center justify-center py-12">
        {children}
      </div>
    </div>
  );
}
