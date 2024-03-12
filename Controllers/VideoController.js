const { Playlist, Video } = require("../models/videoModel.js");

/**
 * Method to create a video and add it to the playlist
 *
 * @param {*} req
 * @param {*} res
 */
const videoPost = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(404).json({ error: "User ID not specified" });
        }
        const video = new Video({
            name: req.body.name,
            url: req.body.url
        });

        const playlist = playlistPatch(video, req.userId);
        if (!playlist) {
            return res.status(422).json({ error: 'There was an error updating the playlist' });
        }

        const savedVideo = await video.save();
        res.header({ 'location': `/api/videos/?id=${savedVideo.id}` });
        res.status(201).json(savedVideo);
    } catch (error) {
        console.error('Error while saving the video:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Method to add the video to the playlist.
 * If the playlist does not exist, create it.
 *
 * @param {*} video The video to be added to the playlist.
 * @param {*} userId The ID of the user to whom the playlist belongs.
 * 
 * @returns {boolean} true if the operation was successful, false if there was an error.
 */
const playlistPatch = async (video, userId) => {
    try {
        let playlist = await Playlist.findOne({ userId: userId });

        if (!playlist) {
            playlist = new Playlist({ userId: userId, videos: [video._id] });
        } else {
            playlist.videos = playlist.videos || [];
            playlist.videos.push(video._id);
        }
        await playlist.save();

        return true;
    } catch (error) {
        console.error('Error while updating playlist:', error);
        return false;
    }
}

/**
 * Get playlist or retrieve a single video by its ID.
 *
 * @param {*} req
 * @param {*} res
 */
const videoGet = async (req, res) => {
    try {
        // if an specific video is required get it by id
        if (req.query._id) {
            const video = await Video.findById(req.query._id);
            if (!video) {
                return res.status(404).json({ error: 'Video not found' });
            }
            res.header({ 'location': `/api/videos/?id=${video._id}` });
            res.status(200).json(video);
        } else if (req.userId) {
            // otherwise get all the videos from a given user
            const playlist = await Playlist.findOne({ userId: req.userId }).populate('videos');
            if (!playlist) {
                return res.status(404).json({ error: 'Playlist not found' });
            }
            res.header({ 'location': `/api/playlists/?id=${playlist._id}` });
            res.status(200).json(playlist.videos);
        } else {
            return res.status(400).json({ error: 'Invalid request: neither Video ID nor User ID provided' });
        }
    } catch (error) {
        console.error('Error while querying videos:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Updates the data of a video by its ID.
 *
 * @param {*} req
 * @param {*} res
 */
const videoPatch = async (req, res) => {
    try {
        if (!req.query || !req.query._id) {
            return res.status(400).json({ error: "Video ID is required" });
        }

        const video = await Video.findById(req.query._id);

        if (!video) {
            return res.status(404).json({ error: "Video doesn't exist" });
        }

        video.name = req.body.name ?? video.name;
        video.url = req.body.url ?? video.url;

        const updatedVideo = await video.save();

        if (!updatedVideo) {
            res.status(422).json({ error: 'There was an error saving the video' });
        }

        res.status(200).json(updatedVideo);
    } catch (error) {
        console.error('Error while updating video:', error);
        res.status(500).json({ error: 'There was an error updating the video' });
    }
}

/**
 * Delete a video by its ID.
 *
 * @param {*} req
 * @param {*} res
 */
const videoDelete = async (req, res) => {
    try {
        if (!req.query || !req.query._id) {
            return res.status(400).json({ error: "Video ID is required" });
        }

        const video = await Video.findById(req.query._id);

        if (!video) {
            return res.status(404).json({ error: "Video does not exist" });
        }

        const playlist = await Playlist.findOneAndUpdate(
            { userId: req.userId },
            { $pull: { videos: req.query._id } },
            { new: true }
        );

        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        await video.deleteOne();
        res.status(204).json({});
    } catch (error) {
        console.error('Error while deleting the video:', error);
        res.status(422).json({ error: 'There was an error deleting the video' });
    }
}

module.exports = {
    videoGet,
    videoPost,
    videoPatch,
    videoDelete
}