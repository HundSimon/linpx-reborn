export default function ({ title }: { title: string }) {
  return (
    <span
      className="bg-white m-1 px-2 py-0.5 rounded-full inline-block text-sm"
      style={{ boxShadow: '0px 0px 5px #888' }}
    >
      {title}
    </span>
  );
}
