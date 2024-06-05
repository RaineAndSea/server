import cors from "cors";
import express from "express";
import "./loadEnvironment.mjs";
import { productRouter } from "./router/ProductRouter.mjs";
import { UserRouter } from "./router/UserRouter.mjs";
import variants from './routes/variants.mjs';

const PORT = process.env.PORT || 5050;
// export const BASE_QUERY = 'http://localhost:5050/';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', UserRouter);
app.use('/products', productRouter);
app.use('/variants', variants);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

/* Commenting out because cyclic allows cron expressions to be defined via their dashboard */
// cron.schedule("0 0 * * *", function() {
//     console.log("running a task every minute");
//     request.post(BASE_QUERY + '/pokemon', function (error, response, body) {
//        if (!error && response.statusCode == 200) {
//           console.log(body) // Print the google web page.
//        }
//     })
// })

// const obj1a = original;
// const obj2a = updated;
// function updateProducts(obj1, obj2) {
//   // Iterate through products in obj2
//   obj2.products.forEach(product2 => {
//       // Find the corresponding product in obj1 by title
//       const matchingProduct1 = obj1.products.find(product1 => product1.title === product2.title);
      
//       // If a matching product is found, update its category
//       if (matchingProduct1) {
//           matchingProduct1.category = product2.category;
//       }
//   });
// }

// updateProducts(obj1a, obj2a);
// console.log(JSON.stringify(obj1a));
// const crystalKeywords = ["Rose Quartz","Clear Quartz","Opalite","Green Aventurine","Tigers Eye","Amethyst","Labradorite","Aquamarine","Moonstone","Fluorite","Carnelian","Onyx","Malachite","Prehnite","Blue Aventurine","Blue Tigers Eye","Rainbow Moonstone","Selenite","Citrine","Hematite","Black Tourmaline","Fire Agate","Bloodstone","Lapis Lazuli","Peridot","Sodalite","Carnelian","Chrysocolla","Kyanite","Larimar","Obsidian","Rhodochrosite","Rhodonite","Ruby","Sunstone","Tourmaline","Turquoise","Fluorite","Jade","Garnet"]
// function populateCrystals() {
//   const objects = original.products;

//   objects.forEach(obj => {
//       obj.crystals = [];
//       const title = obj.title.toLowerCase();
//       crystalKeywords.forEach(crystal => {
//           if (title.includes(crystal.toLowerCase())) {
//               obj.crystals.push(crystal);
//           }
//       });
//   });
// }

// populateCrystals();

// console.log(JSON.stringify(original));


export default app;