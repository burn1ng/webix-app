const WordGroup = require('../models/wordgroups');
const Word = require('../models/words');

module.exports = {
    // CREATE
    async createWordGroup(ctx) {
        try {
            let currentUser = ctx.request.user;
            let req = ctx.request.body;

            let resFromDb = await WordGroup.create(
                {
                    _creator: currentUser,
                    wordGroupName: req.wordGroupName
                }
            );
            ctx.body = {
                _id: resFromDb._id,
                wordGroupName: resFromDb.wordGroupName,
                createdAt: resFromDb.createdAt,
                updatedAt: resFromDb.updatedAt
            };
        }
        catch (err) {
            ctx.throw(500, 'Problem with adding word in database', {err});
        }
    },
    // READ
    async getWordGroups(ctx) {
        try {
            let currentUser = ctx.request.user;
            ctx.body = await WordGroup.find(
                {_creator: currentUser},
                {
                    wordGroupName: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            ).lean().then(async (wordgroups) => {
                for (let i = 0; i < wordgroups.length; i++) {
                    let count = await Word.count({_wordGroup: wordgroups[i]._id});
                    wordgroups[i].count = count;
                }
                return wordgroups;
            });
        }
        catch (err) {
            ctx.throw(500, 'Sorry, can\'t find wordGroups in database for that user', {err});
        }
    },
    // READ
    async getWordsByWordGroupId(ctx) {
        try {
            ctx.body = await Word.find({_wordGroup: ctx.request.query.id});
        }
        catch (err) {
            ctx.throw(500, 'Sorry, can\'t find words in database for that id', {err});
        }
    },
    // UPDATE
    async updateWordGroup(ctx) {
        try {
            let updatedWordGroup = await WordGroup.findByIdAndUpdate(
                ctx.request.body._id,
                {$set:
                    {
                        wordGroupName: ctx.request.body.wordGroupName
                    },
                $inc: {__v: 1}
                },
                {new: true}
            );
            ctx.body = {
                wordGroupName: updatedWordGroup.wordGroupName,
                createdAt: updatedWordGroup.createdAt,
                updatedAt: updatedWordGroup.updatedAt
            };
        }
        catch (err) {
            ctx.throw(500, 'Problem with update wordGroup in database', {err});
        }
    },
    // DELETE
    async deleteWordGroup(ctx) {
        try {
            console.log(ctx.request.body);

            await WordGroup.remove({_id: ctx.request.body._id});
            await Word.remove({_wordGroup: ctx.request.body._id});
            // console.log(await Word.remove({_wordGroup: ctx.request.body._id}));
            ctx.status = 200;
            ctx.body = {message: 'Record was deleted successfully'};
        }
        catch (err) {
            ctx.throw(500, 'Problem with deleting wordGroup from database', {err});
        }
    }
};
