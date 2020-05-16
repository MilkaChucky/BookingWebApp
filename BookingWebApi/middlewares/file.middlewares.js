const fs = require('fs');
const path = require('path');
const { createHash } = require('crypto');

module.exports = {
    saveFiles: (folderPath) => async function (req, res, next) {
        if (!req.files) {
            return res.status(400).json({ message: 'Images not specified!' });
        }

        try {
            const promises = [];
            for (const key of Object.keys(req.files)) {
                const image = req.files[key];
                const extName = path.extname(image.name);
                const hash = createHash('sha256');

                hash.update(image.data);
                image.name = hash.digest('hex') + extName;

                const promise = image.mv(`${folderPath}/${image.name}`)
                    .then(() => {
                        return {
                            name: image.name,
                            mimetype: image.mimetype,
                            size: image.size
                        }
                    });
                promises.push(promise);
            }

            const infos = await Promise.allSettled(promises)
                .then(results => results
                    .filter(result => result.status === 'fulfilled')
                    .map(result => result.value)
                );

            req.uploadResult = {
                uploaded: promises.length,
                failed: promises.length - infos.length,
                savedImages: infos
            };

            return next();
        } catch (error) {
            return res.status(500).json({ error: error });
        }
    },
    deleteFiles: (folderPath) => async function (req, res, next) {
        if (!req.body || !req.body.images || !req.body.images.length) {
            return res.status(400).json({ message: 'Images not specified!' });
        }

        try {
            const promises = [];
            for (const image of req.body.images) {
                const promise = new Promise((resolve, reject) => {
                    fs.unlink(`${folderPath}/${image}`, (error) => {
                        if (error) reject(error);
                        resolve(image);
                    })
                })
                promises.push(promise);
            }

            const deleted = await Promise.allSettled(promises)
                .then(results => results
                    .filter(result => result.status === 'fulfilled')
                    .map(result => result.value)
                );

            req.deleteResult = {
                deletedImages: deleted
            };

            return next();
        } catch (error) {
            return res.status(500).json({ error: error });
        }
    }
}