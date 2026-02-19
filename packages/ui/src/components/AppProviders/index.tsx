'use client';

import type { PropsWithChildren } from 'react';
import { suitTheme } from '../../theme';
import tamaguiConfig from '../../tamagui.config';
import { TamaguiProvider } from 'tamagui';

const providerConfig = tamaguiConfig as NonNullable<
  Parameters<typeof TamaguiProvider>[0]['config']
>;

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Amaranth:wght@400;700&family=Arvo:wght@400;700&family=Zilla+Slab:wght@300;400;500;700&display=swap');
          html, body {
            margin: 0;
            padding: 0;
            background: ${suitTheme.colors.background};
            color: ${suitTheme.colors.text};
          }
          * {
            box-sizing: border-box;
          }
        `}
      </style>
      <TamaguiProvider config={providerConfig} defaultTheme="dark">
        <div
          style={{
            minHeight: '100vh',
          }}
        >
          {children}
        </div>
      </TamaguiProvider>
    </>
  );
}
