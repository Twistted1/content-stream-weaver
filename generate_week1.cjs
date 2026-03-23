const fs = require('fs');

const startDate = new Date('2026-03-23T00:00:00Z'); // Monday of the week
const posts = [];

const twitterTimes = ['09:00:00Z', '13:00:00Z', '17:00:00Z'];
const instagramTime = '11:00:00Z';

const twitterTopics = [
  "Market Open Analysis", "Midday Movers", "Closing Bell Prep",
  "Tech Sector Focus", "Value vs Growth", "Macro Environment",
  "Interest Rate Impact", "Commodities Watch", "Crypto Dynamics",
  "Volatility Playbook", "Options Flow", "Earnings Season",
  "Small Cap Setup", "Blue Chip Stability", "Dividend Strategies",
  "Global Markets", "Forex Trends", "Treasury Yields",
  "Retail Sentiment", "Institutional Activity", "Weekend Review"
];

const igTopics = [
  "Mindset Mondays", "Trading Psychology", "Chart Setup of the Week",
  "Risk Management Rules", "Community Highlight", "Weekly Recap",
  "Prepare for Next Week"
];

let twitterIndex = 0;
let igIndex = 0;

for (let day = 0; day < 7; day++) {
  const currentDate = new Date(startDate);
  currentDate.setUTCDate(startDate.getUTCDate() + day);
  const dateStr = currentDate.toISOString().split('T')[0];

  // 3 Twitter posts per day
  for (let t = 0; t < 3; t++) {
    posts.push({
      type: "POST",
      data: {
        title: `Twitter Post ${twitterIndex + 1}: ${twitterTopics[twitterIndex]}`,
        content: `Insight on ${twitterTopics[twitterIndex]}. The markets demand precision and discipline. Here is our technical breakdown for the day.\n\n#Trading #Finance #NovusExchange #Markets`,
        type: "image"
      },
      metadata: {
        platforms: ["twitter"],
        scheduled_at: `${dateStr}T${twitterTimes[t]}`
      }
    });
    twitterIndex++;
  }

  // 1 Instagram post per day
  posts.push({
    type: "POST",
    data: {
      title: `IG Post ${igIndex + 1}: ${igTopics[igIndex]}`,
      content: `${igTopics[igIndex]} 📊\n\nConsistency isn't just a buzzword; it's the ultimate edge. Read the full breakdown in our bio link!\n\n#NovusExchange #TradingPsychology #FinancialFreedom #Investing`,
      type: "image"
    },
    metadata: {
      platforms: ["instagram"],
      scheduled_at: `${dateStr}T${instagramTime}`
    }
  });
  igIndex++;
}

const ujt = {
  version: "1.0",
  items: posts
};

fs.writeFileSync('d:/Active Projects/content-stream/week1_launch.json', JSON.stringify(ujt, null, 2));
console.log('Successfully generated week1_launch.json with ' + posts.length + ' posts.');
