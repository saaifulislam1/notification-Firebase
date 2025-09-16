"use client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TaskCard({ task }: { task: any }) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <p className="font-medium">{task.name}</p>
      {task.type === "calendar" && (
        <input type="datetime-local" className="mt-2 border p-2 rounded" />
      )}
    </div>
  );
}
