const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;



const ImageSchema = new Schema({
    url: String,
    filename: String
});

// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200'); // adds /upload/w_200 to all image urls
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

// includes virtual properties for popup on the map
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});



CampgroundSchema.post('findOneAndDelete', async function(doc){ //query middleware
    if(doc){
        await Review.deleteMany({
            _id: {
                $in:doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);
