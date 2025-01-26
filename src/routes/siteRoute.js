const app = require("express")();

const {
  create,
  getSites,
  getSiteById,
  UpdateSiteById,
  deleteSiteById,
} = require("../controllers/siteController");

app.post("/create", create);
app.post("/get-sites", getSites);
app.post("/get-site-by-id", getSiteById);
app.post("/update-site-by-id/:id", UpdateSiteById);
app.post("/delete-site-by-id", deleteSiteById);

module.exports = app;
