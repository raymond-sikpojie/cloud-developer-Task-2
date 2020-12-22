import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import {filterImageFromURL, deleteLocalFiles} from './util/util';


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  // GET /filteredimage endpoint
  // Filters, downloads and returns an image from a public url
  app.get("/filteredimage", async (req, res) => {
  
   let imageUrl = req.query.image_url
    
  //  validate imageUrl query
   if(!imageUrl) {
      return res.status(400).send("No URL present")
    }

    try{
      let filteredpath = await filterImageFromURL(imageUrl)
     
      res.status(200).sendFile(filteredpath, () => {
        deleteLocalFiles([filteredpath])
      })
  
    } catch(error){
      res.status(500).send("Server error")
    }
   
  })
    
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();