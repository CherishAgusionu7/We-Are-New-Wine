import { GeneralConfig, ChurchEvent, Sermon, Devotional, StaffMember, PastServiceGalleryItem } from "./types";
import heroImage from "./assets/images/new_wine_emblem_logo_1780015559822.png";

export const initialGeneralConfig: GeneralConfig = {
  churchName: "New Wine",
  tagline: "Pouring timeless truth into fresh, seeking hearts",
  heroImage,
  missionStatement: "Our mission is to awaken a generation to Christ by proclaiming the Gospel, reviving the Holy Spirit within believers, and raising passionate young people who live by God’s Word. Through prayer, worship in spirit and truth, and bold service, we seek to impact the world and honor God wholeheartedly.",
  visionStatement: "To see our cities and neighborhoods completely renewed by the grace of Jesus Christ through vibrant modern worship, deep discipleship, and unceasing prayer.",
  statementOfFaith: "We believe in the holy Trinity: Father, Son, and Holy Spirit. We believe in salvation solely by grace through faith in the death and resurrection of Jesus Christ. We believe the Bible is the inspired, infallible voice of God, and that the Holy Spirit actively indwells, empowers, and guides believers to live holy lives today.",
  storyTitle: "Our Revitalizing Journey",
  storyContent: "New Wine began in 2021 as a humble prayer group of seven individuals who gathered weekly in a living room, praying for spiritual revival and deep communal transparency. Guided by Matthew 9:17—'They pour new wine into fresh wineskins, and both are preserved'—the gathering naturally flourished. Today, we represent a diverse family of believers devoted to real spiritual renewal, supporting each other in vulnerability and learning to walk daily in the footprints of Jesus.",
  
  serviceDay: "Every Other Sunday",
  serviceTime: "4:00PM",
  address: "13509 Lyndon B Johnson Fwy, Garland, TX 75041",
  googleMapsEmbedUrl: "https://maps.google.com/maps?q=13509%20Lyndon%20B%20Johnson%20Fwy,%20Garland,%20TX%2075041&t=&z=15&ie=UTF8&iwloc=&output=embed",
  
  whatToExpect: "At New Wine, you will discover a warm, authentic, and joyful atmosphere. A typical worship service lasts about 75 minutes. We sing modern praise songs and timeless hymns with contemporary arrangements, followed by a highly practical, scripture-centered message. Stick around after the service for espresso, pastries, and conversation in our open-air courtyard!",
  parkingInfo: "Free Parking Availabe",
  dressCode: "Come exactly as you are! Most of our congregation wears comfortable casual clothing—jeans, sweaters, and sneakers are the norm. We care about you, not your wardrobe.",
  
  email: "connect@newwinegathering.org",
  phone: "(682) 412-5519",
  instagramUrl: "https://instagram.com",
  
};

export const initialEvents: ChurchEvent[] = [
  {
    id: "evt-1",
    title: "New Wine Friends & Family Picnic",
    date: "2026-06-07",
    time: "12:30 PM",
    location: "Courtyard & East Lawn",
    description: "Join us directly after the AM service for a free catering barbecue, fun games, and friendly lawn game tournaments.",
    category: "general",
    registrationLink: "#register-picnic"
  },
  {
    id: "evt-2",
    title: "Encounter Worship Night",
    date: "2026-06-14",
    time: "7:00 PM",
    location: "Main Sanctuary",
    description: "An extended, immersive evening of acoustic praise, communion, silent contemplation, and prayer ministry. Childcare is provided.",
    category: "worship",
    registrationLink: "#register-encounter"
  },
  {
    id: "evt-3",
    title: "New Wine Youth Summer Launch party",
    date: "2026-06-19",
    time: "6:30 PM",
    location: "The Youth Warehouse",
    description: "Kicking off the summer season! Outdoor laser tag, wood-fired pizza ovens, and a welcoming bonfire session with live acoustic worship.",
    category: "youth",
    registrationLink: "#register-youth"
  },
  {
    id: "evt-4",
    title: "Men's Saturday Morning Breakfast",
    date: "2026-06-20",
    time: "8:00 AM",
    location: "The Vine Hall",
    description: "Gather with men of all ages for a hearty breakfast, strong coffee, and a powerful guest speaker sharing on biblical manhood in a modern culture.",
    category: "men",
    registrationLink: "#register-men"
  },
  {
    id: "evt-5",
    title: "Women's Coffee & Devotional Circle",
    date: "2026-06-27",
    time: "9:30 AM",
    location: "The Courtyard Espresso Bar",
    description: "A relaxed, elegant morning connecting with sisters. We will read through Psalm 23 and share encouragement over artisanal beverages.",
    category: "women",
    registrationLink: "#register-women"
  },
  {
    id: "evt-6",
    title: "Local Food Pantry Outreach Drive",
    date: "2026-07-04",
    time: "9:00 AM",
    location: "Downtown Community Shelter",
    description: "Sorting and distributing organic groceries to local vulnerable families in cooperation with our neighborhood partners.",
    category: "outreach",
    registrationLink: "#register-outreach"
  }
];

