export const up = async (db) => {
    await db.collection('users').updateMany({}, { $unset: {maxCuits:1}})
    await db.collection('organizations').updateMany({}, { $set: {maxCuits:5, freeAccount: false}})
    await db.collection('organizations').updateMany({createdAt: undefined}, { $set: {createdAt: new Date()}})
};

export const down = async (db) => {
    await db.collection('users').updateMany({}, { $set: {maxCuits: 5}})
    await db.collection('organizations').updateMany({}, { $unset: {maxCuits:1, freeAccount: 1, createdAt: 1}})
};
