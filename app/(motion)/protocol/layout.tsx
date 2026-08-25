import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

export default function ProtocolLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
