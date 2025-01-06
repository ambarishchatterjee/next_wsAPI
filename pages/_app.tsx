import Wrapper from "@/layout/wrapper/wrapper";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient({});
  return (
    <QueryClientProvider client={queryClient}>
      <Wrapper>
        <Component {...pageProps} />;
      </Wrapper>
    </QueryClientProvider>
  );
}
