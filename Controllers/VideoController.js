const { Playlist, Video } = require("../Models/VideoModel");

/**
 * Method to create a video and add it to the playlist
 *
 * @param {*} req
 * @param {*} res
 */
const VideoPost = async (req, res) => {
    if (req.query && req.query.userId) {
        const video = new Video();

        video.name = req.body.name;
        video.url = req.body.url;

        const playlist = PlaylistPatch(video, req.query.userId);
        if (!playlist) {
            return res.status(422).json({ error: 'There was an error updating playlist' });
        }

        await video.save()
            .then(data => {
                res.header({ 'location': `/api/videos/?id=${data.id}` });
                res.status(201).json(data);
            })
            .catch(err => {
                console.error('error while saving the video', err);
                res.status(422).json({ error: 'There was an error saving the video' });
            });
    } else {
        res.status(404).json({ error: "User not specified" });
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
const PlaylistPatch = async (video, userId) => {
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
const VideoGet = async (req, res) => {
    if (req.query && req.query._idid) {
        await Video.findById(req.query._id)
            .then((video) => {
                res.header({
                    'location': `/api/videos/?id=${video._id}`
                }).json(video);
            })
            .catch(err => {
                res.status(404).json({ error: err });
                console.error('error while queryting the video', err);
            });
    } else if (req.query.userId) {
        const playlist = await Playlist.findOne({ userId: req.query.userId });
        if (!playlist) {
            return res.status(204).json({ error: 'Playlist not found' });
        }

        playlist.populate('videos')
            .then((data) => {
                res.header({
                    'location': `/api/videos/?id=${data._id}`
                }).json(data);
            })
            .catch(err => {
                res.status(404).json({ error: err });
                console.error('error while queryting the playlist', err);
            });
    } else {
        return res.status(400).json({ error: 'User ID is required' });
    }
}

/**
 * Updates the data of a video by its ID.
 *
 * @param {*} req
 * @param {*} res
 */
const VideoPatch = async (req, res) => {
    try {
        if (req.query && req.query._id) {
            const video = await Video.findById(req.query._id);

            if (!video) {
                return res.status(404).json({ error: "Video doesn't exist" });
            }

            video.name = req.body.name;
            video.url = req.body.url;

            await video.save()
                .then(data => {
                    res.status(200).json(data);
                    res.header({
                        'location': `/api/videos/?id=${data.id}`
                    })
                })
                .catch(err => {
                    console.error('Error while saving the video:', err);
                    res.status(422).json({ error: 'There was an error saving the video' });
                });
        } else {
            res.status(404).json({ error: "Video ID not specified" });
        }
    } catch (error) {
        console.error('Error while updating video:', error);
        res.status(500).json({ error: error });
    }
}


/**
 * Delete a video by its ID.
 *
 * @param {*} req
 * @param {*} res
 */
const VideoDelete = async (req, res) => {
    if (req.query && req.query._id) {

        const video = Video.findById(req.query._id);

        if (!video) {
            return res.status(404).json({ error: "Video does not exist" });
        }

        await Playlist.findOneAndUpdate(
            { userId: req.body.userId },
            { $pull: { videos: req.query._id } },
            { new: true }
        )
        .catch((err) => {
            return res.status(404).json({ error: 'Playlist not found' });
        });

        video.deleteOne({ _id: req.query._id })
            .then(() => {
                res.status(204).json({});
            })
            .catch((err) => {
                console.error('Error while deleting the video:', err);
                res.status(422).json({ error: 'There was an error deleting the video' });
            });
    } else {
        res.status(404);
        res.json({ error: "Video does not exist" })
    }
}

module.exports = {
    VideoGet,
    VideoPost,
    VideoPatch,
    VideoDelete
}