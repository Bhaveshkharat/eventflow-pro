import React from "react";
import { events } from "@/data/mock";

export async function generateStaticParams() {
  return events.map((event) => ({
    eventId: event.id,
  }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
