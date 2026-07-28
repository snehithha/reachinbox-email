import MainLayout from "@/components/layout/MainLayout";
import EmailList from "@/components/email/EmailList";
import EmailDetails from "@/components/email/EmailDetails";

export default function Home() {
  return (
    <MainLayout>
      <div className="flex h-full">
        <EmailList />
        <EmailDetails />
      </div>
    </MainLayout>
  );
}