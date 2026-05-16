import React from "react";
import { events } from "@/data/mock";
import BookClient from "./BookClient";

export function generateStaticParams() {
  return events.map((event) => ({
    eventId: event.id,
  }));
}

import { Suspense } from "react";

export default function Page({ params }: { params: Promise<{ eventId: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BookClient params={params} />
    </Suspense>
  );
}
