import React from "react";
import { events } from "@/data/mock";
import BookClient from "./BookClient";

export function generateStaticParams() {
  return events.map((event) => ({
    eventId: event.id,
  }));
}

export default function Page({ params }: { params: Promise<{ eventId: string }> }) {
  return <BookClient params={params} />;
}
