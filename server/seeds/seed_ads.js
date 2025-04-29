exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('ads').del();

  // Fetch sub-categories and users from DB dynamically
  const subCategories = await knex('sub_categories').select('id', 'name');
  const users = await knex('users').select('id', 'username');

  console.log("subCategories: ", subCategories);
  console.log("users: ", users);

  // Helper to find sub-category ID by name
  const findSubCategoryId = (name) => {
    const subCategory = subCategories.find((sub) => sub.name === name);
    return subCategory ? subCategory.id : null;
  };

  // Helper to get random user ID
  const getRandomUserId = () => {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    return randomUser ? randomUser.id : null;
  };

  // Dummy ads data (without user_id now)
  const ads = [
    {
      sub_category_name: 'Mobile Phones',
      title: 'iPhone 15 Pro Max - Brand New',
      description: 'Factory sealed iPhone 15 Pro Max with full warranty.',
      location: 'Dubai',
      price: 4500.00,
      status: 'approved',
    },
    {
      sub_category_name: 'Laptops',
      title: 'Gaming Laptop RTX 4070',
      description: 'High-performance laptop perfect for gaming and work.',
      location: 'Abu Dhabi',
      price: 7500.00,
      status: 'approved',
    },
    {
      sub_category_name: 'Cars',
      title: 'Toyota Corolla 2020 for Sale',
      description: 'Excellent condition, low mileage, single owner.',
      location: 'Sharjah',
      price: 58000.00,
      status: 'pending',
    },
    {
      sub_category_name: 'Living Room Furniture',
      title: 'Leather Sofa Set - 3 pieces',
      description: 'Luxury leather sofa set, barely used.',
      location: 'Dubai',
      price: 2500.00,
      status: 'approved',
    },
    {
      sub_category_name: 'Apartments for Sale',
      title: '2BHK Apartment for Sale in JVC',
      description: 'Spacious 2BHK, great view, swimming pool access.',
      location: 'Dubai',
      price: 750000.00,
      status: 'approved',
    },
    {
      sub_category_name: 'Full-time Jobs',
      title: 'Software Engineer Position',
      description: 'Looking for experienced Node.js developers.',
      location: 'Remote',
      price: 0.00,
      status: 'approved',
    }
  ];

  // Insert ads
  for (const ad of ads) {
    const subCategoryId = findSubCategoryId(ad.sub_category_name);
    const userId = getRandomUserId();

    if (subCategoryId && userId) {
      await knex('ads').insert({
        user_id: userId,
        sub_category_id: subCategoryId,
        title: ad.title,
        description: ad.description,
        location: ad.location,
        price: ad.price,
        status: ad.status,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      });
    } else {
      console.warn(`Missing data for ad: ${ad.title}`);
    }
  }
};
