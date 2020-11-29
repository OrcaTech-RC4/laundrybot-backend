const express = require('express');
const path = require('path');
const db = require('./models');
const logger = require('./logger/logger');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(logger);

// Body parser
app.use(express.json());
app.use(express.urlencoded({extended: true }));

const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on ${PORT}`);
    });
});



// app.get('/api/level/:id', (req, res) => {
//     const id = req.params.id;
//     const levels = [4, 7, 10, 13];

//     const found = levels.filter(value => value == id).length;

//     if (found) {
//         res.send(`Sending level ${id} data`);
//     } else {
//         res.status(400).json({
//             msg: `No laundry room in level ${id}`
//         })
//     }
// });






