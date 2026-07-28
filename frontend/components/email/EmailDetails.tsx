export default function EmailDetails() {
  return (
    <div className="flex-1 bg-white">
      <div className="border-b p-6">
        <h1 className="text-2xl font-semibold">
          Email Details
        </h1>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <p className="font-semibold">Recipient</p>
          <p>john@example.com</p>
        </div>

        <div>
          <p className="font-semibold">Subject</p>
          <p>Interview Schedule</p>
        </div>

        <div>
          <p className="font-semibold">Body</p>
          <p>
            This panel will display the full email body after
            we connect it to the backend.
          </p>
        </div>
      </div>
    </div>
  );
}