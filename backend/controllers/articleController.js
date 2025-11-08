const Article = require('../models/Article');
const path = require('path');
const fs = require('fs');

exports.getArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;

    const total = await Article.countDocuments();
    const articles = await Article.find().skip(skip).limit(limit);

    res.json({
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      articles,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.createArticle = async (req, res) => {
  try {
    const { name, description, price, category, isAvailable } = req.body;
    const imageUrl = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      : '';

    const article = await Article.create({
      name,
      description,
      price,
      imageUrl,
      category,
      isAvailable,
    });

    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const { name, description, price, category, isAvailable, imageUrl: imageUrlFromBody } = req.body;

    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    let newImageUrl = article.imageUrl;

    if (req.file) {
      newImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

      if (article.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', path.basename(article.imageUrl));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    } else if (imageUrlFromBody) {
      newImageUrl = imageUrlFromBody;
    }

    const updatedFields = {
      name,
      description,
      price: parseFloat(price),
      imageUrl: newImageUrl,
      category,
      isAvailable: isAvailable === 'true' || isAvailable === true,
      updatedAt: Date.now(),
    };

    const updatedArticle = await Article.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    res.json({ message: 'Article mis à jour avec succès', article: updatedArticle });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error);
    res.status(400).json({ message: error.message });
  }
};





exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

   
    if (article.imageUrl) {
      const imagePath = path.join(__dirname, '..', article.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

  
    await Article.deleteOne({ _id: req.params.id });
    res.json({ message: 'Article removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
