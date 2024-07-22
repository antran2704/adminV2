"use client";

import { ThemeProvider } from "next-themes";
import { ConfigProvider as ConfigProviderAntd } from "antd";
import { ReactNode } from "react";
import { Provider as ProviderRedux } from "react-redux";
import { store } from "~/store";
import configGlobalAntd from "~/config/globalToken";

const MainComponent = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      enableColorScheme={false}
      disableTransitionOnChange={true}
      attribute="class"
      enableSystem
      defaultTheme="light"
    >
      <ConfigProviderAntd theme={configGlobalAntd}>
        <ProviderRedux store={store}>{children}</ProviderRedux>
      </ConfigProviderAntd>
    </ThemeProvider>
  );
};

export default MainComponent;
