import React, { useState } from "react";
import {
  Search,
  Copy,
  Check,
  Sparkles,
  Filter,
  Download,
  Star,
  TrendingUp,
  Calendar,
  Target,
  Users,
  Zap,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  platform: string[];
  content: string;
  tags: string[];
  usage: number;
  rating: number;
  isPremium?: boolean;
}

const templates: Template[] = [
  {
    id: "1",
    title: "Product Launch Announcement",
    description: "Perfect for announcing new products or features",
    category: "Product",
    platform: ["instagram", "twitter", "facebook", "linkedin"],
    content:
      "🚀 Exciting News! We're thrilled to announce the launch of [Product Name]! \n\n✨ Key Features:\n• [Feature 1]\n• [Feature 2]\n• [Feature 3]\n\n🎉 Launch Special: [Offer Details]\n\nReady to transform your [industry]? Link in bio!\n\n#ProductLaunch #Innovation #[YourBrand]",
    tags: ["launch", "product", "announcement"],
    usage: 1250,
    rating: 4.8,
  },
  {
    id: "2",
    title: "Customer Testimonial Template",
    description: "Showcase customer success stories",
    category: "Social Proof",
    platform: ["instagram", "facebook", "linkedin"],
    content:
      '"[Customer Quote]" - [Customer Name], [Title] at [Company]\n\n💡 The Challenge:\n[Describe the problem they faced]\n\n✅ Our Solution:\n[How your product/service helped]\n\n📈 Results:\n[Specific metrics or outcomes]\n\nReady to achieve similar results? DM us "SUCCESS" to learn more!\n\n#CustomerSuccess #Testimonial #Results',
    tags: ["testimonial", "social-proof", "case-study"],
    usage: 980,
    rating: 4.9,
  },
  {
    id: "3",
    title: "Flash Sale Urgency Post",
    description: "Create urgency for limited-time offers",
    category: "Sales",
    platform: ["instagram", "twitter", "facebook"],
    content:
      "⏰ FLASH SALE ALERT! ⏰\n\n🔥 [Discount]% OFF everything!\n\n⏳ Only [X] hours left!\n\nUse code: [CODE]\n\n✨ Don't miss out - Limited stock available!\n\n[Shop Now Link]\n\n#FlashSale #LimitedTime #Deal",
    tags: ["sale", "urgency", "discount"],
    usage: 2100,
    rating: 4.7,
  },
  {
    id: "4",
    title: "Educational Carousel Intro",
    description: "Hook readers for educational content",
    category: "Education",
    platform: ["instagram", "linkedin"],
    content:
      "📚 [Number] things I wish I knew about [Topic] before I started:\n\nSave this for later! 👇\n\n[Continue in carousel slides...]\n\nWhich one surprised you the most? Comment below! 💬\n\nFollow for more [industry] tips! ✅\n\n#Education #[Topic] #Tips",
    tags: ["education", "tips", "carousel"],
    usage: 1560,
    rating: 4.6,
  },
  {
    id: "5",
    title: "Behind the Scenes",
    description: "Humanize your brand with BTS content",
    category: "Brand",
    platform: ["instagram", "facebook"],
    content:
      "Behind the scenes at [Company Name]! 🎬\n\nEver wondered how [process] works? Here's a sneak peek into our [department/operation].\n\n👥 Meet the team that makes it happen!\n\nSwipe to see the magic ➡️\n\n#BehindTheScenes #TeamWork #[CompanyName]",
    tags: ["bts", "culture", "team"],
    usage: 890,
    rating: 4.5,
  },
  {
    id: "6",
    title: "Industry Insights Post",
    description: "Position yourself as a thought leader",
    category: "Thought Leadership",
    platform: ["linkedin", "twitter"],
    content:
      "💡 Industry Insight:\n\n[Key statistic or trend] is reshaping how we think about [industry/topic].\n\nHere's what this means for [target audience]:\n\n1️⃣ [Point 1]\n2️⃣ [Point 2]\n3️⃣ [Point 3]\n\nWhat's your take on this trend? Share in the comments! 👇\n\n#IndustryInsights #[Industry] #ThoughtLeadership",
    tags: ["insights", "trends", "industry"],
    usage: 1120,
    rating: 4.8,
    isPremium: true,
  },
  {
    id: "7",
    title: "User-Generated Content Feature",
    description: "Showcase community content",
    category: "Community",
    platform: ["instagram", "twitter"],
    content:
      "Shoutout to @[username] for this amazing [content type]! 🙌\n\nWe love seeing how you use [product/service]! Keep sharing your creations with #[YourHashtag] for a chance to be featured.\n\n🎁 Monthly Feature Winner gets [prize]!\n\n#Community #[YourHashtag] #UserGenerated",
    tags: ["ugc", "community", "feature"],
    usage: 750,
    rating: 4.4,
  },
  {
    id: "8",
    title: "Newsletter Sign-up CTA",
    description: "Grow your email list",
    category: "Email",
    platform: ["instagram", "facebook", "linkedin"],
    content:
      "📧 Want exclusive [industry] insights delivered to your inbox?\n\nJoin [Number]+ subscribers who get:\n✅ Weekly industry updates\n✅ Exclusive tips & strategies\n✅ Early access to new features\n✅ Special subscriber-only offers\n\n🔗 Link in bio to subscribe!\n\n#Newsletter #StayUpdated #Exclusive",
    tags: ["email", "newsletter", "lead-gen"],
    usage: 1340,
    rating: 4.6,
  },
  {
    id: "9",
    title: "FAQ Response Template",
    description: "Answer common questions professionally",
    category: "Support",
    platform: ["instagram", "facebook", "linkedin"],
    content:
      "❓ Frequently Asked Question:\n\nQ: [Common Question]\n\nA: [Clear, concise answer]\n\n💡 Pro Tip: [Additional helpful information]\n\nHave more questions? Drop them in the comments or DM us! We're here to help. 😊\n\n#FAQ #CustomerSupport #Help",
    tags: ["faq", "support", "help"],
    usage: 670,
    rating: 4.3,
  },
  {
    id: "10",
    title: "Holiday Campaign Template",
    description: "Seasonal marketing campaigns",
    category: "Seasonal",
    platform: ["instagram", "facebook", "twitter"],
    content:
      "🎉 Happy [Holiday Name] from all of us at [Company Name]!\n\nAs we celebrate this special time, we want to thank YOU for being part of our journey this year.\n\n🎁 Our gift to you: [Special Offer]\n\nValid until [Date]. Use code: [CODE]\n\nWishing you joy, success, and [relevant wish]!\n\n#[Holiday] #Seasonal #[CompanyName]",
    tags: ["holiday", "seasonal", "celebration"],
    usage: 1890,
    rating: 4.7,
    isPremium: true,
  },
  {
    id: "11",
    title: "Poll/Engagement Post",
    description: "Boost engagement with questions",
    category: "Engagement",
    platform: ["instagram", "facebook", "linkedin"],
    content:
      "We want to hear from YOU! 📊\n\n[Question related to your industry/product]?\n\nA) [Option 1]\nB) [Option 2]\nC) [Option 3]\nD) [Option 4]\n\nVote in the comments! 👇 And tell us why you chose that option.\n\nBest answers get featured in our stories! ✨\n\n#Poll #Engagement #CommunityVoice",
    tags: ["poll", "engagement", "interactive"],
    usage: 920,
    rating: 4.5,
  },
  {
    id: "12",
    title: "Influencer Collaboration",
    description: "Professional partnership announcements",
    category: "Partnership",
    platform: ["instagram", "facebook"],
    content:
      "🤝 Exciting Partnership Alert!\n\nWe're thrilled to announce our collaboration with @[Influencer Name]!\n\nTogether, we're bringing you [benefit/offer]. Stay tuned for:\n📅 [Date]: [Teaser 1]\n📅 [Date]: [Teaser 2]\n\nFollow @[Influencer Name] and turn on notifications so you don't miss out! 🔔\n\n#Partnership #Collaboration #ExcitingNews",
    tags: ["influencer", "partnership", "collaboration"],
    usage: 580,
    rating: 4.6,
    isPremium: true,
  },
];

