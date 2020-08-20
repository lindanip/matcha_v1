const connection = require('../../config/db');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => 
{
    connection.query('SELECT DISTINCT(City) FROM users', (err, rows) => 
    {
        if (err){
            console.log('error');
            res.send('dberror');
        }
        else if (!rows[0])
            res.send('none');
        else
            res.send( rows );
    });
});

module.exports = router;
