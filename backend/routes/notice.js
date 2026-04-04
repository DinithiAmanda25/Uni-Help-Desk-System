const express = require('express');

const router = express.Router();

const Notice = require('../models/notice');
const { attachRole, adminOnly, studentOrAdmin } = require('../middlewares/a');

const ALLOWED_CATEGORIES = ['academic', 'exams', 'events', 'library', 'holiday'];
const ALLOWED_TYPES = ['general', 'important', 'emergency'];
const ALLOWED_YEARS = ['all_years', '1st_year', '2nd_year', '3rd_year', '4th_year'];
const ALLOWED_FACULTIES = ['all_faculties', 'it', 'engineering', 'business'];

// Test
router.get('/test', (req, res) => res.send('Notice Route is Working ..'));

router.use(attachRole);

const parsePagination = (req) => {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 6, 1), 50);
    return { page, limit, skip: (page - 1) * limit };
};

const buildTargetCondition = ({ year, faculty }) => {
    const conditions = [];

    if (year && ALLOWED_YEARS.includes(year) && year !== 'all_years') {
        conditions.push({ 'target.years': { $in: ['all_years', year] } });
    }

    if (faculty && ALLOWED_FACULTIES.includes(faculty) && faculty !== 'all_faculties') {
        conditions.push({ 'target.faculties': { $in: ['all_faculties', faculty] } });
    }

    return conditions;
};

const buildFilters = (req, { activeOnly }) => {
    const { search, category, type, pinned, year, faculty } = req.query;
    const filters = {};
    const andFilters = [];

    if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        andFilters.push({
            $or: [
                { title: regex },
                { content: regex }
            ]
        });
    }

    if (category && category !== 'all' && ALLOWED_CATEGORIES.includes(category)) {
        filters.category = category;
    }

    if (type && type !== 'all' && ALLOWED_TYPES.includes(type)) {
        filters.type = type;
    }

    if (pinned === 'true') {
        filters.isPinned = true;
    }

    if (pinned === 'false') {
        filters.isPinned = false;
    }

    andFilters.push(...buildTargetCondition({ year, faculty }));

    if (activeOnly) {
        const now = new Date();
        andFilters.push({ startDate: { $lte: now } });
        andFilters.push({ endDate: { $gte: now } });
    }

    if (andFilters.length > 0) {
        filters.$and = andFilters;
    }

    return filters;
};

const normalizePayload = (payload) => {
    const normalized = {
        title: payload.title,
        content: payload.content,
        category: payload.category,
        type: payload.type || 'general',
        isPinned: payload.isPinned || false,
        target: {
            years: payload?.target?.years || 'all_years',
            faculties: payload?.target?.faculties || 'all_faculties'
        },
        startDate: payload.startDate,
        endDate: payload.endDate
    };

    if (!ALLOWED_YEARS.includes(normalized.target.years)) {
        throw new Error('Invalid target year');
    }

    if (!ALLOWED_FACULTIES.includes(normalized.target.faculties)) {
        throw new Error('Invalid target faculty');
    }

    if (!ALLOWED_CATEGORIES.includes(normalized.category)) {
        throw new Error('Invalid category');
    }

    if (!ALLOWED_TYPES.includes(normalized.type)) {
        throw new Error('Invalid priority type');
    }

    return normalized;
};

router.post('/', adminOnly, async (req, res) => {
    try {
        const payload = normalizePayload(req.body);
        const created = await Notice.create(payload);
        return res.status(201).json({ message: 'Notice created successfully', notice: created });
    } catch (error) {
        return res.status(400).json({ message: 'Notice creation failed', error: error.message });
    }
});

router.get('/', studentOrAdmin, async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req);
        const activeOnly = req.query.activeOnly !== 'false';
        const filters = buildFilters(req, { activeOnly });

        const [notices, total] = await Promise.all([
            Notice.find(filters)
                .sort({ isPinned: -1, priorityOrder: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Notice.countDocuments(filters)
        ]);

        return res.json({
            data: notices,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return res.status(400).json({ message: 'Failed to fetch notices', error: error.message });
    }
});

router.get('/stats', studentOrAdmin, async (req, res) => {
    try {
        const activeOnly = req.query.activeOnly !== 'false';
        const filters = buildFilters(req, { activeOnly });

        const [total, pinned, important, emergency, targeted] = await Promise.all([
            Notice.countDocuments(filters),
            Notice.countDocuments({ ...filters, isPinned: true }),
            Notice.countDocuments({ ...filters, type: 'important' }),
            Notice.countDocuments({ ...filters, type: 'emergency' }),
            Notice.countDocuments({
                ...filters,
                $or: [
                    { 'target.years': { $ne: 'all_years' } },
                    { 'target.faculties': { $ne: 'all_faculties' } }
                ]
            })
        ]);

        return res.json({ total, pinned, important, emergency, targeted });
    } catch (error) {
        return res.status(400).json({ message: 'Failed to fetch stats', error: error.message });
    }
});

router.get('/:id', studentOrAdmin, async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (!notice) {
            return res.status(404).json({ message: 'Cannot find this notice' });
        }

        return res.json(notice);
    } catch (error) {
        return res.status(400).json({ message: 'Cannot find this notice', error: error.message });
    }
});

router.put('/:id', adminOnly, async (req, res) => {
    try {
        const payload = normalizePayload(req.body);
        const updated = await Notice.findByIdAndUpdate(req.params.id, payload, {
            new: true,
            runValidators: true
        });

        if (!updated) {
            return res.status(404).json({ message: 'Notice not found' });
        }

        return res.json({ message: 'Notice updated successfully', notice: updated });
    } catch (error) {
        return res.status(400).json({ message: 'Notice update failed', error: error.message });
    }
});

router.patch('/:id/view', studentOrAdmin, async (req, res) => {
    try {
        const updated = await Notice.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Notice not found' });
        }

        return res.json({ message: 'View count updated', views: updated.views });
    } catch (error) {
        return res.status(400).json({ message: 'Failed to update views', error: error.message });
    }
});

router.delete('/:id', adminOnly, async (req, res) => {
    try {
        const deleted = await Notice.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Notice not found' });
        }

        return res.json({ message: 'Notice deleted successfully' });
    } catch (error) {
        return res.status(400).json({ message: 'Notice deletion failed', error: error.message });
    }
});

module.exports = router;