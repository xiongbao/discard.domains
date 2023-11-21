import Link from "@/components/Link";

export default function Footer() {
  const copyYear = new Date().getFullYear();
  return (
    <footer className="z-10 flex items-baseline w-full px-4 py-2 mt-auto text-white gap-x-1 bg-mcqueen">
      <Link
        href="https://boring.studio"
        isExternal
        className="block ml-auto text-sm tracking-wide w-fit"
      >
        &copy;{copyYear} Boring Studio.
      </Link>
    </footer>
  );
}
