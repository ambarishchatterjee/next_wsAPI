import Wrapper from "@/layout/wrapper/wrapper";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";


export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient({});
  return (
    <QueryClientProvider client={queryClient}>
      <Wrapper>
        <Toaster position="top-left" />
        <Component {...pageProps} />
      </Wrapper>
    </QueryClientProvider>

  );
}
