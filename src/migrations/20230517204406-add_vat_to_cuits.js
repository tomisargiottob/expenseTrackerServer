export const up = async (db) => {
    await db.collection('cuits').updateMany({}, { $set: {vat:21, staticVat: true}})
};

export const down = async (db) => {
    await db.collection('cuits').updateMany({}, { $unset: {vat:1, staticVat: 1}})
};
