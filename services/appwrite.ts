import { Client, Databases, ID, Query } from "appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const APPWRITE_ID = process.env.EXPO_PUBLIC_APPWRITE_ID!;

const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject(APPWRITE_ID);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
       const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
         Query.equal("searchTerm", [query]),
       ]);

       console.log(result); 

       if (result.documents.length > 0) {
              const existing_movie = result.documents[0];

              await database.updateDocument(
                     DATABASE_ID,
                     COLLECTION_ID,
                     existing_movie.$id,
                     {
                            count: existing_movie.count + 1,
                     }
                     
              )
       } else {
              await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                     searchTerm: query,
                     movie_id: movie?.id || 0,
                     poster_url: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` || "",
                     count: 1,
                     movie: movie,
              });
       }

}