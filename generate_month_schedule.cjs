const fs = require('fs');

const startDate = new Date('2026-03-23T00:00:00Z'); // Starts this upcoming Monday
const posts = [];

// Base Schedule Array mapping
const schedule = {
  twitter: ['09:00:00Z', '13:00:00Z', '17:00:00Z'], // 3x Daily
  instagram: ['11:00:00Z'], // 1x Daily
  tiktok: ['15:00:00Z'], // 1x Daily
  youtube: { days: [1, 4], times: ['18:00:00Z'] } // Mon & Thu
};

for (let day = 0; day < 30; day++) {
  const currentDate = new Date(startDate);
  currentDate.setUTCDate(startDate.getUTCDate() + day);
  const dateStr = currentDate.toISOString().split('T')[0];
  const dayOfWeek = currentDate.getUTCDay();

  // Twitter TBDs
  schedule.twitter.forEach(time => {
    posts.push({
      type: "POST", 
      data: { title: `[Time Block] Twitter Post`, content: `Remember: The scheduled time is the locked-in time to do this particular task. Content TBD.`, type: "text" },
      metadata: { platforms: ["twitter"], scheduled_at: `${dateStr}T${time}` }
    });
  });

  // IG TBDs
  schedule.instagram.forEach(time => {
    posts.push({
      type: "POST", 
      data: { title: `[Time Block] IG Post`, content: `Locked-in time for Instagram post/reel execution.`, type: "image" },
      metadata: { platforms: ["instagram"], scheduled_at: `${dateStr}T${time}` }
    });
  });

  // TikTok TBDs
  schedule.tiktok.forEach(time => {
    posts.push({
      type: "POST", 
      data: { title: `[Time Block] TikTok Video`, content: `Execute daily TikTok video recording/publishing.`, type: "video" },
      metadata: { platforms: ["tiktok"], scheduled_at: `${dateStr}T${time}` }
    });
  });

  // YouTube TBDs
  if (schedule.youtube.days.includes(dayOfWeek)) {
    schedule.youtube.times.forEach(time => {
      posts.push({
        type: "POST", 
        data: { title: `[Time Block] YouTube Longform`, content: `Drafting/Publishing slot for main channel video.`, type: "video" },
        metadata: { platforms: ["youtube"], scheduled_at: `${dateStr}T${time}` }
      });
    });
  }
}

const ujt = { version: "1.0", items: posts };
fs.writeFileSync('d:/Active Projects/content-stream/month_schedule_template.json', JSON.stringify(ujt, null, 2));
console.log('Successfully generated month_schedule_template.json with ' + posts.length + ' locked-in tasks.');
