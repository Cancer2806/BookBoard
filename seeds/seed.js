// model for seeding the database
const sequelize = require('../config/connection');

const { Categories, Downloads, Favourites, Files, Reviews, Types, Users } = require('../models');

const userData = require('./userData.json');
const typeData = require('./typeData.json');
const categoryData = require('./categoryData.json');
const reviewData = require('./reviewData.json');
const downloadData = require('./downloadData.json');
const fileData = require('./fileData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await Users.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const types = await Types.bulkCreate(typeData, {
    returning: true,
  });

  const categories = await Categories.bulkCreate(categoryData, {
    returning: true,
  });

  for (const file of fileData) {
    await Files.create({
      ...file,
      user_id: users[Math.floor(Math.random() * users.length)].id,
      type_id: types[Math.floor(Math.random() * types.length)].id,
      category_id: categories[Math.floor(Math.random() * categories.length)].id,
    });
  }

  const files = await Files.findAll();

  for (const review of reviewData) {
    await Reviews.create({
      ...review,
      user_id: users[Math.floor(Math.random() * users.length)].id,
      file_id: files[Math.floor(Math.random() * files.length)].id,
    })
  }

  for (let i = 0; i < 10; i++) {
    await Favourites.create({
      rating: [Math.floor(Math.random() * 5)],
      user_id: users[Math.floor(Math.random() * users.length)].id,
      file_id: files[Math.floor(Math.random() * files.length)].id,
    })
  }

  for (const download of downloadData) {
    await Downloads.create({
      ...download,
      user_id: users[Math.floor(Math.random() * users.length)].id,
      file_id: files[Math.floor(Math.random() * files.length)].id,
    })
  }

  process.exit(0);
};

seedDatabase();
