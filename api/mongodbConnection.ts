import { MongoClient, ServerApiVersion } from "mongodb";

const uri =
	"mongodb+srv://dtsri:eotQXz0t4cicv7F9@estateapp.fbqlzwh.mongodb.net/?retryWrites=true&w=majority&appName=estateapp";

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		await client.connect();
		await client.db("admin").command({ ping: 1 });
		console.log(`pinged your deployment`);
	} finally {
		await client.close();
	}
}

run().catch(console.dir);
