/**
 * =========================================================================
 * ITSTIMBOB OFFICIAL WEBSITE CONFIGURATION
 * =========================================================================
 * 
 * Update client links here. Any element in index.html with a data-config-link
 * or data-config-text attribute will automatically be populated from this file.
 */

const SITE_CONFIG = {
  // Brand details
  brandName: "ItsTimbob",
  tagline: "Sports, Live Reactions, Slots & Community Entertainment",

  // WTF Games Referral Code & Link
  // Temporary referral code until client provides the official referral link over the weekend:
  wtfReferralCode: "ItsTimbob",
  // All WTF Games buttons link directly to WTF Games:
  wtfReferralUrl: "https://www.wtfgames.com", 

  // Social & Community Channels
  kickUrl: "https://kick.com/itstimbob",
  xUrl: "https://x.com/ItsTimbob",
  discordUrl: "https://discord.gg/hKkG9NxuEg",
  telegramUrl: "https://t.me/+GjSgJUK0AUYxNmZh",
  
  // Contact details
  contactEmail: "hey@timbob.space",

  // Stream status & schedule settings
  stream: {
    channel: "itstimbob",
    isLive: false,
    autoCheckKick: false,
    title: "Gameday Reactions — Sunday Slate Live",
    category: "Sports & Reactions • Slots & Giveaways",
    statusText: "Stream is offline — check the schedule below",
    liveText: "LIVE NOW ON KICK — Come join the action!",
    viewers: 1420
  },

  // Bonus & Reward Information (Configurable Placeholder)
  bonusReward: {
    badgeText: "COMMUNITY BONUS",
    title: "Surprise Streams & Community Rewards",
    description: "Surprise streams for big games announced in Discord. Exclusive WTF Games player bonuses, VIP lossback matching, and giveaway entries active during live broadcasts.",
    actionText: "Claim on Discord",
    actionUrl: "https://discord.gg/hKkG9NxuEg"
  }
};

// Expose globally
if (typeof window !== "undefined") {
  window.SITE_CONFIG = SITE_CONFIG;
}
