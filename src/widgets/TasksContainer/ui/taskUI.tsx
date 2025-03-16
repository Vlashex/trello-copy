"use server";
import React from "react";

type TaskUIProps = {
  id: number;
  content: string;
};

export default async function TaskUI({ id, content }: TaskUIProps) {
  return (
    <>
      <h1 className="mb-1">Task {id}</h1>
      <p className="overflow-y-visible min-h-20">{content}</p>
    </>
  );
}
