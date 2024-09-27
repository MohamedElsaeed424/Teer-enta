const Tag = require('../models/Tag');
const errorHandler = require("../Util/HandleErrors");

exports.getTags = async (req, res, next) => {
    try {
        const tags = await Tag.find();
        if(tags.length === 0) {
            return res.status(404).json({ message: 'No tags found' });
        }
        res.status(200).json({ tags });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.createTag = async (req, res, next) => {
    try {
        const createdBy = req.user._id;
        req.body.createdBy = createdBy

        const tag = await Tag.create(req.body);
        res.status(201).json({ message: 'Tag created successfully', tag });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.updateTag = async (req, res, next) => {
    try {
        const {id} = req.params.id;

        const updates = req.body;

        const updatedTag = await Tag.findByIdAndUpdate(
            id,
            updates,
            {new: true, runValidators: true, overwrite: false}
        );

        if(!updatedTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        res.status(200).json({
            message: 'Tag updated successfully',
            data: updatedTag
        });

    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.deleteTag = async (req, res, next) => {
    try {
        const {id} = req.params.id;

        const tag = await Tag.findById(id);
        if(!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        res.status(200).json({
            message: 'Tag deleted successfully',
            data: tag
        });

    } catch (err) {
        errorHandler.SendError(res, err);
    }
}