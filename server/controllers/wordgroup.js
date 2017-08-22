const WordGroup = require('../models/wordgroups');

module.exports = {
    // CREATE
    async createWordGroup(ctx) {
        try {
            console.log(ctx);
            ctx.body = await WordGroup.create({
                wordGroupName: ctx.request.body.wordGroupName,
                createdAt: ctx.request.body.createdAt,
                updatedAt: ctx.request.body.updatedAt,
                userId: ctx.request.user.id
            });
        }
        catch (err) {
            ctx.throw(500, 'Problem with adding word in database', {err});
        }
    },
    // READ
    async getWordGroups(ctx) {
        try {
            ctx.body = await WordGroup.find({userId: ctx.request.user.id});
        }
        catch (err) {
            ctx.throw(500, 'Sorry, can\'t find wordGroups in database for that user', {err});
        }
    },
    // UPDATE
    async updateWordGroup(ctx) {
        try {
            console.log(ctx);
            ctx.body = await WordGroup.findByIdAndUpdate(
                ctx.request.body._id,
                {$set:
                    {
                        wordGroupName: ctx.request.body.wordGroupName
                    },
                $inc: {__v: 1}
                },
                {new: true},
                (err, updatedWordGroup) => {
                    if (err) throw err;
                    console.log('this is updated wordGroupName! \n');
                    console.log(updatedWordGroup);
                    console.log('\n wordGroupName is updated!');
                }
            );
        }
        catch (err) {
            ctx.throw(500, 'Problem with update wordGroup in database', {err});
        }
    },
    // DELETE
    async deleteWordGroup(ctx) {
        try {
            console.log(ctx.request.body._id);
            ctx.body = await WordGroup.remove({_id: ctx.request.body._id}, () => {
                console.log('deleting wordGroup is successfull');
            });
        }
        catch (err) {
            ctx.throw(500, 'Problem with deleting wordGroup from database', {err});
        }
    }
};
