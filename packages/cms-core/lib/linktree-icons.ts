import type { ComponentType } from "react";
import {
  Link2,
  Globe,
  Mail,
  Phone,
  MessageCircle,
  Music,
  ShoppingBag,
  ShoppingCart,
  Calendar,
  MapPin,
  ExternalLink,
  Star,
  Heart,
  Send,
  Rss,
  Video,
  Camera,
  FileText,
  Download,
  Share2,
  Gift,
  Coffee,
  BookOpen,
  Users,
  Play,
  Facebook,
  Instagram,
  Twitch,
  Slack,
} from "lucide-react";
import { FaXTwitter, FaDiscord, FaReddit, FaGithub, FaYoutube, FaLinkedin, FaTiktok } from "react-icons/fa6";

// Covers both lucide-react's forwardRef components and react-icons' plain
// function components — the two icon sources mixed into this registry.
export type LinktreeIconComponent = ComponentType<{ className?: string }>;

// Fixed, curated registry — deliberately does not accept arbitrary strings so
// the public linktree page never has to dynamically resolve/eval an icon key.
export const LINKTREE_ICONS: { key: string; label: string; Icon: LinktreeIconComponent }[] = [
  { key: "link", label: "Link", Icon: Link2 },
  { key: "globe", label: "Website", Icon: Globe },
  { key: "mail", label: "Email", Icon: Mail },
  { key: "phone", label: "Phone", Icon: Phone },
  { key: "message", label: "Message", Icon: MessageCircle },
  { key: "music", label: "Music", Icon: Music },
  { key: "shop", label: "Shop", Icon: ShoppingBag },
  { key: "cart", label: "Cart", Icon: ShoppingCart },
  { key: "calendar", label: "Calendar", Icon: Calendar },
  { key: "location", label: "Location", Icon: MapPin },
  { key: "external", label: "External", Icon: ExternalLink },
  { key: "star", label: "Star", Icon: Star },
  { key: "heart", label: "Heart", Icon: Heart },
  { key: "send", label: "Send", Icon: Send },
  { key: "rss", label: "RSS", Icon: Rss },
  { key: "video", label: "Video", Icon: Video },
  { key: "camera", label: "Camera", Icon: Camera },
  { key: "document", label: "Document", Icon: FileText },
  { key: "download", label: "Download", Icon: Download },
  { key: "share", label: "Share", Icon: Share2 },
  { key: "gift", label: "Gift", Icon: Gift },
  { key: "coffee", label: "Coffee", Icon: Coffee },
  { key: "book", label: "Book", Icon: BookOpen },
  { key: "community", label: "Community", Icon: Users },
  { key: "play", label: "Play", Icon: Play },
  { key: "github", label: "GitHub", Icon: FaGithub },
  { key: "twitter", label: "Twitter / X", Icon: FaXTwitter },
  { key: "linkedin", label: "LinkedIn", Icon: FaLinkedin },
  { key: "youtube", label: "YouTube", Icon: FaYoutube },
  { key: "facebook", label: "Facebook", Icon: Facebook },
  { key: "instagram", label: "Instagram", Icon: Instagram },
  { key: "twitch", label: "Twitch", Icon: Twitch },
  { key: "slack", label: "Slack", Icon: Slack },
  { key: "discord", label: "Discord", Icon: FaDiscord },
  { key: "telegram", label: "Telegram", Icon: Send },
  { key: "reddit", label: "Reddit", Icon: FaReddit },
  { key: "tiktok", label: "TikTok", Icon: FaTiktok },
];

const ICON_MAP = new Map(LINKTREE_ICONS.map((entry) => [entry.key, entry.Icon]));

export function resolveLinktreeIcon(key: string | null | undefined): LinktreeIconComponent {
  return (key && ICON_MAP.get(key)) || Link2;
}
