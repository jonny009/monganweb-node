var mwData = {
        contentSections: [
            {"title": "home"},
            {"title": "development"},
            {"title": "clients"},
            {"title": "portfolio"},
            {"title": "contact"}
        ],
        clientList: ['Ancestry.com', 'Blue Diamond', 'Blue Fig', 'City of Roseville', 'CoreLogic', 'Earcrush', 'Global Discoveries', 'Johnson Gray', 'Mansfield Ink', 'McAfee', 'Perry Communications Group, Inc.', 'Phillips Law', 'Psomas', 'San Mateo Credit Union', 'Shari\'s Berries', 'Singleton & Self', 'Sutter Health', 'Western Blue'],
        contactInfo: {
            "phone": "916.412.9580",
            "email": "jon@monganweb.com",
            "resume": "public/images/Jon-Mongan-resume.pdf",
            "linkedin": "http://www.linkedin.com/pub/jon-mongan/a/9b/36b"
        }
    };
exports.index = function (req, res) {
    var template_engine = req.app.settings.template_engine;
    // res.locals.session = req.session;
  res.render('index', {mwData: mwData});
};