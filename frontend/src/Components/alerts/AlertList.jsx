import AlertItem from "./AlertItem";

export default function AlertList({ alerts, handleClick }) {
  if (!alerts.length) {
    return (
      <p className="text-center text-sm text-slate-400 py-10">
        No alerts yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {[...alerts]
        .sort((a, b) => new Date(b.createdat) - new Date(a.createdat))
        .map((a) => (
            <AlertItem
            key={a.id}
            alert={a}
            handleClick = {handleClick}
            />
        ))
      }
    </div>
  );
}