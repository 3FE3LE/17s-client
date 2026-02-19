'use client';

import { createContext, useContext, type PropsWithChildren } from 'react';
import type { SevenReservationsClubRoleDataSource } from './role-data-source';

const RoleDataSourceContext = createContext<SevenReservationsClubRoleDataSource | null>(null);

export interface SevenReservationsClubRoleDataSourceProviderProps {
  dataSource: SevenReservationsClubRoleDataSource;
}

export function SevenReservationsClubRoleDataSourceProvider({
  dataSource,
  children,
}: PropsWithChildren<SevenReservationsClubRoleDataSourceProviderProps>) {
  return (
    <RoleDataSourceContext.Provider value={dataSource}>{children}</RoleDataSourceContext.Provider>
  );
}

export function useSevenReservationsClubRoleDataSource(): SevenReservationsClubRoleDataSource {
  const context = useContext(RoleDataSourceContext);
  if (!context) {
    throw new Error('SevenReservationsClubRoleDataSourceProvider is missing in the component tree');
  }
  return context;
}
