const express = require('express'); 
const router = express.Router(); 
const DiaryEntry = require('../models/diaryModel');

// Add to diary
router.post('/addtodiary', (req, res, next) => {
    let newEntry = new DiaryEntry({
        title: req.body.title,
        startDate: req.body.startDate,
        dueDate: req.body.dueDate,
        lecturer: req.body.lecturer,
        groups: req.body.groups,
        room: req.body.room,
        module: req.body.module
    });

    // Save New Diary Entry & Check For Errors
    newEntry.save(function(err) {
        if(err)
            res.send(err);

        else
            res.json({ message: 'Entry Added to DB!' });
    });
});

// Retrieve All Diary Entries
router.get('/diaryentries', (req, res) => {
    DiaryEntry.find({}, function (err, entry) {
        if (err)
            res.send(err);
        
        res.json(entry);
    });
});

// Retrieve an Entry
 router.get('/diaryentry', (req, res) => {
    DiaryEntry.find({ _id: req.params.diaryId }, function(err, entry) {
        if(err)
            res.send(err);
        
        res.json(entry);
    });
}); 

// Update an Entry
router.put('/updateentry', (req, res) => {
    DiaryEntry.findOneAndUpdate({_id: req.params.diaryId}, req.body,
    { new: true }, function (err, entry) {
        if(err)
            res.send(err);
        
        res.json(entry);
    })
});

module.exports = router;