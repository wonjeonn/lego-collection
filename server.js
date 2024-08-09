const legoData = require("./modules/legoSets");
const express = require('express');
const path = require("path");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

legoData.initialize()
    .then(() => {
        app.get('/lego/addSet', (req, res) => {
            legoData.getAllThemes()
                .then((themes) => {
                    res.render('addSet', { themes });
                })
                .catch((err) => {
                    console.error(`Failed to retrieve themes: ${err}`);
                    res.status(500).render('500', { message: `Failed to retrieve themes: ${err}` });
                });
        });

        app.post('/lego/addSet', (req, res) => {
            const setData = {
                name: req.body.name,
                year: parseInt(req.body.year),
                num_parts: parseInt(req.body.num_parts),
                img_url: req.body.img_url,
                theme_id: parseInt(req.body.theme_id),
                set_num: req.body.set_num
            };

            legoData.addSet(setData)
                .then(() => {
                    res.redirect('/lego/sets');
                })
                .catch((err) => {
                    console.error(`Failed to add new set: ${err}`);
                    res.status(500).render('500', { message: `Failed to add new set: ${err}` });
                });
        });

        app.get('/', (req, res) => {
            legoData.getAllSets()
                .then((sets) => {
                    res.render('home', { sets, page: '/' });
                })
                .catch((err) => {
                    console.error(`Internal server error: ${err}`);
                    res.status(500).render('500', { message: "Internal server error occurred." });
                });
        });

        app.get('/about', (req, res) => {
            res.render('about', { page: '/about' });
        });

        app.get('/lego/sets', (req, res) => {
            const theme = req.query.theme;
            if (theme) {
                legoData.getSetsByTheme(theme)
                    .then((sets) => {
                        if (sets.length === 0) {
                            res.status(404).render('404', { message: `No sets found for theme "${theme}".` });
                        } else {
                            res.render('sets', { sets, page: '/lego/sets' });
                        }
                    })
                    .catch((err) => {
                        console.error(`Error retrieving sets for theme "${theme}": ${err}`);
                        res.status(500).render('500', { message: `Error retrieving sets for theme "${theme}": ${err}` });
                    });
            } else {
                legoData.getAllSets()
                    .then((sets) => {
                        res.render('sets', { sets, page: '/lego/sets' });
                    })
                    .catch((err) => {
                        console.error(`Error retrieving all sets: ${err}`);
                        res.status(500).render('500', { message: "Error retrieving all sets." });
                    });
            }
        });

        app.get('/lego/sets/:set_num', (req, res) => {
            const setNum = req.params.set_num;
            legoData.getSetByNum(setNum)
                .then((set) => {
                    if (!set) {
                        res.status(404).render('404', { message: `No set found with set number "${setNum}".` });
                    } else {
                        res.render('set', { set, page: '' });
                    }
                })
                .catch((err) => {
                    console.error(`Error retrieving set details for "${setNum}": ${err}`);
                    res.status(500).render('500', { message: `Error retrieving set details for "${setNum}": ${err}` });
                });
        });

        app.get('/lego/editSet/:num', (req, res) => {
            const setNum = req.params.num;
            Promise.all([
                legoData.getSetByNum(setNum),
                legoData.getAllThemes()
            ])
            .then(([setData, themeData]) => {
                if (!setData) {
                    res.status(404).render('404', { message: `No set found with set number "${setNum}".` });
                } else {
                    res.render('editSet', { themes: themeData, set: setData });
                }
            })
            .catch((err) => {
                console.error(`Error retrieving set details for "${setNum}": ${err}`);
                res.status(500).render('500', { message: `Error retrieving set details for "${setNum}": ${err}` });
            });
        });

        app.post('/lego/editSet', (req, res) => {
            const setNum = req.body.set_num;
            const setData = {
                name: req.body.name,
                year: parseInt(req.body.year),
                num_parts: parseInt(req.body.num_parts),
                img_url: req.body.img_url,
                theme_id: parseInt(req.body.theme_id)
            };

            legoData.editSet(setNum, setData)
                .then(() => {
                    res.redirect('/lego/sets');
                })
                .catch((err) => {
                    console.error(`Failed to update set "${setNum}": ${err}`);
                    res.status(500).render('500', { message: `Failed to update set "${setNum}": ${err}` });
                });
        });

        app.get('/lego/deleteSet/:num', (req, res) => {
            const setNum = req.params.num;
            legoData.deleteSet(setNum)
                .then(() => {
                    res.redirect('/lego/sets');
                })
                .catch((err) => {
                    console.error(`Failed to delete set "${setNum}": ${err}`);
                    res.status(500).render('500', { message: `Failed to delete set "${setNum}": ${err}` });
                });
        });

        app.use((req, res) => {
            res.status(404).render('404', { message: "The requested page could not be found." });
        });

        app.listen(HTTP_PORT, () => {
            console.log(`Server is running on http://localhost:${HTTP_PORT}`);
        });
    })
    .catch(err => {
        console.error(`Failed to initialize LEGO data: ${err}`);
    });
