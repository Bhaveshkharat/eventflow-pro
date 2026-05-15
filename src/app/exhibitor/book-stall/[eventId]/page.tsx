import React from "react";
import { events } from "@/data/mock";
import BookStallClient from "./BookStallClient";

export function generateStaticParams() {
  return events.map((event) => ({
    eventId: event.id,
  }));
}

export default function Page({ params }: { params: Promise<{ eventId: string }> }) {
  return <BookStallClient params={params} />;
}
