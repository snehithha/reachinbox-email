interface Email {
  id: string;
  recipient: string;
  subject: string;
  status: string;
}

const emails: Email[] = [
  {
    id: "1",
    recipient: "john@example.com",
    subject: "Interview Schedule",
    status: "Pending",
  },
  {
    id: "2",
    recipient: "alice@example.com",
    subject: "Welcome Email",
    status: "Sent",
  },
];

export default function EmailList() {
  return (
    <div className="w-80 border-r bg-white overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">
          Scheduled Emails
        </h2>
      </div>

      {emails.map((email) => (
        <div
          key={email.id}
          className="border-b p-4 hover:bg-gray-50 cursor-pointer"
        >
          <p className="font-medium">{email.recipient}</p>

          <p className="text-sm text-gray-500 truncate">
            {email.subject}
          </p>

          <span
            className={`mt-2 inline-block rounded-full px-2 py-1 text-xs ${
              email.status === "Sent"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {email.status}
          </span>
        </div>
      ))}
    </div>
  );
}