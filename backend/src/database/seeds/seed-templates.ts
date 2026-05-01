export const SEED_TEMPLATES = [
  {
    title: 'Product Launch Announcement',
    description:
      'High-impact LinkedIn launch post that pairs the headline benefit with a clear call-to-action.',
    category: 'Product',
    platform: ['linkedin', 'twitter'],
    content:
      "🚀 Today we're launching {product}! Built for {audience} who care about {benefit}. Try it free → {link}",
    tags: ['launch', 'announcement', 'B2B'],
    isPremium: false,
  },
  {
    title: 'Limited-Time Offer',
    description:
      'Urgency-driven Twitter/X post with countdown formatting and a single-link CTA.',
    category: 'Sales',
    platform: ['twitter', 'facebook', 'instagram'],
    content:
      '⏰ {offer} ends in {hours}h. Use code {code} → {link}. No catch, no fluff.',
    tags: ['promo', 'urgency'],
    isPremium: false,
  },
  {
    title: 'Customer Success Story',
    description:
      'Long-form LinkedIn case study scaffold with metric, narrative, and quote slots.',
    category: 'Social Proof',
    platform: ['linkedin'],
    content:
      'How {customer} {achieved metric} with {product}.\n\nThe challenge:\n{challenge}\n\nThe approach:\n{approach}\n\nResult: "{quote}" — {name}, {role}',
    tags: ['case study', 'b2b'],
    isPremium: true,
  },
  {
    title: 'Educational Carousel',
    description:
      'Instagram carousel scaffold for breaking down a single concept across 5 slides.',
    category: 'Education',
    platform: ['instagram', 'linkedin'],
    content:
      'Slide 1: Hook ({pain})\nSlide 2: Why it matters\nSlide 3: The 3-step framework\nSlide 4: Common pitfall\nSlide 5: CTA → {link}',
    tags: ['educational', 'carousel'],
    isPremium: false,
  },
  {
    title: 'Holiday Promo (Generic)',
    description: 'Festive promo with seasonal placeholders.',
    category: 'Holidays',
    platform: ['facebook', 'instagram', 'twitter'],
    content:
      '🎉 Happy {holiday}! Celebrate with {discount} off everything until {date}. Treat yourself → {link}',
    tags: ['holiday', 'seasonal'],
    isPremium: false,
  },
  {
    title: 'Webinar Invite',
    description:
      'LinkedIn registration push covering speaker, value prop, and 1-click sign-up.',
    category: 'Events',
    platform: ['linkedin', 'twitter'],
    content:
      "Free webinar: {topic} with {speaker}. {date} @ {time}. Register: {link}\n\nYou'll learn: {bullet1} · {bullet2} · {bullet3}",
    tags: ['webinar', 'event'],
    isPremium: false,
  },
];
