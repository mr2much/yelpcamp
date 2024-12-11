const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { places, descriptors } = require('./seedHelpers');
const cities = require('./cities');

const url = 'mongodb://127.0.0.1:27017/yelp-camp';

mongoose.connect(url);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log(`Database connected on ${url}`);
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);

    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: `https://picsum.photos/400/200?random=${Math.random()}`,
      description:
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat neque iure suscipit fuga minus ut quisquam facere totam cumque officia ex nostrum doloribus recusandae enim vitae placeat, quas quod. Odit!',
      price: Math.floor(Math.random() * 20) + 10,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  db.close();
});
