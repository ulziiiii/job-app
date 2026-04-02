const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// Получить все вакансии (с поиском)
router.get("/", async (req, res) => {
  try {
    const { search, location } = req.query;
    let query = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };
    const jobs = await Job.find(query).populate("createdBy", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Создать вакансию
router.post("/", async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Подать заявку
router.post("/:id/apply", async (req, res) => {
  try {
    const { userId } = req.body;
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { applicants: userId } },
      { new: true }
    );
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Удалить вакансию
router.delete("/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Удалено" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
