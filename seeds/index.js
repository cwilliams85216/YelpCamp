
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const dbUrl =  process.env.DB_URL;
mongoose.connect(dbUrl,{
    useNewUrlParser: true, 
    useCreateIndex:true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)]


const seedDB = async() =>{
    await Campground.deleteMany({});
    for(let i = 0; i < 300; i++){
        const random1000 = Math.floor(Math.random() *1000);
        const price = Math.floor(Math.random() * 20)+ 10;
        const camp = new Campground({
            //Your User ID
            author: '6126d2fe2e9cc22fa08b2164', 
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti aliquam eius sunt itaque placeat? Atque libero recusandae excepturi eaque. Fuga, natus repellat iusto voluptatum quaerat expedita ex obcaecati quis hic?',
            price,
            geometry: { 
                type: 'Point', 
                coordinates: [ 
                    cities[random1000].longitude,
                    cities[random1000].latitude, ] 
                },
            images:[
                {
                  url: 'https://res.cloudinary.com/ds5yxylcf/image/upload/v1630066996/YelpCamp/tw78s5nt9dto4jwvicng.jpg',
                  filename: 'YelpCamp/tw78s5nt9dto4jwvicng'
                },
                {
                  url: 'https://res.cloudinary.com/ds5yxylcf/image/upload/v1630066996/YelpCamp/itg4b1mjxfsl2xvsjpvy.jpg',
                  filename: 'YelpCamp/itg4b1mjxfsl2xvsjpvy'
                }
              ]
              
        })
        await camp.save();
    }
}

seedDB().then( () =>{
    mongoose.connection.close();
});
