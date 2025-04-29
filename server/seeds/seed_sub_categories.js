exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('sub_categories').del();

  // Fetch existing categories
  const categories = await knex('categories').select('id', 'name');

  // Helper function to find category ID by name
  const findCategoryId = (name) => {
    const category = categories.find((cat) => cat.name === name);
    return category ? category.id : null;
  };

  // Sub-categories with their category names
  const subCategories = [
    // Electronics
    { name: 'Mobile Phones', category_name: 'Electronics' },
    { name: 'Laptops', category_name: 'Electronics' },
    { name: 'Cameras', category_name: 'Electronics' },

    // Vehicles
    { name: 'Cars', category_name: 'Vehicles' },
    { name: 'Motorcycles', category_name: 'Vehicles' },
    { name: 'Trucks', category_name: 'Vehicles' },

    // Furniture
    { name: 'Living Room Furniture', category_name: 'Furniture' },
    { name: 'Bedroom Furniture', category_name: 'Furniture' },

    // Real Estate
    { name: 'Apartments for Sale', category_name: 'Real Estate' },
    { name: 'Apartments for Rent', category_name: 'Real Estate' },

    // Jobs
    { name: 'Full-time Jobs', category_name: 'Jobs' },
    { name: 'Part-time Jobs', category_name: 'Jobs' }
  ];

  // Insert sub-categories dynamically
  for (const subCategory of subCategories) {
    const categoryId = findCategoryId(subCategory.category_name);

    if (categoryId) {
      await knex('sub_categories').insert({
        name: subCategory.name,
        category_id: categoryId,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      });
    } else {
      console.warn(`Category not found for: ${subCategory.category_name}`);
    }
  }
};