const categories = [
  { id: "all", label: "All Templates", icon: Sparkles },
  { id: "Product", label: "Product", icon: Zap },
  { id: "Sales", label: "Sales", icon: TrendingUp },
  { id: "Education", label: "Education", icon: Target },
  { id: "Brand", label: "Brand", icon: Star },
  { id: "Email", label: "Email", icon: Mail },
  { id: "Community", label: "Community", icon: Users },
  { id: "Seasonal", label: "Seasonal", icon: Calendar },
];

const platformIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram size={16} className="text-pink-500" />,
  twitter: <Twitter size={16} className="text-sky-500" />,
  facebook: <Facebook size={16} className="text-blue-600" />,
  linkedin: <Linkedin size={16} className="text-blue-700" />,
  email: <Mail size={16} className="text-slate-600" />,
};

export const Templates: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;

    const matchesPremium = !showPremiumOnly || template.isPremium;

    return matchesSearch && matchesCategory && matchesPremium;
  });

  const handleCopy = async (template: Template) => {
    await navigator.clipboard.writeText(template.content);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Template Library
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            50+ proven templates to boost your marketing
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={<Download size={18} />}>
            Export All
          </Button>
          <Button icon={<Sparkles size={18} />}>Create Custom</Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            />
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-[var(--text-secondary)]" />
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
              <input
                type="checkbox"
                checked={showPremiumOnly}
                onChange={(e) => setShowPremiumOnly(e.target.checked)}
                className="rounded border-[var(--border)]"
              />
              Premium Only
            </label>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-blue-600 text-white"
                    : "bg-[var(--bg-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]"
                }`}
              >
                <Icon size={16} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:border-blue-300 cursor-pointer"
            onClick={() => setSelectedTemplate(template)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-[10px] font-bold uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                  {template.category}
                </span>
                {template.isPremium && (
                  <span className="px-2 py-1 text-[10px] font-bold uppercase bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                    Premium
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={14} fill="currentColor" />
                <span className="text-sm font-semibold">{template.rating}</span>
              </div>
            </div>

            <h3 className="font-bold text-[var(--text-primary)] mb-2 group-hover:text-blue-600 transition-colors">
              {template.title}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              {template.description}
            </p>

            <div className="flex items-center gap-2 mb-4">
              {template.platform.map((platform) => (
                <div
                  key={platform}
                  className="w-8 h-8 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] flex items-center justify-center"
                >
                  {platformIcons[platform]}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                <span className="flex items-center gap-1">
                  <TrendingUp size={14} />
                  {template.usage.toLocaleString()} uses
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(template);
                }}
                className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] hover:border-blue-300 transition-colors"
              >
                {copiedId === template.id ? (
                  <Check size={18} className="text-green-600" />
                ) : (
                  <Copy size={18} className="text-[var(--text-secondary)]" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Search size={48} className="mx-auto mb-4 text-[var(--text-secondary)] opacity-50" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            No templates found
          </h3>
          <p className="text-[var(--text-secondary)]">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Template Detail Modal */}
      <Modal
        isOpen={!!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        title={selectedTemplate?.title || "Template"}
        size="lg"
      >
        {selectedTemplate && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-bold uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                {selectedTemplate.category}
              </span>
              {selectedTemplate.isPremium && (
                <span className="px-2 py-1 text-xs font-bold uppercase bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                  Premium
                </span>
              )}
            </div>

            <p className="text-[var(--text-secondary)]">
              {selectedTemplate.description}
            </p>

            <div className="bg-[var(--bg-main)] border border-[var(--border)] rounded-lg p-4">
              <pre className="text-sm text-[var(--text-primary)] whitespace-pre-wrap font-sans">
                {selectedTemplate.content}
              </pre>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedTemplate.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-[var(--bg-main)] border border-[var(--border)] rounded-full text-[var(--text-secondary)]"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--text-secondary)]">
                  Best for:
                </span>
                <div className="flex items-center gap-1">
                  {selectedTemplate.platform.map((platform) => (
                    <div
                      key={platform}
                      className="w-8 h-8 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] flex items-center justify-center"
                    >
                      {platformIcons[platform]}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-amber-500" />
                  {selectedTemplate.rating} rating
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp size={14} />
                  {selectedTemplate.usage.toLocaleString()} uses
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                  Close
                </Button>
                <Button
                  icon={
                    copiedId === selectedTemplate.id ? (
                      <Check size={18} />
                    ) : (
                      <Copy size={18} />
                    )
                  }
                  onClick={() => handleCopy(selectedTemplate)}
                >
                  {copiedId === selectedTemplate.id ? "Copied!" : "Copy Template"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
