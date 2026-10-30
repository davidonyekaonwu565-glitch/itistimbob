/**
 * =========================================================================
 * ITSTIMBOB OFFICIAL WEBSITE CONFIGURATION
 * =========================================================================
 * 
 * Update client links and settings here. Any element with a data-config-link
 * or data-config-text attribute will automatically be populated from this file.
 */

const SITE_CONFIG = {
  // Brand details
  brandName: "ItsTimbob",
  tagline: "Sports, Live Reactions, Slots & Community Entertainment",

  // WTF Games Referral Code & Link
  wtfReferralCode: "ItsTimbob",
  wtfReferralUrl: "https://www.wtfgames.com", 

  // Social & Community Channels
  kickUrl: "https://kick.com/itstimbob",
  youtubeUrl: "https://youtube.com/@itstimbob",
  xUrl: "https://x.com/ItsTimbob",
  instagramUrl: "https://www.instagram.com/itstimbobofficial",
  discordUrl: "https://discord.gg/hKkG9NxuEg",
  telegramUrl: "https://t.me/+GjSgJUK0AUYxNmZh",
  
  // Contact details
  contactEmail: "hey@timbob.space",

  // Leaderboard Competition Settings & Official Shared Prize Distribution
  leaderboard: {
    poolAmount: "$500",
    cutoffRule: "Cutoff on the 15th of every month",
    vipThreshold: "$15,000",
    prizes: [
      { rank: 1, label: "1st Place", prize: 150, formatted: "$150.00" },
      { rank: 2, label: "2nd Place", prize: 90, formatted: "$90.00" },
      { rank: 3, label: "3rd Place", prize: 60, formatted: "$60.00" },
      { rank: 4, label: "4th Place", prize: 40, formatted: "$40.00" },
      { rank: 5, label: "5th Place", prize: 30, formatted: "$30.00" },
      { rank: 6, label: "6th Place", prize: 25, formatted: "$25.00" },
      { rank: 7, label: "7th Place", prize: 20, formatted: "$20.00" },
      { rank: 8, label: "8th Place", prize: 15, formatted: "$15.00" },
      { rank: 9, label: "9th Place", prize: 12, formatted: "$12.00" },
      { rank: 10, label: "10th Place", prize: 10, formatted: "$10.00" },
      { rank: 11, label: "11th Place", prize: 9, formatted: "$9.00" },
      { rank: 12, label: "12th Place", prize: 8, formatted: "$8.00" },
      { rank: 13, label: "13th Place", prize: 7, formatted: "$7.00" },
      { rank: 14, label: "14th Place", prize: 6, formatted: "$6.00" },
      { rank: 15, label: "15th Place", prize: 5, formatted: "$5.00" },
      { rank: 16, label: "16th Place", prize: 4, formatted: "$4.00" },
      { rank: 17, label: "17th Place", prize: 3, formatted: "$3.00" },
      { rank: 18, label: "18th Place", prize: 2, formatted: "$2.00" },
      { rank: 19, label: "19th Place", prize: 2, formatted: "$2.00" },
      { rank: 20, label: "20th Place", prize: 2, formatted: "$2.00" }
    ]
  },

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

  // Bonus & Reward Information
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
if (typeof module !== "undefined" && module.exports) {
  module.exports = SITE_CONFIG;
}
