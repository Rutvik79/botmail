"use client";
import ThemeToggle from "@/components/theme-toggle";
import dynamic from "next/dynamic";

// import Mail from "./mail";
const Mail = dynamic(
  () => {
    return import("./mail");
  },
  {
    ssr: false,
  },
);

const MailDashboard = () => {
  return (
    <>
      <div className="let-4 absolute bottom-4">
        <ThemeToggle />
      </div>
      <Mail
        defaultLayout={[20, 32, 48]}
        defaultCollapsed={false}
        navCollapsedSize={4}
      />
    </>
  );
};

export default MailDashboard;
