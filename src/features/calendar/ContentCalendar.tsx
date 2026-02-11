import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface ScheduledPost {
  id: string;
  title: string;
  platform: "instagram" | "twitter" | "facebook" | "linkedin";
  date: Date;
  time: string;
  status: "scheduled" | "published" | "draft";
  type: "post" | "story" | "reel";
}

const mockPosts: ScheduledPost[] = [
  {
    id: "1",
    title: "Product Launch Announcement",
    platform: "instagram",
    date: new Date(2026, 1, 12),
    time: "10:00 AM",
    status: "scheduled",
    type: "post",
  },
  {
    id: "2",
    title: "Customer Testimonial",
    platform: "twitter",
    date: new Date(2026, 1, 12),
    time: "2:00 PM",
    status: "published",
    type: "post",
  },
  {
    id: "3",
    title: "Behind the Scenes",
    platform: "facebook",
    date: new Date(2026, 1, 14),
    time: "11:00 AM",
    status: "draft",
    type: "story",
  },
  {
    id: "4",
    title: "Industry Insights",
    platform: "linkedin",
    date: new Date(2026, 1, 15),
    time: "9:00 AM",
    status: "scheduled",
    type: "post",
  },
];

const PlatformIcon = ({ platform }: { platform: string }) => {
  const icons = {
    instagram: <Instagram size={14} className="text-pink-500" />,
    twitter: <Twitter size={14} className="text-sky-500" />,
    facebook: <Facebook size={14} className="text-blue-600" />,
    linkedin: <Linkedin size={14} className="text-blue-700" />,
  };
  return icons[platform as keyof typeof icons] || null;
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    scheduled: "bg-amber-100 text-amber-700 border-amber-200",
    published: "bg-green-100 text-green-700 border-green-200",
    draft: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span
      className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
        styles[status as keyof typeof styles]
      }`}
    >
      {status}
    </span>
  );
};

export const ContentCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const getPostsForDate = (day: number) => {
    return mockPosts.filter(
      (post) =>
        post.date.getDate() === day &&
        post.date.getMonth() === currentDate.getMonth()
    );
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
    );
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    );
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Content Calendar
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Schedule and manage your content across all platforms
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-1">
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                viewMode === "month"
                  ? "bg-blue-600 text-white"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                viewMode === "week"
                  ? "bg-blue-600 text-white"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Week
            </button>
          </div>
          <Button icon={<Plus size={18} />}>Create Post</Button>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-[var(--bg-main)] rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-[var(--text-secondary)]" />
            </button>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-[var(--bg-main)] rounded-lg transition-colors"
            >
              <ChevronRight
                size={20}
                className="text-[var(--text-secondary)]"
              />
            </button>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-[var(--text-secondary)]">Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-[var(--text-secondary)]">Published</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-400"></div>
              <span className="text-[var(--text-secondary)]">Draft</span>
            </div>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-[var(--text-secondary)] py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square"></div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const posts = getPostsForDate(day);
            const isToday =
              day === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth();

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`aspect-square p-2 rounded-xl border transition-all text-left hover:shadow-md ${
                  isToday
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-[var(--border)] bg-[var(--bg-main)] hover:border-blue-300"
                }`}
              >
                <span
                  className={`text-sm font-semibold ${
                    isToday ? "text-blue-600" : "text-[var(--text-primary)]"
                  }`}
                >
                  {day}
                </span>
                <div className="mt-1 space-y-1">
                  {posts.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center gap-1 p-1 rounded bg-[var(--bg-card)] border border-[var(--border)]"
                    >
                      <PlatformIcon platform={post.platform} />
                      <span className="text-[10px] truncate flex-1 text-[var(--text-secondary)]">
                        {post.title.slice(0, 15)}...
                      </span>
                    </div>
                  ))}
                  {posts.length > 3 && (
                    <div className="text-[10px] text-[var(--text-secondary)] text-center">
                      +{posts.length - 3} more
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upcoming Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
            Upcoming Posts
          </h3>
          <div className="space-y-3">
            {mockPosts
              .filter((post) => post.status === "scheduled")
              .map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] hover:border-blue-300 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center">
                    <PlatformIcon platform={post.platform} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[var(--text-primary)] truncate">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1">
                        <CalendarIcon size={12} />
                        {post.date.toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {post.time}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={post.status} />
                </div>
              ))}
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
            Quick Stats
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon size={18} className="text-blue-600" />
                <span className="text-sm text-[var(--text-secondary)]">
                  Scheduled
                </span>
              </div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                12
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                This month
              </p>
            </div>
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={18} className="text-green-600" />
                <span className="text-sm text-[var(--text-secondary)]">
                  Published
                </span>
              </div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                48
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                All time
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={18} className="text-amber-600" />
                <span className="text-sm text-[var(--text-secondary)]">
                  Drafts
                </span>
              </div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                5
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Need review
              </p>
            </div>
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={18} className="text-purple-600" />
                <span className="text-sm text-[var(--text-secondary)]">
                  Best Time
                </span>
              </div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                2PM
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                For engagement
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Day Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedDate
            ? `Posts for ${selectedDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}`
            : "Day Details"
        }
        size="lg"
      >
        <div className="space-y-4">
          {selectedDate &&
            getPostsForDate(selectedDate.getDate()).map((post) => (
              <div
                key={post.id}
                className="flex items-start gap-4 p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border)]"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center">
                  <PlatformIcon platform={post.platform} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-[var(--text-primary)]">
                      {post.title}
                    </h4>
                    <StatusBadge status={post.status} />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mb-2">
                    {post.type.charAt(0).toUpperCase() + post.type.slice(1)} •{" "}
                    {post.time}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      Preview
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          {selectedDate && getPostsForDate(selectedDate.getDate()).length === 0 && (
            <div className="text-center py-8 text-[var(--text-secondary)]">
              <CalendarIcon size={48} className="mx-auto mb-3 opacity-50" />
              <p>No posts scheduled for this day</p>
              <Button className="mt-4" icon={<Plus size={16} />}>
                Create Post
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
