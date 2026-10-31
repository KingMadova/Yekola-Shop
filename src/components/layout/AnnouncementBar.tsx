import { COPY } from "@/lib/config";

export function AnnouncementBar() {
  return (
    <div className="bg-emerald-950 text-sm font-medium text-white">
      <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-1 px-4 py-2 text-center">
        {COPY.announcement.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
