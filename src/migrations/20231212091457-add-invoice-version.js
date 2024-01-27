export const up = async (db) => {
    await db.collection('invoices').updateMany({}, { $set: {version:'v1'}})
};

export const down = async (db) => {
    await db.collection('invoices').updateMany({}, { $unset: {version:1}})
};
