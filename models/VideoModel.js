const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Scheme for videos
 */
const video = new Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
});

/**
 * Scheme for playlists
 */
const playlist = new Schema({
    userId: { type: String, required: true },
    name: { type: String, default: "general" },
    videos: [{ type: Schema.Types.ObjectId, ref: 'Video' }]
});

/**
 * Model for videos
 */
const Video = mongoose.model('Video', video);
/**
 * Model for playlists
 */
const Playlist = mongoose.model('Playlist', playlist);

module.exports = { Playlist, Video };