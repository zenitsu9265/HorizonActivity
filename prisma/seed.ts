import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { slugify } from "../src/lib/utils";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

const img = (seed: string, w = 800, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@horizonactivity.in";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin@1234";

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Site Admin",
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: "ADMIN",
    },
  });

  const demo = await prisma.user.upsert({
    where: { email: "demo@horizonactivity.in" },
    update: {},
    create: {
      name: "Ananya Sharma",
      email: "demo@horizonactivity.in",
      phone: "9876543210",
      passwordHash: await bcrypt.hash("Demo@1234", 12),
      walletBalance: 185000,
    },
  });

  const placesData = [
    {
      name: "Rishikesh",
      city: "Rishikesh",
      state: "Uttarakhand",
      description:
        "The yoga capital of the world and India's adventure hub — white water rafting, bungee jumping and river rafting against the backdrop of the Himalayas.",
      imageUrl: img("rishikesh", 800, 600),
      featured: true,
    },
    {
      name: "Jaipur",
      city: "Jaipur",
      state: "Rajasthan",
      description:
        "The Pink City blends royal heritage with hands-on craft workshops — block printing, pottery, miniature painting and heritage walks.",
      imageUrl: img("jaipur", 800, 600),
      featured: true,
    },
    {
      name: "Goa",
      city: "Panaji",
      state: "Goa",
      description:
        "Sun, sand and sea — parasailing, jet skiing, scuba diving and beachside cooking classes on India's favourite coast.",
      imageUrl: img("goa", 800, 600),
      featured: true,
    },
    {
      name: "Manali",
      city: "Manali",
      state: "Himachal Pradesh",
      description:
        "A Himalayan playground — river rafting, paragliding, trekking and camping in snow-capped mountain valleys.",
      imageUrl: img("manali", 800, 600),
      featured: true,
    },
    {
      name: "Coorg",
      city: "Madikeri",
      state: "Karnataka",
      description:
        "Scotland of India — coffee plantation walks, kayaking, camping and spice plantation trails in misty hills.",
      imageUrl: img("coorg", 800, 600),
      featured: false,
    },
    {
      name: "Pondicherry",
      city: "Pondicherry",
      state: "Tamil Nadu",
      description:
        "French colonial charm meets the Bay of Bengal — kayaking, stand-up paddleboarding and art workshops.",
      imageUrl: img("pondicherry", 800, 600),
      featured: false,
    },
    {
      name: "Alleppey",
      city: "Alleppey",
      state: "Kerala",
      description:
        "The Venice of the East — glide through emerald backwaters on a houseboat, witness coir-making villages and savour fresh Kerala seafood.",
      imageUrl: img("alleppey", 800, 600),
      featured: true,
    },
    {
      name: "Leh Ladakh",
      city: "Leh",
      state: "Ladakh",
      description:
        "The Land of High Passes — motorbike rides across Khardung La, pangong lake camping and monastery treks in stark moonscape mountains.",
      imageUrl: img("ladakh", 800, 600),
      featured: true,
    },
    {
      name: "Varanasi",
      city: "Varanasi",
      state: "Uttar Pradesh",
      description:
        "The spiritual heart of India — witness the Ganga aarti, explore ancient ghads, take a silk-weaving tour and sail at dawn.",
      imageUrl: img("varanasi", 800, 600),
      featured: false,
    },
    {
      name: "Darjeeling",
      city: "Darjeeling",
      state: "West Bengal",
      description:
        "The Queen of the Hills — toy train rides, tea plantation walks and sunrise views over Kanchenjunga from Tiger Hill.",
      imageUrl: img("darjeeling", 800, 600),
      featured: false,
    },
    {
      name: "Hampi",
      city: "Hampi",
      state: "Karnataka",
      description:
        "UNESCO-listed ruins of the Vijayanagara Empire — bouldering, coracle rides on the Tungabhadra and sunset over stone temples.",
      imageUrl: img("hampi", 800, 600),
      featured: false,
    },
  ];

  const activitiesData = [
    // Rishikesh
    { place: "Rishikesh", name: "Bungee Jumping", category: "Adventure", price: 350000, duration: "3 hours", minAge: 14, featured: true, description: "India's highest bungee jump at 83 metres over the River Ganga. Tandem jumps and certified instructors make this a safe adrenaline rush you'll never forget." },
    { place: "Rishikesh", name: "River Rafting", category: "Adventure", price: 150000, duration: "6 hours", minAge: 14, featured: true, description: "Raft the Ganga through 16 kilometres of rapids graded from level 2 to 4, with cliff jumps and beach halts along the way." },
    { place: "Rishikesh", name: "Giant Swing", category: "Adventure", price: 100000, duration: "1 hour", minAge: 12, featured: false, description: "Swung from a height of 85 metres over the Ganga valley — a thrilling yet smooth pendulum ride for first-timers." },
    { place: "Rishikesh", name: "Yoga & Meditation Retreat", category: "Wellness", price: 80000, duration: "2 hours", minAge: 10, featured: false, description: "A sunrise yoga session with certified instructors overlooking the Ganga, followed by guided meditation on the riverbank." },
    { place: "Rishikesh", name: "Cliff Jumping", category: "Adventure", price: 80000, duration: "2 hours", minAge: 16, featured: false, description: "Jump off rocky cliffs into the cold Ganga from heights up to 15 metres. Guided by certified adventure professionals." },
    { place: "Rishikesh", name: "Flying Fox Zipline", category: "Adventure", price: 180000, duration: "1 hour", minAge: 10, featured: false, description: "Soar 700 metres across the Ganga valley on a zipline at speeds up to 140 km/h. A bird's-eye view of the Himalayas." },
    { place: "Rishikesh", name: "Camping by the Ganga", category: "Trekking", price: 150000, duration: "1 night", minAge: 5, featured: false, description: "Riverside camping in luxury tents with a bonfire, acoustic music night and stargazing." },
    { place: "Rishikesh", name: "White Water Kayaking", category: "Water sports", price: 120000, duration: "3 hours", minAge: 14, featured: false, description: "Paddle solo or in a two-person kayak through Class 3 rapids on the Ganga." },

    // Jaipur
    { place: "Jaipur", name: "Pottery & Clay Workshop", category: "Crafting", price: 60000, duration: "2 hours", minAge: 8, featured: true, description: "Learn the art of wheel pottery and hand-building from Blue Pottery artisans. Take home your own handmade creation." },
    { place: "Jaipur", name: "Block Printing Workshop", category: "Crafting", price: 50000, duration: "2 hours", minAge: 8, featured: false, description: "Hand-print a scarf or tote with traditional Rajasthani woodblock designs in the famous Bagru style." },
    { place: "Jaipur", name: "Miniature Painting Class", category: "Crafting", price: 70000, duration: "3 hours", minAge: 10, featured: false, description: "Paint a miniature in the classic Jaipur style with natural pigments, guided by a master artist." },
    { place: "Jaipur", name: "Amber Fort Elephant Ride", category: "Adventure", price: 110000, duration: "2 hours", minAge: 5, featured: false, description: "Ride an elephant up to the magnificent Amber Fort, then explore the palace with a guided heritage walk." },
    { place: "Jaipur", name: "Hot Air Balloon Ride", category: "Adventure", price: 120000, duration: "1 hour", minAge: 6, featured: false, description: "Float over the pink city at dawn with views of Nahargarh Fort, Jal Mahal and the Aravalli hills." },
    { place: "Jaipur", name: "Leather Jutti Making", category: "Crafting", price: 45000, duration: "2 hours", minAge: 8, featured: false, description: "Design and stitch your own pair of traditional Rajasthani leather juttis with embossing and mirror work." },

    // Goa
    { place: "Goa", name: "Parasailing", category: "Adventure", price: 120000, duration: "30 mins", minAge: 10, featured: true, description: "Soar 200 metres above Calangute beach towed by a speedboat. The safest way to fly in Goa." },
    { place: "Goa", name: "Scuba Diving", category: "Water sports", price: 250000, duration: "4 hours", minAge: 12, featured: false, description: "Discover coral reefs and tropical fish off Grande Island with a PADI-certified instructor. All gear included." },
    { place: "Goa", name: "Jet Skiing", category: "Water sports", price: 80000, duration: "30 mins", minAge: 14, featured: false, description: "Hurtling across the Arabian Sea at full throttle. Single or double rides available on Baga beach." },
    { place: "Goa", name: "Snorkeling Adventure", category: "Water sports", price: 90000, duration: "2 hours", minAge: 8, featured: false, description: "Explore underwater coral gardens and tropical fish at Grande Island with all gear provided." },
    { place: "Goa", name: "Dolphin Spotting Cruise", category: "Water sports", price: 70000, duration: "2 hours", minAge: 5, featured: false, description: "Sail along the Mandovi river to spot playful Indo-Pacific humpback dolphins at sunset." },
    { place: "Goa", name: "Sunset Kayaking", category: "Water sports", price: 60000, duration: "1.5 hours", minAge: 10, featured: false, description: "Paddle through mangrove creeks and along the coast as the sun dips below the Arabian Sea." },

    // Manali
    { place: "Manali", name: "Paragliding", category: "Adventure", price: 220000, duration: "2 hours", minAge: 12, featured: true, description: "Tandem paraglide off Solang Valley with views of snow peaks and pine forests. Includes professional photos." },
    { place: "Manali", name: "River Rafting", category: "Adventure", price: 90000, duration: "5 hours", minAge: 14, featured: false, description: "Navigate the Beas river rapids between Vashisht and Pirdi with experienced river guides." },
    { place: "Manali", name: "Camping & Bonfire Night", category: "Trekking", price: 120000, duration: "1 night", minAge: 5, featured: false, description: "Camp under the stars in the Solang valley with a bonfire, barbecue dinner and mountain breakfast." },
    { place: "Manali", name: "Skiing at Solang", category: "Adventure", price: 200000, duration: "4 hours", minAge: 8, featured: false, description: "Hit the slopes at Solang Valley ski resort with beginner-friendly lessons and all gear provided." },
    { place: "Manali", name: "Solang Valley Zorbing", category: "Adventure", price: 50000, duration: "30 mins", minAge: 6, featured: false, description: "Roll downhill in a giant inflatable sphere — a hilarious and safe thrill ride for all ages." },
    { place: "Manali", name: "Rohtang Pass Excursion", category: "Trekking", price: 180000, duration: "Full day", minAge: 8, featured: false, description: "A scenic day trip to the snow-covered Rohtang Pass with photo stops and a snow-play session." },

    // Coorg
    { place: "Coorg", name: "Coffee Plantation Walk", category: "Crafting", price: 40000, duration: "2 hours", minAge: 5, featured: false, description: "Wander through aromatic coffee and pepper plantations with a local farmer, ending with a fresh brew tasting." },
    { place: "Coorg", name: "Kayaking", category: "Water sports", price: 70000, duration: "3 hours", minAge: 10, featured: false, description: "Paddle across calm rivers and hidden backwaters of Coorg surrounded by rolling green hills." },
    { place: "Coorg", name: "Camping & Trek", category: "Trekking", price: 150000, duration: "1 night", minAge: 12, featured: false, description: "Trek to a hidden viewpoint and set up camp under the stars with a riverside barbecue." },
    { place: "Coorg", name: "White Water Rafting", category: "Adventure", price: 130000, duration: "4 hours", minAge: 14, featured: false, description: "Raft the Barapole River through monsoon-swollen rapids surrounded by lush Coorg rainforest." },
    { place: "Coorg", name: "Spice Plantation Tour", category: "Crafting", price: 35000, duration: "1.5 hours", minAge: 5, featured: false, description: "Learn about cardamom, vanilla, pepper and cinnamon on a guided walk through a working spice estate." },
    { place: "Coorg", name: "Brahmagiri Peak Trek", category: "Trekking", price: 180000, duration: "Full day", minAge: 10, featured: false, description: "Trek through shola forests and grasslands to the Brahmagiri summit with panoramic views of Kerala." },

    // Pondicherry
    { place: "Pondicherry", name: "Sea Kayaking", category: "Water sports", price: 60000, duration: "2 hours", minAge: 10, featured: false, description: "Paddle along the French Quarter coastline at sunrise and watch the fishermen begin their day." },
    { place: "Pondicherry", name: "Candle Making Workshop", category: "Crafting", price: 50000, duration: "1 hour", minAge: 6, featured: false, description: "Pour, colour and scent your own soy candles at a charming Auroville studio. Take three candles home." },
    { place: "Pondicherry", name: "Stand-Up Paddleboarding", category: "Water sports", price: 50000, duration: "1 hour", minAge: 8, featured: false, description: "Balance your way along the calm backwaters on a paddleboard — a meditative workout with ocean views." },
    { place: "Pondicherry", name: "French Quarter Heritage Walk", category: "Wellness", price: 30000, duration: "2 hours", minAge: 5, featured: false, description: "Wander past mustard-yellow colonial villas, cathedrals and cafés on a guided walk through the White Town." },
    { place: "Pondicherry", name: "Pottery Workshop", category: "Crafting", price: 45000, duration: "2 hours", minAge: 8, featured: false, description: "Shape and glaze your own terracotta bowl at a beachside pottery studio in Auroville." },

    // Alleppey
    { place: "Alleppey", name: "Houseboat Cruise", category: "Wellness", price: 350000, duration: "1 night", minAge: 2, featured: true, description: "Float through the emerald backwaters on a traditional kettuvallam houseboat with freshly cooked Kerala meals." },
    { place: "Alleppey", name: "Backwater Canoeing", category: "Water sports", price: 80000, duration: "3 hours", minAge: 8, featured: false, description: "Paddle through narrow canals flanked by coconut palms and village life on a traditional dugout canoe." },
    { place: "Alleppey", name: "Coir Making Workshop", category: "Crafting", price: 30000, duration: "1.5 hours", minAge: 6, featured: false, description: "Learn the art of spinning coconut fibre into rope and mats with local village women." },
    { place: "Alleppey", name: "Kerala Cooking Class", category: "Crafting", price: 60000, duration: "3 hours", minAge: 8, featured: false, description: "Cook a traditional Kerala sadya with banana leaf plating, fresh fish curry and payasam." },
    { place: "Alleppey", name: "Kayaking Through Villages", category: "Water sports", price: 70000, duration: "2.5 hours", minAge: 10, featured: false, description: "Navigate the village waterways at dawn, passing rice paddies, temples and children waving from the banks." },

    // Leh Ladakh
    { place: "Leh Ladakh", name: "Khardung La Motorbike Ride", category: "Adventure", price: 500000, duration: "Full day", minAge: 18, featured: true, description: "Ride a Royal Enfield to the world's highest motorable pass at 5,359 metres through stark moonscape terrain." },
    { place: "Leh Ladakh", name: "Pangong Lake Camping", category: "Trekking", price: 250000, duration: "2 nights", minAge: 8, featured: true, description: "Camp beside the ever-changing blue waters of Pangong Lake with stargazing and a lakeside barbecue." },
    { place: "Leh Ladakh", name: "Nubra Valley Excursion", category: "Adventure", price: 180000, duration: "Full day", minAge: 10, featured: false, description: "Drive through Khardung La to the double-humped camel valley of Nubra with a monastery stop." },
    { place: "Leh Ladakh", name: "Monastery Trek", category: "Trekking", price: 120000, duration: "Full day", minAge: 10, featured: false, description: "Trek to the hilltop Hemis and Thiksey monasteries with a local guide and packed lunch." },
    { place: "Leh Ladakh", name: "White Water Rafting on Zanskar", category: "Water sports", price: 150000, duration: "4 hours", minAge: 14, featured: false, description: "Raft the freezing Zanskar River through dramatic gorges with canyon walls towering above." },
    { place: "Leh Ladakh", name: "Camel Safari in Nubra", category: "Adventure", price: 80000, duration: "2 hours", minAge: 5, featured: false, description: "Ride a Bactrian camel across the sand dunes of Hunder with views of the Karakoram range." },

    // Varanasi
    { place: "Varanasi", name: "Ganga Aarti Ceremony", category: "Wellness", price: 20000, duration: "1 hour", minAge: 5, featured: true, description: "Witness the spectacular evening fire ritual at Dashashwamedh Ghat with a reserved seat by the river." },
    { place: "Varanasi", name: "Sunrise Boat Ride", category: "Wellness", price: 40000, duration: "1.5 hours", minAge: 5, featured: false, description: "Glide past the ghads at dawn as priests perform morning rituals and pilgrims bathe in the Ganga." },
    { place: "Varanasi", name: "Silk Saree Weaving Tour", category: "Crafting", price: 50000, duration: "2 hours", minAge: 8, featured: false, description: "Visit a family-run weaving centre and watch a Banarasi silk saree come to life on a handloom." },
    { place: "Varanasi", name: "Old City Walking Tour", category: "Wellness", price: 30000, duration: "3 hours", minAge: 8, featured: false, description: "Navigate the narrow lanes of the old city with a local guide — temples, street food and hidden music schools." },
    { place: "Varanasi", name: "Pottery in Kumhrar", category: "Crafting", price: 35000, duration: "2 hours", minAge: 6, featured: false, description: "Try your hand at the ancient terracotta pottery style of Kumhrar village, just outside Varanasi." },

    // Darjeeling
    { place: "Darjeeling", name: "Toy Train Ride", category: "Wellness", price: 60000, duration: "2 hours", minAge: 5, featured: true, description: "Ride the UNESCO-listed Darjeeling Himalayan Railway through tea gardens and misty mountain loops." },
    { place: "Darjeeling", name: "Tea Plantation Walk", category: "Crafting", price: 40000, duration: "2 hours", minAge: 5, featured: false, description: "Wander through lush tea gardens with a planter, learn to pluck leaves and taste fresh Darjeeling first flush." },
    { place: "Darjeeling", name: "Tiger Hill Sunrise", category: "Trekking", price: 80000, duration: "Half day", minAge: 5, featured: false, description: "Drive to Tiger Hill before dawn and watch the sun illuminate Kanchenjunga's snowy peak in golden light." },
    { place: "Darjeeling", name: "River Rafting on Teesta", category: "Adventure", price: 100000, duration: "3 hours", minAge: 12, featured: false, description: "Raft the Teesta River through gentle rapids surrounded by thick Himalayan forest." },
    { place: "Darjeeling", name: "Paragliding Over Tea Gardens", category: "Adventure", price: 200000, duration: "1.5 hours", minAge: 12, featured: false, description: "Tandem paraglide over emerald tea estates with the Kanchenjunga massif as your backdrop." },

    // Hampi
    { place: "Hampi", name: "Coracle Ride", category: "Water sports", price: 30000, duration: "45 mins", minAge: 5, featured: true, description: "Spin across the Tungabhadra River in a traditional round woven boat with ancient ruins on every bank." },
    { place: "Hampi", name: "Bouldering Session", category: "Adventure", price: 60000, duration: "3 hours", minAge: 12, featured: false, description: "Climb and boulder on Hampi's iconic granite boulders with a certified climbing instructor." },
    { place: "Hampi", name: "Heritage Cycling Tour", category: "Wellness", price: 40000, duration: "3 hours", minAge: 8, featured: false, description: "Cycle past Virupaksha Temple, the Stone Chariot and the Elephant Stables on a guided ruin-hopping tour." },
    { place: "Hampi", name: "Sunset at Matanga Hill", category: "Trekking", price: 20000, duration: "2 hours", minAge: 8, featured: false, description: "Climb Matanga Hill at golden hour for a 360-degree panorama of Hampi's boulder-strewn landscape." },
    { place: "Hampi", name: "Local Art Workshop", category: "Crafting", price: 45000, duration: "2.5 hours", minAge: 8, featured: false, description: "Paint Hampi's temple motifs on canvas with a local artist, using natural pigments and gold leaf." },
  ];

  const placeIds = new Map<string, string>();
  for (const place of placesData) {
    const slug = place.name.toLowerCase();
    const created = await prisma.place.upsert({
      where: { slug },
      update: { name: place.name, city: place.city, state: place.state, description: place.description, imageUrl: place.imageUrl, featured: place.featured },
      create: { ...place, slug },
    });
    placeIds.set(place.name, created.id);
  }

  for (const activity of activitiesData) {
    const slug = slugify(activity.name);
    const placeId = placeIds.get(activity.place);
    if (!placeId) continue;
    await prisma.activity.upsert({
      where: { slug },
      update: {
        name: activity.name,
        category: activity.category,
        price: activity.price,
        duration: activity.duration,
        minAge: activity.minAge,
        featured: activity.featured,
        description: activity.description,
        imageUrl: img(slug, 800, 600),
        placeId,
      },
      create: {
        slug,
        name: activity.name,
        category: activity.category,
        price: activity.price,
        duration: activity.duration,
        minAge: activity.minAge,
        featured: activity.featured,
        description: activity.description,
        imageUrl: img(slug, 800, 600),
        placeId,
      },
    });
  }

  const plans = [
    {
      name: "Explorer Card",
      value: 100000,
      price: 90000,
      perks: [
        "₹1,000 of booking credit",
        "Works on every activity",
        "Never expires",
        "Instant activation",
      ],
    },
    {
      name: "Adventurer Card",
      value: 200000,
      price: 180000,
      perks: [
        "₹2,000 of booking credit",
        "Save ₹200 — that's 10% off",
        "Works on every activity",
        "Never expires",
        "Priority support",
      ],
    },
    {
      name: "Explorer Plus Card",
      value: 500000,
      price: 450000,
      perks: [
        "₹5,000 of booking credit",
        "Best value — save ₹500",
        "Works on every activity",
        "Never expires",
        "Priority support & free photos",
      ],
    },
  ];

  for (const plan of plans) {
    const existing = await prisma.cardPlan.findFirst({
      where: { value: plan.value, price: plan.price },
    });
    if (!existing) {
      await prisma.cardPlan.create({ data: { ...plan, perks: JSON.stringify(plan.perks) } });
    }
  }

  const [adventurerCard] = await prisma.cardPlan.findMany({
    where: { value: 200000 },
    take: 1,
  });
  if (adventurerCard) {
    const existingOrder = await prisma.cardOrder.findFirst({
      where: { userId: demo.id, cardPlanId: adventurerCard.id },
    });
    if (!existingOrder) {
      await prisma.$transaction(async (tx) => {
        const order = await tx.cardOrder.create({
          data: {
            orderNumber: "HA-SEED-CARD1",
            userId: demo.id,
            cardPlanId: adventurerCard.id,
            cardValue: adventurerCard.value,
            amount: adventurerCard.price,
            razorpayOrderId: "order_seed_001",
            razorpayPaymentId: "pay_seed_001",
            status: "PAID",
          },
        });
        await tx.transaction.create({
          data: {
            userId: demo.id,
            type: "CREDIT",
            amount: adventurerCard.value,
            description: `Booking card credited - ${adventurerCard.name}`,
            cardOrderId: order.id,
          },
        });
      });
    }
  }

  const rafting = await prisma.activity.findFirst({
    where: { name: "River Rafting", place: { name: "Rishikesh" } },
  });
  const pottery = await prisma.activity.findFirst({
    where: { name: "Pottery & Clay Workshop", place: { name: "Jaipur" } },
  });

  if (rafting && !(await prisma.booking.findFirst({ where: { userId: demo.id, activityId: rafting.id } }))) {
    await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          userId: demo.id,
          activityId: rafting.id,
          date: new Date(Date.now() + 14 * 86400000),
          amount: rafting.price,
          status: "CONFIRMED",
        },
      });
      await tx.transaction.create({
        data: {
          userId: demo.id,
          type: "DEBIT",
          amount: rafting.price,
          description: `Booking - ${rafting.name}`,
          bookingId: booking.id,
        },
      });
    });
  }

  if (pottery && !(await prisma.booking.findFirst({ where: { userId: demo.id, activityId: pottery.id } }))) {
    await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          userId: demo.id,
          activityId: pottery.id,
          date: new Date(Date.now() + 21 * 86400000),
          amount: pottery.price,
          status: "CONFIRMED",
        },
      });
      await tx.transaction.create({
        data: {
          userId: demo.id,
          type: "DEBIT",
          amount: pottery.price,
          description: `Booking - ${pottery.name}`,
          bookingId: booking.id,
        },
      });
    });
  }

  console.log("Seed complete.");
  console.log(`Admin  -> ${admin.email} / ${adminPassword}`);
  console.log(`Demo   -> demo@horizonactivity.in / Demo@1234`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