export const initialSermons: Sermon[] = [
  {
    id: "serm-1",
    title: "Drawn Into the Vine",
    speaker: "Lead Pastor David Miller",
    date: "2026-05-24",
    scripture: "John 15:1-8",
    series: "Abiding in Grace",
    summary: "Discovering what it means to live in union with Christ. Pastor David discusses shifting our mindset from self-striving to spiritual abiding, showing how real fruitfulness is born out of daily spiritual rest and dependence.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Standard mockup
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: "serm-2",
    title: "Living in the New Vintage",
    speaker: "Assistant Pastor Sarah Jenkins",
    date: "2026-05-17",
    scripture: "Luke 5:36-39",
    series: "Wineskins of Renewal",
    summary: "Examining why new spirit-filled work requires flexible hearts. Pastor Sarah shares how God breaks down old religious checklists to replace them with liquid joy, authentic mercy, and dynamic fellowship.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "serm-3",
    title: "The Courage of Open Gates",
    speaker: "Pastor David Miller",
    date: "2026-05-10",
    scripture: "Galatians 5:1-6",
    series: "Abiding in Grace",
    summary: "A challenging examination of biblical hospitality. What happens when our religious preferences clash with apostolic compassion? Learning to expand our tables so that seekers feel instantly welcomed.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export const initialDevotionals: Devotional[] = [
  {
    id: "dev-1",
    title: "The Rhythm of Holy Rest",
    author: "Pastor David Miller",
    date: "2026-05-27",
    category: "Devotional",
    content: "In our hyper-connected, high-efficiency world, exhaustion is often worn as a badge of honor. But in Genesis, God completes His work and purposefully establishes Sabbath. Sabbath isn't the reward for a job well done; it is the spiritual launching pad for the week ahead.\n\nAbiding in Christ requires active surrender. When we continually hustle under our own strength, we leave no space for the sweet, quiet whispers of the Spirit. This week, I challenge you to schedule block 30 minutes of undisturbed silence. Leave your phone in another room, take a deep breath, and let God restore your dry soul.",
    imageSeed: "rest"
  },
  {
    id: "dev-2",
    title: "Summer Outdoor Gatherings Update!",
    author: "Elder Board Committee",
    date: "2026-05-20",
    category: "Community Update",
    content: "Blessed morning, church family! Starting next month, our Sunday 6:00 PM evening service will transition to our beautiful central courtyard. We will have overhead cafe lights, cozy seating, hot team, and visual worship under the open sky.\n\nThis is a fantastic opportunity to invite a neighbor who might feel intimidated by a traditional sanctuary building layout. Let's practice radical home-cooked hospitality and open and empty seating tables!",
    imageSeed: "courtyard"
  },
  {
    id: "dev-3",
    title: "Washing the Feet of Our City",
    author: "Deaconess Marcus Fletcher",
    date: "2026-05-13",
    category: "Pastoral Note",
    content: "True strength in the Kingdom of God is always measured downwards. Jesus, holding absolute cosmic authority, tied a towel around His waist and washed dirt from the calloused feet of His disciples.\n\nOur upcoming Neighborhood Food Drive isn't just about filling boxes with dry goods; it's about looking into the eyes of our neighbors, speaking their names, and demonstrating that they are seen and deeply treasured. Let's show up with happy hearts and gentle hands.",
    imageSeed: "serve"
  }
];

export const initialStaff: StaffMember[] = [
  {
    id: "staff-1",
    name: "Pastor David Miller",
    role: "Lead Pastor & Founder",
    category: "pastor",
    bio: "Pastor David has a burning passion for raising deep disciples and cultivating authentic tables of worship. He has served in active ministry for 15 years and has a master's degree in theology. Outside of church, you can find him walking coastal trails or roasting coffee beans on his porch.",
    email: "david@newwinegathering.org",
    phone: "(555) 492-9464",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=facearea&facepad=3&w=256&h=256&q=80"
  },
  {
    id: "staff-2",
    name: "Pastor Sarah Jenkins",
    role: "Associate Pastor of Families & Youth",
    category: "pastor",
    bio: "Sarah is passionate about ensuring our youth generation experiences the living presence of Jesus in practical, highly creative packages. She holds credentials in family discipleship and youth counseling, loves mountain hiking, and makes a legendary sourdough bread.",
    email: "sarah@newwinegathering.org",
    phone: "(555) 492-9465",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=facearea&facepad=3&w=256&h=256&q=80"
  },
  {
    id: "staff-3",
    name: "Marcus Fletcher",
    role: "Worship Coordinator",
    category: "leadership",
    bio: "Marcus shapes our worship environment by encouraging creativity and focusing our hearts on God's holiness. He is an accomplished multi-instrumentalist, an avid reader of puritan literature, and a dad of three amazing boys.",
    email: "marcus@newwinegathering.org",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=facearea&facepad=3&w=256&h=256&q=80"
  },
  {
    id: "staff-4",
    name: "Elizabeth Vance",
    role: "Outreach & Admissions Lead",
    category: "staff",
    bio: "Elizabeth coordinates our local mercy network, making sure we show up for families in financial stress and organize impactful mission trips. She is a total foodie and loves organizing neighborhood block festivals.",
    email: "elizabeth@newwinegathering.org",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?fit=facearea&facepad=3&w=256&h=256&q=80"
  },
  {
    id: "staff-5",
    name: "Rachel Cho",
    role: "Finance Committee Director",
    category: "committee",
    bio: "Rachel keeps our finances entirely transparent, making sure every dollar donated to New Wine goes directly towards community restoration and building strong, safe, and welcoming infrastructures.",
    email: "rachel@newwinegathering.org",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fit=facearea&facepad=3&w=256&h=256&q=80"
  }
];

export const initialGallery: PastServiceGalleryItem[] = [
  {
    id: "gal-1",
    title: "Easter Sunday Worship Gathering",
    date: "2026-04-05",
    description: "An incredible morning celebrating our risen Savior under absolute joy! There was a record attendance of families, full baptisms, and a string quartet joining our modern praise band.",
    imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "gal-2",
    title: "Outreach Winter Shelter Support",
    date: "2026-02-14",
    description: "Our dedicated outreach team setting up heaters, serving chili bowls, and sharing warmth and blankets during the freezing winter storm event.",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "gal-3",
    title: "Youth Outdoor Prayer Bonfire",
    date: "2026-04-24",
    description: "Our high schoolers sharing personal testimonies around the fire, pledging to represent peer-level mercy, clean living, and spiritual encouragement in their school halls.",
    imageUrl: "https://images.unsplash.com/photo-1526725702345-bdda2b97dd73?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "gal-4",
    title: "Worship Team Advanced Rehearsal Retreat",
    date: "2026-03-12",
    description: "Marcus leading our musicians in an intensive workshop, praying together and arranging the new spiritual setlists for our abiding seasons.",
    imageUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80"
  }
];
