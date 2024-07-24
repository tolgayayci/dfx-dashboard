import Image from "next/image";

export default function Loading() {
  return (
    <div className="rounded-lg border p-4 flex flex-col items-center justify-center h-[85vh]">
      <Image
        src="/images/icp-logo.svg"
        alt="Loading..."
        className="animate-pulse"
        width={70}
        height={70}
      />
    </div>
  );
}
