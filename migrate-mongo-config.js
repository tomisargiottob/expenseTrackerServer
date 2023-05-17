// In this file you can configure migrate-mongo
import dotenv from 'dotenv'

dotenv.config()

let url;
if (process.env.DATABASE_ENV === 'develop') {
    url = process.env.DB_DEVELOP_URI
} else {
    url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.gifny.mongodb.net`
}
console.log(url)
const config = {
    mongodb: {
        // TODO Change (or review) the url to your MongoDB:
        url,

        // TODO Change this to your database name:
        databaseName: process.env.DB_NAME,

        options: {
            useNewUrlParser: true, // removes a deprecation warning when connecting
            useUnifiedTopology: true, // removes a deprecating warning when connecting
            //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
            //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
        }
    },

    // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
    migrationsDir: "src/migrations",

    // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
    changelogCollectionName: "changelog",

    // The file extension to create migrations and search for in migration dir
    migrationFileExtension: ".js",

    // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determin
    // if the file should be run.  Requires that scripts are coded to be run multiple times.
    useFileHash: false,

    // Don't change this, unless you know what you're doing
    moduleSystem: 'esm',
};

export default config;