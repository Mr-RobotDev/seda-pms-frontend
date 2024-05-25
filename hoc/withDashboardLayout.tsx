"use client";
import React, { ComponentType, ReactNode } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

function withDashboardLayout<T extends {}>(
  Component: ComponentType<React.PropsWithChildren<T>>
) {
  return function ComponentWithLayout(props: T) {
    return (
      <DashboardLayout>
        <Component {...props} />
      </DashboardLayout>
    );
  };
}

export default withDashboardLayout;
