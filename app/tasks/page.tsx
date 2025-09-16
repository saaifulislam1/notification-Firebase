"use client";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import TaskCard from "@/components/TaskCard";

const tasks = [
  { id: 1, name: "Send invoice to HR" },
  { id: 2, name: "Set reminder", type: "calendar" },
  { id: 3, name: "Prepare weekly report" },
  { id: 4, name: "Review project proposal" },
  { id: 5, name: "Update client records" },
];

export default function TasksPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Tasks</h1>
      <div className="space-y-4">
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} />
        ))}
      </div>
    </div>
  );
}
