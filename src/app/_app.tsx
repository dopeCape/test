import RootLayout from "./layout";

function MyApp({
  Component,
  pageProps,
}: {
  Component: React.ComponentType;
  pageProps: Record<string, unknown>;
}) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}

export default MyApp;
