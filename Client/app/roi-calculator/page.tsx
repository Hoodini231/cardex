"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ROICalculatorPage from './roiPage';
import{ NavBar } from '../../components/nav-bar';

const queryClient = new QueryClient();

export default function ROICalculatorPageWrapper() {
  return (
    <>
    <NavBar />
    <QueryClientProvider client={queryClient}>

      <ROICalculatorPage />
    </QueryClientProvider>
    </>
  );
}
