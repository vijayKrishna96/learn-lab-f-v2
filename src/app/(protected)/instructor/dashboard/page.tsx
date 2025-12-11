// File: DashboardHome.tsx
"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.scss";
import {
  TrendingUp,
  Star,
  MessageSquare,
  Users,
  DollarSign,
  Activity as ActivityIcon,
  ShoppingCart,
  Calendar,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data for the sales chart
const salesData = [
  { month: "Jan", sales: 4200, students: 12 },
  { month: "Feb", sales: 5800, students: 18 },
  { month: "Mar", sales: 7200, students: 24 },
  { month: "Apr", sales: 6500, students: 21 },
  { month: "May", sales: 8900, students: 29 },
  { month: "Jun", sales: 10200, students: 35 },
];

// Recent activity data
const recentActivities = [
  {
    id: 1,
    student: "Sarah Johnson",
    course: "Advanced React",
    action: "Purchased",
    time: "2 hours ago",
    amount: 299,
  },
  {
    id: 2,
    student: "Michael Chen",
    course: "Python Mastery",
    action: "Enrolled",
    time: "4 hours ago",
    amount: 199,
  },
  {
    id: 3,
    student: "Emma Wilson",
    course: "UI/UX Design",
    action: "Completed",
    time: "6 hours ago",
    amount: 0,
  },
  {
    id: 4,
    student: "James Brown",
    course: "Data Science",
    action: "Purchased",
    time: "8 hours ago",
    amount: 349,
  },
  {
    id: 5,
    student: "Lisa Anderson",
    course: "Web Development",
    action: "Started",
    time: "10 hours ago",
    amount: 0,
  },
];

// Sample reviews (3-5 items)
const sampleReviews = [
  {
    id: 1,
    rating: 5,
    reviewer: "Asha Menon",
    avatar: "",
    excerpt: "Great course — clear examples and structure!",
    time: "3 hours ago",
  },
  {
    id: 2,
    rating: 4,
    reviewer: "Ravi Kumar",
    avatar: "",
    excerpt: "Very practical, loved the quizzes.",
    time: "1 day ago",
  },
  {
    id: 3,
    rating: 3,
    reviewer: "Priya Nair",
    avatar: "",
    excerpt: "Good content but could use more projects.",
    time: "2 days ago",
  },
  {
    id: 4,
    rating: 5,
    reviewer: "John Doe",
    avatar: "",
    excerpt: "Well explained — highly recommend!",
    time: "4 days ago",
  },
];

// simple sentiment heuristic (for demo): positive if rating >=4, neutral 3, negative <3
const getSentiment = (rating: number) => {
  if (rating >= 4) return "positive";
  if (rating === 3) return "neutral";
  return "negative";
};

// Aggregate score
const aggregate = (reviews: typeof sampleReviews) => {
  const count = reviews.length;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / Math.max(1, count);
  return { avg: Math.round(avg * 10) / 10, count };
};

const Page: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const { avg, count } = aggregate(sampleReviews);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    window.addEventListener("focus", check);
    return () => window.removeEventListener("focus", check);
  }, []);

  // Stats data
  const stats = [
    {
      id: 1,
      title: "Total Revenue",
      value: "$42,580",
      change: "+12.5%",
      isPositive: true,
      icon: DollarSign,
      color: "cyan",
    },
    {
      id: 2,
      title: "Total Students",
      value: "2,458",
      change: "+18.2%",
      isPositive: true,
      icon: Users,
      color: "blue",
    },
    {
      id: 3,
      title: "Course Sales",
      value: "1,289",
      change: "+8.7%",
      isPositive: true,
      icon: ShoppingCart,
      color: "purple",
    },
    {
      id: 4,
      title: "Active Courses",
      value: "48",
      change: "-2.4%",
      isPositive: false,
      icon: ActivityIcon,
      color: "yellow",
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboard__container}>
        {/* Header */}
        <header className={styles.dashboard__header}>
          <div>
            <h1 className={styles.dashboard__title}>Dashboard Overview</h1>
            <p className={styles.dashboard__subtitle}>
              Welcome back! Here's what's happening today.
            </p>
          </div>
        </header>

        {/* Stats Grid */}
        <section className={styles.dashboard__stats}>
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.id}
                className={`${styles.statcard} ${
                  styles[`statcard--${stat.color}`]
                }`}
              >
                <div className={styles.statcard__header}>
                  <div className={styles.statcard__iconwrapper}>
                    <Icon className={styles.statcard__icon} size={20} />
                  </div>
                  <div
                    className={`${styles.statcard__change} ${
                      stat.isPositive
                        ? styles["statcard__change--positive"]
                        : styles["statcard__change--negative"]
                    }`}
                  >
                    {stat.isPositive ? (
                      <ArrowUp size={14} />
                    ) : (
                      <ArrowDown size={14} />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>

                <div className={styles.statcard__body}>
                  <h3 className={styles.statcard__value}>{stat.value}</h3>
                  <p className={styles.statcard__title}>{stat.title}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Main Content */}
        <section className={styles.dashboard__content}>
          {/* Sales Chart */}
          <div className={styles.chartcard}>
            <div className={styles.chartcard__header}>
              <div>
                <h2 className={styles.chartcard__title}>Sales Overview</h2>
                <p className={styles.chartcard__subtitle}>
                  Monthly purchase trends by students
                </p>
              </div>

              <div className={styles.chartcard__legend}>
                <div className={styles.legenditem}>
                  <span
                    className={`${styles.legenditem__dot} ${styles["legenditem__dot--sales"]}`}
                  />
                  <span className={styles.legenditem__label}>Sales ($)</span>
                </div>
                <div className={styles.legenditem}>
                  <span
                    className={`${styles.legenditem__dot} ${styles["legenditem__dot--students"]}`}
                  />
                  <span className={styles.legenditem__label}>Students</span>
                </div>
              </div>
            </div>

            <div className={styles.chartcard__body}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorStudents"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "rgba(255,255,255,0.04)" : "#e5e7eb"}
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="month"
                    stroke={isDark ? "#94a3b8" : "#6b7280"}
                  />
                  <YAxis stroke={isDark ? "#94a3b8" : "#6b7280"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1f2937" : "#ffffff",
                      border: "none",
                      borderRadius: 8,
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fill="url(#colorSales)"
                  />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="#22d3ee"
                    strokeWidth={3}
                    fill="url(#colorStudents)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className={styles["dashboard-activitycard"]}>
              <aside className={styles.activitycard}>
            <div className={styles.activitycard__header}>
              <h2 className={styles.activitycard__title}>Recent Activity</h2>
              <button className={styles.activitycard__viewall}>View All</button>
            </div>

            <div className={styles.activitycard__body}>
              {recentActivities.map((activity) => {
                const Icon =
                  activity.action === "Purchased"
                    ? ShoppingCart
                    : activity.action === "Enrolled"
                    ? Users
                    : activity.action === "Completed"
                    ? TrendingUp
                    : ActivityIcon;

                return (
                  <div key={activity.id} className={styles.activityitem}>
                    <div className={styles.activityitem__icon}>
                      <Icon size={16} />
                    </div>

                    <div className={styles.activityitem__content}>
                      <div className={styles.activityitem__main}>
                        <p className={styles.activityitem__student}>
                          {activity.student}
                        </p>
                        <p className={styles.activityitem__action}>
                          {activity.action}{" "}
                          <span className={styles.activityitem__course}>
                            {activity.course}
                          </span>
                        </p>
                      </div>

                      <div className={styles.activityitem__meta}>
                        <span className={styles.activityitem__time}>
                          <Calendar size={12} />
                          <span>{activity.time}</span>
                        </span>

                        {activity.amount > 0 && (
                          <span className={styles.activityitem__amount}>
                            ${activity.amount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
          <aside className={styles["reviews-card"]}>
            <div className={styles["reviews-card__header"]}>
              <div className={styles["reviews-card__title-wrap"]}>
                <h3 className={styles["reviews-card__title"]}>
                  Recent Reviews
                </h3>
                <p className={styles["reviews-card__meta"]}>
                  Student feedback & quick replies
                </p>
              </div>

              {/* Aggregate badge */}
              <div className={styles["reviews-card__badge"]}>
                <Star size={14} />
                <span className={styles["reviews-card__score"]}>{avg}/5</span>
                <span className={styles["reviews-card__count"]}>
                  from {count} reviews
                </span>
              </div>
            </div>

            <div className={styles["reviews-card__list"]}>
              {sampleReviews.slice(0, 5).map((r) => {
                const sentiment = getSentiment(r.rating); // 'positive'|'neutral'|'negative'
                return (
                  <div key={r.id} className={styles["review-item"]}>
                    <div className={styles["review-item__left"]}>
                      <div
                        className={styles["review-item__avatar"]}
                        aria-hidden
                      >
                        {/* simple avatar fallback with initials */}
                        {r.reviewer
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                    </div>

                    <div className={styles["review-item__body"]}>
                      <div className={styles["review-item__top"]}>
                        <div className={styles["review-item__name"]}>
                          {r.reviewer}
                        </div>

                        <div className={styles["review-item__rating-wrap"]}>
                          <div
                            className={`${styles["rating-badge"]} ${
                              styles[`sentiment--${sentiment}`]
                            }`}
                          >
                            <Star size={12} />
                            <span className={styles["rating-badge__value"]}>
                              {r.rating}
                            </span>
                          </div>
                          <span className={styles["review-item__time"]}>
                            {r.time}
                          </span>
                        </div>
                      </div>

                      <p className={styles["review-item__excerpt"]}>
                        {r.excerpt}
                      </p>

                      <div className={styles["review-item__actions"]}>
                        <button
                          className={styles["reply-button"]}
                          aria-label={`Reply to ${r.reviewer}`}
                        >
                          <MessageSquare size={14} /> Reply
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles["reviews-card__footer"]}>
              <button className={styles["reviews-card__view-all"]}>
                View All Reviews
              </button>
            </div>
          </aside>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
